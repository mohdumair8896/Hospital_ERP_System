-- ==========================================================
-- HOSPITAL PLATFORM ENTERPRISE DATABASE INITIALIZATION SCRIPT
-- Strictly enforces the Database-Per-Service Architecture
-- ==========================================================

-- 1. Create Independent Domain Databases
CREATE DATABASE auth_db;
CREATE DATABASE patient_db;
CREATE DATABASE appointment_db;
CREATE DATABASE clinical_db;
CREATE DATABASE audit_db;

-- Connect to audit_db to setup partitioned HIPAA audit tables
\c audit_db;

CREATE TABLE audit_records (
    id VARCHAR(64) NOT NULL,
    sequence_number BIGSERIAL NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    trace_id VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    client_ip VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    action VARCHAR(32) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,
    execution_time_ms INT NOT NULL,
    clinical_reason TEXT,
    diff_json JSONB,
    prev_record_hash VARCHAR(64) NOT NULL,
    record_hash VARCHAR(64) NOT NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create Monthly Partitions for high-performance scaling & data lifecycle management
CREATE TABLE audit_records_2026_09 PARTITION OF audit_records
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE audit_records_2026_10 PARTITION OF audit_records
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE audit_records_default PARTITION OF audit_records DEFAULT;

-- Cryptographic indexes
CREATE INDEX idx_audit_timestamp ON audit_records(timestamp DESC);
CREATE INDEX idx_audit_actor ON audit_records(actor_id);
CREATE INDEX idx_audit_resource ON audit_records(resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_records(action);
CREATE INDEX idx_audit_seq ON audit_records(sequence_number);

-- Enforce append-only permissions
CREATE ROLE audit_ingest_worker WITH LOGIN PASSWORD 'IngestWorkerSecret2026!';
GRANT INSERT ON ALL TABLES IN SCHEMA public TO audit_ingest_worker;
REVOKE UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM audit_ingest_worker;

CREATE ROLE compliance_auditor_role WITH LOGIN PASSWORD 'AuditorReadOnly2026!';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO compliance_auditor_role;
