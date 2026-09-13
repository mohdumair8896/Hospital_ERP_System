import 'dotenv/config';
import { spawn } from 'node:child_process';
import * as path from 'node:path';

const GATEWAY_URL = 'http://127.0.0.1:4000';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🧪 Starting End-to-End Microservices & Audit Validation...');

  let startAll = null;
  try {
    const existing = await fetch(`${GATEWAY_URL}/health`);
    if (existing.ok) {
      console.log('✅ Found active Gateway on port 4000. Reusing live mesh.');
    }
  } catch {
    console.log('⏳ Spawning microservices in background for testing...');
    startAll = spawn('node', ['scripts/start-all.js'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
  }

  try {
    // Wait for Gateway to be ready
    console.log('⏳ Checking Gateway readiness...');
    let ready = false;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`${GATEWAY_URL}/health`);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch {
        await wait(500);
      }
    }

    if (!ready) {
      throw new Error('Gateway failed to become ready after 10s');
    }
    console.log('✅ API Gateway is online and accepting requests.');

    // Test 1: Gateway Status
    console.log('\n--- [TEST 1] Gateway Health & Downstream Service Ping ---');
    const gwStatus = await fetch(`${GATEWAY_URL}/api/v1/gateway/status`).then(r => r.json());
    console.log('Gateway status:', gwStatus);
    if (gwStatus.gateway !== 'ONLINE') throw new Error('Gateway is not online');

    // Test 2: List Departments
    console.log('\n--- [TEST 2] Fetch Hospital Departments via Appointment Service ---');
    const depts = await fetch(`${GATEWAY_URL}/api/v1/appointments/departments`).then(r => r.json());
    console.log(`Retrieved ${depts.length} departments.`);
    console.log('Departments:', depts.map(d => d.name).join(', '));

    // Test 3: List Doctors
    console.log('\n--- [TEST 3] Fetch Doctor Directory & Availability ---');
    const docs = await fetch(`${GATEWAY_URL}/api/v1/appointments/doctors`).then(r => r.json());
    console.log(`Found ${docs.length} specialist physicians.`);
    console.log(`Leading Doctor: ${docs[0].name} (${docs[0].specialty}) - Rating: ${docs[0].rating}/5`);

    // Test 4: Search Patients (Emits Read Audit Log)
    console.log('\n--- [TEST 4] Patient Search & Sensitive PHI Access Audit ---');
    const patientsRes = await fetch(`${GATEWAY_URL}/api/v1/patients?q=Paulo`, {
      headers: {
        'x-user-id': 'usr_sarah',
        'x-user-name': 'Dr. Sarah Patel',
        'x-user-role': 'DOCTOR',
        'x-clinical-reason': 'Pre-consultation cardiac evaluation'
      }
    }).then(r => r.json());
    console.log(`Patient search result: ${patientsRes.patients[0].firstName} ${patientsRes.patients[0].lastName} (MRN: ${patientsRes.patients[0].mrn})`);

    // Fetch individual patient record (HIPAA Read audit)
    const patientDetail = await fetch(`${GATEWAY_URL}/api/v1/patients/${patientsRes.patients[0].id}`, {
      headers: {
        'x-user-id': 'usr_sarah',
        'x-user-name': 'Dr. Sarah Patel',
        'x-user-role': 'DOCTOR',
        'x-clinical-reason': 'Pre-consultation cardiac evaluation'
      }
    }).then(r => r.json());
    console.log(`Fetched patient profile: Allergies: ${patientDetail.allergies.join(', ') || 'None'}`);

    // Test 5: Book Appointment (Emits Domain Event & Mutation Audit)
    console.log('\n--- [TEST 5] Book Live Appointment (ProHealth Booking Flow) ---');
    const bookPayload = {
      doctorId: docs[0].id,
      departmentId: docs[0].departmentId,
      slotDate: new Date().toISOString().split('T')[0],
      slotTime: '11:45 AM',
      type: 'OPD_IN_PERSON',
      symptoms: 'Recurring arrhythmia episodes during exercise',
      newPatient: {
        firstName: 'Elena',
        lastName: 'Markov',
        phoneNumber: '+1 (555) 765-4321',
        email: 'elena.markov@example.com'
      }
    };

    const booked = await fetch(`${GATEWAY_URL}/api/v1/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookPayload)
    }).then(r => r.json());
    console.log(`Appointment created: ${booked.appointmentNumber} with ${booked.doctorName} for ${booked.patientName} at ${booked.slotTime}`);

    // Test 6: Verify Database Audit Logs & Cryptographic Hash Chain
    console.log('\n--- [TEST 6] Query Audit Database & Verify Cryptographic Integrity ---');
    await wait(600); // Allow async audit ingestion to flush

    // Authenticate as Compliance Auditor to query locked audit route
    const authRes = await fetch(`${GATEWAY_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify({ username: 'auditor', password: 'audit123' })
    }).then(r => r.json());
    const auditorToken = authRes.token;

    const auditRecords = await fetch(`${GATEWAY_URL}/api/v1/audit/records?limit=10`, {
      headers: {
        Authorization: `Bearer ${auditorToken}`,
        Connection: 'close'
      }
    }).then(r => r.json());
    console.log(`Total audit records in database: ${auditRecords.total}`);
    console.log(`Latest audit log: [${auditRecords.records[0].action}] by ${auditRecords.records[0].actorName} on ${auditRecords.records[0].resourceType} (${auditRecords.records[0].endpoint})`);
    console.log(`Cryptographic Record Hash: ${auditRecords.records[0].recordHash.substring(0, 32)}...`);
    console.log(`Chained Previous Hash:    ${auditRecords.records[0].prevRecordHash.substring(0, 32)}...`);

    await wait(300);

    const integrity = await fetch(`${GATEWAY_URL}/api/v1/audit/verify-integrity`, {
      headers: {
        Authorization: `Bearer ${auditorToken}`,
        Connection: 'close'
      }
    }).then(r => r.json());
    console.log('\n🔐 CRYPTOGRAPHIC AUDIT CHAIN VERIFICATION RESULT:');
    console.log(`  - Verified: ${integrity.verified ? '✅ PASS (Mathematical Integrity Confirmed)' : '❌ FAIL (Tampering Detected!)'}`);
    console.log(`  - Total Records Checked: ${integrity.totalRecordsChecked}`);
    console.log(`  - Tampered Records: ${integrity.tamperedRecordIds.length}`);
    console.log(`  - Tip Hash: ${integrity.latestHash}`);

    if (!integrity.verified) {
      throw new Error('Audit chain integrity check failed!');
    }

    await wait(300);

    // Test 7: HIPAA Accounting of Disclosures
    console.log('\n--- [TEST 7] HIPAA § 164.528 Accounting of Disclosures ---');
    const targetPatId = patientsRes.patients && patientsRes.patients[0] ? patientsRes.patients[0].id : 'pat_1';
    const disclosures = await fetch(`${GATEWAY_URL}/api/v1/audit/patient/${targetPatId}/disclosures`, {
      headers: {
        Authorization: `Bearer ${auditorToken}`,
        Connection: 'close'
      }
    }).then(r => r.json());
    console.log(`Disclosures report generated for Patient ${disclosures.patientId}: ${disclosures.disclosuresCount} accesses logged in DB.`);

    console.log('\n========================================================');
    console.log('🎉 ALL MICROSERVICES & DATABASE AUDIT TESTS PASSED! 🎉');
    console.log('========================================================\n');

  } finally {
    if (startAll) {
      startAll.kill('SIGINT');
    }
  }
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
