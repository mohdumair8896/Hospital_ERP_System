import * as path from 'node:path';
import { AuditDatabase } from '../apps/audit-service/dist/database.js';

console.log('====================================================');
console.log('🔐 HOSPITAL AUDIT DATABASE INTEGRITY VERIFICATION');
console.log('   Enforcing HIPAA § 164.312(b) & NABH Compliance');
console.log('====================================================\n');

async function run() {
  try {
    const dbPath = path.resolve(process.cwd(), 'apps/audit-service/audit.db');
    const auditDb = new AuditDatabase(dbPath);
    const stats = await auditDb.getStats();

    console.log(`📊 Current Database Volume: ${stats.totalRecords} total persistent audit logs`);
    console.log(`🚨 Break-Glass Emergency Overrides Logged: ${stats.breakGlassCount}`);
    console.log('Action Distribution:');
    for (const a of stats.actionDistribution || []) {
      console.log(`  - ${a.action.padEnd(24)}: ${a.count} events`);
    }

    console.log('\n⏳ Recalculating SHA-256 cryptographic chain from Genesis Block...');
    const result = await auditDb.verifyIntegrity();

    if (result.verified) {
      console.log('\n✅ VERIFICATION RESULT: PASS');
      console.log('   Mathematical proof valid across all records.');
      console.log(`   Total Records Audited: ${result.totalRecordsChecked}`);
      console.log(`   Genesis Hash: ${result.genesisHash.substring(0, 24)}...`);
      console.log(`   Latest Tip:   ${result.latestHash.substring(0, 24)}...`);
      console.log(`   Verified At:  ${result.verifiedAt}\n`);
      process.exit(0);
    } else {
      console.error('\n❌ VERIFICATION RESULT: FAILED - TAMPERING DETECTED!');
      console.error(`   Tampered Record IDs: ${result.tamperedRecordIds.join(', ')}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('Failed to run verification:', err);
    process.exit(1);
  }
}

run();
