import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('audit_screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log('🚀 Starting Live Browser Visual Audit with Google Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // -------------------------------------------------------------
    // ERP AUDIT
    // -------------------------------------------------------------
    console.log('\n--- Auditing Hospital ERP (http://localhost:5173) ---');

    // 1. Login Screen Desktop
    console.log('1. Capturing ERP Login Screen...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await delay(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_erp_login.png') });

    // 2. Login Screen Mobile
    console.log('2. Capturing ERP Login Screen Mobile...');
    await page.setViewport({ width: 390, height: 844 });
    await delay(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_erp_login_mobile.png') });
    await page.setViewport({ width: 1440, height: 900 });

    // 3. Login as Admin
    console.log('3. Logging in as Hospital Director (admin)...');
    
    // Click button by text helper
    async function clickButtonWithText(matchText) {
      const btns = await page.$$('button, div[role="button"], a');
      for (const btn of btns) {
        try {
          const text = await page.evaluate(el => el.textContent, btn);
          if (text && text.toLowerCase().includes(matchText.toLowerCase())) {
            await btn.click();
            return true;
          }
        } catch (e) {}
      }
      return false;
    }

    const clickedDemo = await clickButtonWithText('Arthur Vance');
    if (!clickedDemo) {
      const inputs = await page.$$('input');
      if (inputs.length >= 2) {
        await inputs[0].type('admin');
        await inputs[1].type('admin123');
      }
    }
    await delay(300);
    await clickButtonWithText('Sign In');
    await delay(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_erp_admin_dashboard.png') });

    // Helper to click sidebar tabs
    async function clickTab(tabText) {
      const clicked = await clickButtonWithText(tabText);
      await delay(1200);
      return clicked;
    }

    // 4. Reception Desk
    console.log('4. Capturing Reception Desk...');
    await clickTab('Reception');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_erp_reception_desk.png') });

    // 5. Walk-in Registration Modal
    console.log('5. Capturing Walk-in Modal...');
    const openedModal = await clickButtonWithText('Walk-in');
    if (openedModal) {
      await delay(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '05_erp_reception_walkin_modal.png') });
      await page.keyboard.press('Escape');
      await delay(500);
    }

    // 6. Billing & Invoices Tab
    console.log('6. Capturing Reception Billing...');
    await clickButtonWithText('Billing & Invoices');
    await delay(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_erp_reception_billing.png') });

    // 7. Staff Roster Tab
    console.log('7. Capturing Reception Staff Roster...');
    await clickButtonWithText('Staff Roster');
    await delay(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_erp_reception_roster.png') });

    // 8. Clinical Workbench
    console.log('8. Capturing Clinical Workbench...');
    await clickTab('Clinical Workbench');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_erp_clinical_workbench.png') });

    // 9. Staff Provisioning Center
    console.log('9. Capturing Staff Provisioning Center...');
    await clickTab('Staff Directory');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_erp_staff_provisioning.png') });

    // Click Onboard New Staff button to capture modal
    const openedStaffModal = await clickButtonWithText('Onboard New Staff');
    if (openedStaffModal) {
      await delay(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '11_erp_staff_onboard_modal.png') });
      await clickButtonWithText('Cancel');
      await delay(800);
    }

    // 10. Audit Log Viewer
    console.log('10. Capturing Audit Log Viewer...');
    await clickTab('Audit Log');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_erp_audit_log.png') });

    // 11. Clinical Pipeline
    console.log('11. Capturing Clinical Pipeline...');
    await clickTab('Clinical Pipeline');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_erp_clinical_pipeline.png') });

    // 12. Analytics Dashboard
    console.log('12. Capturing Analytics Dashboard...');
    await clickTab('Analytics');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_erp_analytics.png') });

    // -------------------------------------------------------------
    // WEBSITE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- Auditing Patient Website (http://localhost:3001) ---');

    // 13. Homepage
    console.log('13. Capturing Website Homepage...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    await delay(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15_website_home_hero.png') });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '16_website_home_full.png'), fullPage: true });

    // 14. Symptom Triage Popover
    console.log('14. Capturing Symptom Triage Popover...');
    const openedTriage = await clickButtonWithText('Triage') || await clickButtonWithText('Symptom');
    if (openedTriage) {
      await delay(1000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '18_website_triage_step1.png') });

      // Click first symptom category card
      await clickButtonWithText('Chest') || await clickButtonWithText('General') || await clickButtonWithText('Headache');
      await delay(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '19_website_triage_step2.png') });

      // Click Continue
      await clickButtonWithText('Continue') || await clickButtonWithText('Proceed');
      await delay(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '20_website_triage_step3.png') });

      // Click Find Specialist
      await clickButtonWithText('Specialist') || await clickButtonWithText('Find');
      await delay(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '21_website_triage_step4.png') });

      await page.keyboard.press('Escape');
      await delay(500);
    }

    // 15. Appointment Booking Modal
    console.log('15. Capturing Appointment Booking Modal...');
    try {
      const bookBtns = await page.$$('button, a');
      for (const btn of bookBtns) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('Book Appointment') || text.includes('Schedule Consultation'))) {
          await page.evaluate(el => el.click(), btn);
          await delay(1200);
          await page.screenshot({ path: path.join(OUTPUT_DIR, '22_website_appointment_modal.png') });
          await page.keyboard.press('Escape');
          await delay(500);
          break;
        }
      }
    } catch (err) {
      console.warn('Appointment modal click failed:', err.message);
    }

    // 16. Subpages
    const pagesToTest = [
      { name: '23_website_doctors.png', url: 'http://localhost:3001/doctors' },
      { name: '24_website_timetable.png', url: 'http://localhost:3001/timetable' },
      { name: '25_website_departments.png', url: 'http://localhost:3001/departments' },
      { name: '26_website_blog.png', url: 'http://localhost:3001/blog' },
      { name: '27_website_contact.png', url: 'http://localhost:3001/contact' },
    ];

    for (const item of pagesToTest) {
      console.log(`Navigating to ${item.url}...`);
      try {
        await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 10000 });
        await delay(1000);
        await page.screenshot({ path: path.join(OUTPUT_DIR, item.name) });
      } catch (err) {
        console.warn(`Could not capture ${item.url}: ${err.message}`);
      }
    }

    console.log('\n✅ Live Browser Visual Audit complete! All screenshots saved in:', OUTPUT_DIR);

  } catch (err) {
    console.error('Audit failed with error:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
