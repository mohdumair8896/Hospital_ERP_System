const BASE_URL = 'http://localhost:3001';

const routes = [
  '/',
  '/about',
  '/departments',
  '/departments/dept_card',
  '/doctors',
  '/doctors/doc_sarah',
  '/timetable',
  '/appointments',
  '/analytics',
  '/blog',
  '/blog/understanding-cardiac-risk-factors-early-prevention',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/cookie-policy',
  '/refund-policy',
  '/llms.txt',
  '/robots.txt',
  '/sitemap.xml',
];

async function verifyAllPages() {
  console.log('🌐 Pinging all live ProHealth website pages on port 3001...\n');
  let failures = 0;

  for (const r of routes) {
    try {
      const res = await fetch(`${BASE_URL}${r}`, { headers: { Connection: 'close' } });
      if (res.ok) {
        console.log(`  ✅ [${res.status}] ${r}`);
      } else {
        console.error(`  ❌ [${res.status}] ${r}`);
        failures++;
      }
    } catch (err) {
      console.error(`  ❌ [ERR] ${r}:`, err.message);
      failures++;
    }
  }

  // Check 404 route
  try {
    const res404 = await fetch(`${BASE_URL}/nonexistent-page-testing-custom-404`, { headers: { Connection: 'close' } });
    if (res404.status === 404) {
      console.log(`  ✅ [404] /nonexistent-page-testing-custom-404 (Custom 404 Verified)`);
    } else {
      console.error(`  ❌ [${res404.status}] Expected 404 for nonexistent route`);
      failures++;
    }
  } catch (err) {
    console.error('  ❌ [ERR] 404 check failed:', err.message);
    failures++;
  }

  if (failures === 0) {
    console.log('\n🎉 ALL WEBSITE ROUTES RESPONDED WITH 100% HEALTHY STATUS!');
  } else {
    console.error(`\n❌ ${failures} routes failed verification.`);
    process.exit(1);
  }
}

verifyAllPages();
