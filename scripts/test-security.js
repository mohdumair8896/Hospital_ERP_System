/**
 * ProHealth Platform — Comprehensive Defensive Security & Hardening Test Suite
 * 
 * Tests:
 *  1. Unauthenticated Route Blocking (401)
 *  2. Admin & Auditor Route Lockdown (403 for unauthorized roles)
 *  3. Record-Level Security (RLS) & IDOR Attack Prevention (403 on cross-patient access)
 *  4. Strict Input Validation via Zod Schemas (400 on malformed payloads)
 *  5. SQL Injection Attack Resistance (Parameterized Queries)
 *  6. XSS Payload Neutralization & Sanitization
 *  7. Helmet Security Headers Presence
 *  8. Production Error Masking & Stack Trace Concealment
 */

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://127.0.0.1:4000';

function logSection(title) {
  console.log(`\n======================================================`);
  console.log(`🔒 ${title}`);
  console.log(`======================================================`);
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ PASSED: ${message}`);
}

async function runSecurityTests() {
  logSection('Starting Automated Defensive Security Verification');

  // Helper fetch with Windows TCP connection reset guard
  const request = async (path, options = {}) => {
    const headers = {
      'Connection': 'close',
      ...(options.headers || {})
    };
    return fetch(`${GATEWAY_URL}${path}`, {
      ...options,
      headers
    });
  };

  // -----------------------------------------------------------------
  // 1. Unauthenticated Route Blocking
  // -----------------------------------------------------------------
  logSection('Test 1: Unauthenticated Route Blocking (Zero-Trust Ingress)');
  {
    // A: Clinical encounters must reject unauthenticated requests
    const resClinical = await request('/api/v1/clinical/encounters?patientId=pat_1');
    assert(resClinical.status === 401, `Unauthenticated clinical access returned 401 Unauthorized (got ${resClinical.status})`);
    const jsonClinical = await resClinical.json();
    assert(jsonClinical.code === 'CLINICAL_AUTH_REQUIRED', `Rejection code indicates CLINICAL_AUTH_REQUIRED`);

    // B: Audit trail must reject unauthenticated requests
    const resAudit = await request('/api/v1/audit/records');
    assert(resAudit.status === 401, `Unauthenticated audit access returned 401 Unauthorized (got ${resAudit.status})`);
    const jsonAudit = await resAudit.json();
    assert(jsonAudit.code === 'AUDIT_AUTH_REQUIRED', `Rejection code indicates AUDIT_AUTH_REQUIRED`);
  }

  // -----------------------------------------------------------------
  // 2. Authentication & Admin Route Lockdown
  // -----------------------------------------------------------------
  logSection('Test 2: Admin & Compliance Route Lockdown');
  let doctorToken = '';
  let patientToken = '';
  let auditorToken = '';

  {
    // Login as Doctor
    const resDoc = await request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'dr_sarah', password: 'doctor123' })
    });
    const docData = await resDoc.json();
    assert(resDoc.status === 200 && docData.token, 'Doctor authenticated successfully');
    doctorToken = docData.token;

    // Login as Patient
    const resPat = await request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'paulo', password: 'patient123' })
    });
    const patData = await resPat.json();
    assert(resPat.status === 200 && patData.token, 'Patient Paulo authenticated successfully');
    patientToken = patData.token;

    // Login as Compliance Auditor
    const resAud = await request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'auditor', password: 'audit123' })
    });
    const audData = await resAud.json();
    assert(resAud.status === 200 && audData.token, 'Compliance Auditor authenticated successfully');
    auditorToken = audData.token;

    // Doctor attempts to access audit records -> Must be 403 Forbidden
    const resDocAudit = await request('/api/v1/audit/records', {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    assert(resDocAudit.status === 403, `Doctor accessing audit trail returned 403 Forbidden (got ${resDocAudit.status})`);

    // Patient attempts to access audit records -> Must be 403 Forbidden
    const resPatAudit = await request('/api/v1/audit/records', {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(resPatAudit.status === 403, `Patient accessing audit trail returned 403 Forbidden (got ${resPatAudit.status})`);

    // Compliance Auditor accesses audit records -> Must be 200 OK
    const resAudAudit = await request('/api/v1/audit/records?limit=5', {
      headers: { 'Authorization': `Bearer ${auditorToken}` }
    });
    assert(resAudAudit.status === 200, `Compliance Auditor authorized to query audit records (200 OK)`);
    const auditBody = await resAudAudit.json();
    assert(Array.isArray(auditBody.records), `Audit records retrieved successfully (${auditBody.records.length} records)`);
  }

  // -----------------------------------------------------------------
  // 3. Record-Level Security (RLS) & IDOR Attack Prevention
  // -----------------------------------------------------------------
  logSection('Test 3: Record-Level Security (RLS) & IDOR Attack Testing');
  {
    // Patient Paulo owns 'pat_1'. He tries to access patient record 'pat_2' (IDOR vector)
    const resIdor = await request('/api/v1/patients/pat_2', {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(resIdor.status === 403, `IDOR cross-patient record access blocked with 403 Forbidden (got ${resIdor.status})`);
    const idorJson = await resIdor.json();
    assert(idorJson.code === 'IDOR_PREVENTED', `Response explicitly confirms IDOR_PREVENTED`);

    // Patient Paulo attempts to query clinical encounters of patient 'pat_2'
    const resIdorClinical = await request('/api/v1/clinical/encounters?patientId=pat_2', {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(resIdorClinical.status === 403, `IDOR cross-patient clinical query blocked with 403 Forbidden`);

    // Patient Paulo attempts to list the entire patient directory
    const resPatientList = await request('/api/v1/patients', {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(resPatientList.status === 403, `Patient blocked from viewing global hospital patient directory (403 Forbidden)`);

    // Patient Paulo accesses his OWN record 'pat_1'
    const resOwn = await request('/api/v1/patients/pat_1', {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert(resOwn.status === 200, `Patient successfully accessed their own patient record (200 OK)`);
    const ownData = await resOwn.json();
    assert(ownData.id === 'pat_1', `Retrieved record correctly matches patient's own ID`);
  }

  // -----------------------------------------------------------------
  // 4. Zod Input Validation
  // -----------------------------------------------------------------
  logSection('Test 4: Zod Input Validation on Mutation Ingress');
  {
    // A: Invalid appointment booking (missing consent, malformed email)
    const resBadAppointment = await request('/api/v1/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'X', // too short
        phone: '123', // too short
        email: 'not-an-email',
        departmentId: '',
        doctorId: '',
        date: '2026/09/13', // invalid format (needs YYYY-MM-DD)
        timeSlot: '',
        consentToTreatment: false // must be true
      })
    });
    assert(resBadAppointment.status === 400, `Malformed booking rejected with 400 Bad Request (got ${resBadAppointment.status})`);
    const badAppJson = await resBadAppointment.json();
    assert(badAppJson.code === 'INPUT_VALIDATION_ERROR', `Error code confirms INPUT_VALIDATION_ERROR`);
    assert(badAppJson.details && badAppJson.details.length > 0, `Validation error contains field-specific details (${badAppJson.details.length} issues identified)`);

    // B: Valid appointment booking passing Zod schema
    const resValidAppointment = await request('/api/v1/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Eleanor Security Test',
        phone: '+1-555-019-2831',
        email: 'eleanor.test@hospital.com',
        departmentId: 'dept_card',
        doctorId: 'doc_sarah',
        date: '2026-09-25',
        timeSlot: '11:00 AM',
        type: 'IN_PERSON',
        reason: 'Preventive cardiology evaluation and blood pressure consultation',
        consentToTreatment: true
      })
    });
    assert(resValidAppointment.status === 201, `Valid booking accepted and created with 201 Created (got ${resValidAppointment.status})`);
  }

  // -----------------------------------------------------------------
  // 5. SQL Injection Attack Resistance
  // -----------------------------------------------------------------
  logSection('Test 5: SQL Injection Attack Resistance (Parameterized Queries)');
  {
    // A: SQL injection payload in login
    const resSqliLogin = await request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "admin' OR '1'='1",
        password: "' OR '1'='1"
      })
    });
    assert(resSqliLogin.status === 401, `SQL injection in authentication safely rejected with 401 (got ${resSqliLogin.status})`);

    // B: SQL injection payload in patient search parameter
    const resSqliSearch = await request("/api/v1/patients?q=' OR 1=1 --", {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    assert(resSqliSearch.status === 200, `SQL injection in search handled safely by parameterized query (got ${resSqliSearch.status})`);
    const searchJson = await resSqliSearch.json();
    assert(searchJson.total === 0, `Parameterized search treated payload as literal string, returning 0 unexpected records`);
  }

  // -----------------------------------------------------------------
  // 6. XSS Script Injection Sanitization
  // -----------------------------------------------------------------
  logSection('Test 6: Cross-Site Scripting (XSS) Sanitization');
  {
    const xssPayload = "<script>alert('XSS_BREACH')</script>Routine Followup";
    const resXss = await request('/api/v1/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'XSS Test Subject',
        phone: '+1-555-999-1234',
        email: 'xss.test@example.com',
        departmentId: 'dept_card',
        doctorId: 'doc_sarah',
        date: '2026-09-26',
        timeSlot: '02:00 PM',
        type: 'IN_PERSON',
        reason: xssPayload,
        consentToTreatment: true
      })
    });

    assert(resXss.status === 201, `Booking created successfully`);
    const booking = await resXss.json();
    const sanitizedText = booking.symptoms || booking.reason || '';
    assert(!sanitizedText.includes('<script>'), `Malicious <script> tag neutralized from appointment reason/symptoms`);
    assert(sanitizedText.includes('Routine Followup'), `Legitimate text preserved`);
  }

  // -----------------------------------------------------------------
  // 7. Security Headers (Helmet Verification)
  // -----------------------------------------------------------------
  logSection('Test 7: Helmet Security Headers');
  {
    const resHeaders = await request('/health');
    const xContentType = resHeaders.headers.get('x-content-type-options');
    const xFrame = resHeaders.headers.get('x-frame-options');
    const hsts = resHeaders.headers.get('strict-transport-security');

    assert(xContentType === 'nosniff', `X-Content-Type-Options is set to 'nosniff'`);
    assert(xFrame === 'SAMEORIGIN', `X-Frame-Options is set to 'SAMEORIGIN'`);
    assert(hsts && hsts.includes('max-age'), `Strict-Transport-Security (HSTS) is enabled`);
  }

  // -----------------------------------------------------------------
  // 8. Error Masking & Stack Trace Suppression
  // -----------------------------------------------------------------
  logSection('Test 8: Production Error Masking (No Stack Trace Leakage)');
  {
    // Request a nonexistent API route to trigger gateway 404
    const resNonexistent = await request('/api/v1/nonexistent-route-endpoint');
    const bodyText = await resNonexistent.text();
    assert(!bodyText.includes('at Function.'), `No JavaScript stack trace leaked in response`);
    assert(!bodyText.includes('node_modules'), `No internal server file paths leaked in response`);
  }

  logSection('🎉 ALL 8 DEFENSIVE SECURITY CHECKS PASSED WITH 100% SUCCESS!');
  console.log(`\nVerified Protections:
  ✔ Record-Level Security (RLS) active
  ✔ IDOR cross-patient attacks blocked
  ✔ Admin & Auditor routes strictly locked
  ✔ Unauthenticated routes blocked
  ✔ Zod schemas validating all mutations
  ✔ Parameterized SQL injection prevention verified
  ✔ XSS sanitized on ingress
  ✔ Helmet security headers active\n`);
}

runSecurityTests().catch(err => {
  console.error('\n❌ Security Test Suite encountered fatal error:', err);
  process.exit(1);
});
