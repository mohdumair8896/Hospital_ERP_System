import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  AuditRecord,
  AuditSearchQuery,
  AuditIntegrityVerificationResult
} from '@hospital/contracts';
import { computeRecordHash } from '@hospital/audit-client';
import * as neonDb from '@hospital/database';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export class AuditDatabase {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const defaultPath = typeof __dirname !== 'undefined'
      ? path.resolve(__dirname, '../audit.db')
      : path.resolve(process.cwd(), 'audit.db');
    const resolvedPath = dbPath || process.env.AUDIT_DB_PATH || defaultPath;

    // Ensure directory exists
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(resolvedPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      CREATE TABLE IF NOT EXISTS audit_records (
        id TEXT PRIMARY KEY,
        sequence_number INTEGER UNIQUE NOT NULL,
        timestamp TEXT NOT NULL,
        trace_id TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        client_ip TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        description TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        http_method TEXT NOT NULL,
        status_code INTEGER NOT NULL,
        execution_time_ms INTEGER NOT NULL,
        clinical_reason TEXT,
        diff_json TEXT,
        prev_record_hash TEXT NOT NULL,
        record_hash TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_records(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_records(actor_id);
      CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_records(resource_type, resource_id);
      CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_records(action);
    `);
  }

  private appendQueue: Promise<any> = Promise.resolve();

  public async appendRecord(
    entry: Omit<AuditRecord, 'id' | 'sequenceNumber' | 'prevRecordHash' | 'recordHash'>
  ): Promise<AuditRecord> {
    return new Promise<AuditRecord>((resolve, reject) => {
      this.appendQueue = this.appendQueue
        .then(async () => {
          try {
            const res = await this.processAppendRecord(entry);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        })
        .catch(reject);
    });
  }

  private async processAppendRecord(
    entry: Omit<AuditRecord, 'id' | 'sequenceNumber' | 'prevRecordHash' | 'recordHash'>
  ): Promise<AuditRecord> {
    if (process.env.DATABASE_URL) {
      try {
        const latest = await neonDb.getLatestAuditRecord();
        const nextSeq = latest ? latest.sequenceNumber + 1 : 1;
        const prevHash = latest ? latest.recordHash : GENESIS_HASH;
        const id = `aud_${Date.now()}_${nextSeq.toString().padStart(8, '0')}`;

        const partialRecord: Omit<AuditRecord, 'recordHash'> = {
          ...entry,
          id,
          sequenceNumber: nextSeq,
          prevRecordHash: prevHash
        };

        const recordHash = computeRecordHash(partialRecord, prevHash);
        const fullRecord: AuditRecord = {
          ...partialRecord,
          recordHash
        };

        await neonDb.insertAuditRecord(fullRecord);
        try {
          this.insertLocal(fullRecord);
        } catch {
          // ignore local duplicate if any
        }
        return fullRecord;
      } catch (err) {
        console.error('[AuditDatabase] Neon appendRecord error, using local fallback:', err);
      }
    }

    return this.appendRecordLocal(entry);
  }

  private insertLocal(fullRecord: AuditRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO audit_records (
        id, sequence_number, timestamp, trace_id, actor_id, actor_name, actor_role,
        client_ip, user_agent, action, resource_type, resource_id, description,
        endpoint, http_method, status_code, execution_time_ms, clinical_reason,
        diff_json, prev_record_hash, record_hash
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    stmt.run(
      fullRecord.id,
      fullRecord.sequenceNumber,
      fullRecord.timestamp,
      fullRecord.traceId,
      fullRecord.actorId,
      fullRecord.actorName,
      fullRecord.actorRole,
      fullRecord.clientIp,
      fullRecord.userAgent,
      fullRecord.action,
      fullRecord.resourceType,
      fullRecord.resourceId,
      fullRecord.description,
      fullRecord.endpoint,
      fullRecord.httpMethod,
      fullRecord.statusCode,
      fullRecord.executionTimeMs,
      fullRecord.clinicalReason || null,
      fullRecord.diffJson || null,
      fullRecord.prevRecordHash,
      fullRecord.recordHash
    );
  }

  private appendRecordLocal(
    entry: Omit<AuditRecord, 'id' | 'sequenceNumber' | 'prevRecordHash' | 'recordHash'>
  ): AuditRecord {
    const latestQuery = this.db.prepare(
      `SELECT sequence_number, record_hash FROM audit_records ORDER BY sequence_number DESC LIMIT 1`
    );
    const latest = latestQuery.get() as { sequence_number: number; record_hash: string } | undefined;

    const nextSeq = latest ? latest.sequence_number + 1 : 1;
    const prevHash = latest ? latest.record_hash : GENESIS_HASH;
    const id = `aud_${Date.now()}_${nextSeq.toString().padStart(8, '0')}`;

    const partialRecord: Omit<AuditRecord, 'recordHash'> = {
      ...entry,
      id,
      sequenceNumber: nextSeq,
      prevRecordHash: prevHash
    };

    const recordHash = computeRecordHash(partialRecord, prevHash);

    const fullRecord: AuditRecord = {
      ...partialRecord,
      recordHash
    };

    this.insertLocal(fullRecord);
    return fullRecord;
  }

  public async query(query: AuditSearchQuery): Promise<{ total: number; records: AuditRecord[] }> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.getAuditRecords(query);
      } catch (err) {
        console.error('[AuditDatabase] Neon query error, using local fallback:', err);
      }
    }

    return this.queryLocal(query);
  }

  private queryLocal(query: AuditSearchQuery): { total: number; records: AuditRecord[] } {
    let sql = `SELECT * FROM audit_records WHERE 1=1`;
    const params: any[] = [];

    if (query.actorId) {
      sql += ` AND actor_id = ?`;
      params.push(query.actorId);
    }
    if (query.action) {
      sql += ` AND action = ?`;
      params.push(query.action);
    }
    if (query.resourceType) {
      sql += ` AND resource_type = ?`;
      params.push(query.resourceType);
    }
    if (query.resourceId) {
      sql += ` AND resource_id = ?`;
      params.push(query.resourceId);
    }
    if (query.startDate) {
      sql += ` AND timestamp >= ?`;
      params.push(query.startDate);
    }
    if (query.endDate) {
      sql += ` AND timestamp <= ?`;
      params.push(query.endDate);
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as cnt');
    const countStmt = this.db.prepare(countSql);
    const countResult = countStmt.get(...params) as { cnt: number };

    sql += ` ORDER BY sequence_number DESC LIMIT ? OFFSET ?`;
    const limit = query.limit || 50;
    const offset = query.offset || 0;
    params.push(limit, offset);

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    const records: AuditRecord[] = rows.map(r => ({
      id: r.id,
      sequenceNumber: r.sequence_number,
      timestamp: r.timestamp,
      traceId: r.trace_id,
      actorId: r.actor_id,
      actorName: r.actor_name,
      actorRole: r.actor_role,
      clientIp: r.client_ip,
      userAgent: r.user_agent,
      action: r.action,
      resourceType: r.resource_type,
      resourceId: r.resource_id,
      description: r.description,
      endpoint: r.endpoint,
      httpMethod: r.http_method,
      statusCode: r.status_code,
      executionTimeMs: r.execution_time_ms,
      clinicalReason: r.clinical_reason,
      diffJson: r.diff_json,
      prevRecordHash: r.prev_record_hash,
      recordHash: r.record_hash
    }));

    return { total: countResult.cnt, records };
  }

  public async verifyIntegrity(): Promise<AuditIntegrityVerificationResult> {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await neonDb.getAllAuditRecordsAsc();
        return this.verifyIntegrityFromRecords(rows);
      } catch (err) {
        console.error('[AuditDatabase] Neon verifyIntegrity error, using local fallback:', err);
      }
    }
    return this.verifyIntegrityLocal();
  }

  private verifyIntegrityFromRecords(rows: AuditRecord[]): AuditIntegrityVerificationResult {
    let expectedPrevHash = GENESIS_HASH;
    let expectedSeq = 0; // Genesis block starts at 0 or 1
    const tamperedIds: string[] = [];

    for (const row of rows) {
      if (expectedSeq === 0 && row.sequenceNumber === 0) {
        // Genesis block
        expectedPrevHash = row.recordHash;
        expectedSeq = 1;
        continue;
      }

      if (row.sequenceNumber !== expectedSeq) {
        tamperedIds.push(row.id);
      }

      if (row.prevRecordHash !== expectedPrevHash) {
        tamperedIds.push(row.id);
      }

      const computedHash = computeRecordHash({
        id: row.id,
        sequenceNumber: row.sequenceNumber,
        timestamp: row.timestamp,
        traceId: row.traceId,
        actorId: row.actorId,
        actorName: row.actorName,
        actorRole: row.actorRole,
        clientIp: row.clientIp,
        userAgent: row.userAgent,
        action: row.action,
        resourceType: row.resourceType,
        resourceId: row.resourceId,
        description: row.description,
        endpoint: row.endpoint,
        httpMethod: row.httpMethod,
        statusCode: row.statusCode,
        executionTimeMs: row.executionTimeMs,
        clinicalReason: row.clinicalReason,
        diffJson: row.diffJson,
        prevRecordHash: row.prevRecordHash
      }, row.prevRecordHash);

      if (computedHash !== row.recordHash) {
        tamperedIds.push(row.id);
      }

      expectedPrevHash = row.recordHash;
      expectedSeq++;
    }

    return {
      verified: tamperedIds.length === 0,
      totalRecordsChecked: rows.length,
      tamperedRecordIds: tamperedIds,
      genesisHash: GENESIS_HASH,
      latestHash: expectedPrevHash,
      verifiedAt: new Date().toISOString()
    };
  }

  private verifyIntegrityLocal(): AuditIntegrityVerificationResult {
    const stmt = this.db.prepare(`SELECT * FROM audit_records ORDER BY sequence_number ASC`);
    const rows = stmt.all() as any[];

    const records: AuditRecord[] = rows.map(r => ({
      id: r.id,
      sequenceNumber: r.sequence_number,
      timestamp: r.timestamp,
      traceId: r.trace_id,
      actorId: r.actor_id,
      actorName: r.actor_name,
      actorRole: r.actor_role,
      clientIp: r.client_ip,
      userAgent: r.user_agent,
      action: r.action,
      resourceType: r.resource_type,
      resourceId: r.resource_id,
      description: r.description,
      endpoint: r.endpoint,
      httpMethod: r.http_method,
      statusCode: r.status_code,
      executionTimeMs: r.execution_time_ms,
      clinicalReason: r.clinical_reason,
      diffJson: r.diff_json,
      prevRecordHash: r.prev_record_hash,
      recordHash: r.record_hash
    }));

    return this.verifyIntegrityFromRecords(records);
  }

  public async getStats(): Promise<{
    totalRecords: number;
    actionDistribution: { action: string; count: number }[];
    breakGlassCount: number;
  }> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.getAuditStatsFromNeon();
      } catch (err) {
        console.error('[AuditDatabase] Neon getStats error, using local fallback:', err);
      }
    }
    return this.getStatsLocal();
  }

  private getStatsLocal() {
    const totalStmt = this.db.prepare(`SELECT COUNT(*) as total FROM audit_records`);
    const total = (totalStmt.get() as { total: number }).total;

    const actionsStmt = this.db.prepare(`
      SELECT action, COUNT(*) as count FROM audit_records GROUP BY action
    `);
    const actions = actionsStmt.all() as { action: string; count: number }[];

    const breakGlassStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM audit_records WHERE action = 'BREAK_GLASS_OVERRIDE'
    `);
    const breakGlassCount = (breakGlassStmt.get() as { count: number }).count;

    return {
      totalRecords: total,
      actionDistribution: actions,
      breakGlassCount
    };
  }
}
