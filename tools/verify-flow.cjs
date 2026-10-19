/* Local browser QA. Set PORTFOLIO_NODE_MODULES to an existing node_modules
 * directory, or install playwright locally. No real email is sent by this file.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const dependency = process.env.PORTFOLIO_NODE_MODULES ? createRequire(path.join(process.env.PORTFOLIO_NODE_MODULES, '__portfolio__.cjs')) : require;
const { chromium } = dependency('playwright');
const root = path.resolve(__dirname, '..');
const artifacts = process.env.PORTFOLIO_ARTIFACTS || path.join(__dirname, 'artifacts');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4180/';
fs.mkdirSync(artifacts, { recursive: true });

function checkLocalReferences() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href|data-img)="([^"#]+)"/g)) {
    const file = match[1].split('?')[0];
    if (/^(https?:|mailto:|data:)/.test(file)) continue;
    assert.ok(fs.existsSync(path.join(root, decodeURIComponent(file))), `Missing local resource: ${file}`);
  }
}
async function decoded(page) {
  await page.evaluate(() => Promise.all([...document.images].filter(i => i.getClientRects().length).map(i => i.decode().catch(() => {}))));
}
async function audit(page, label) {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    broken: [...document.images].filter(i => i.getClientRects().length && (!i.complete || !i.naturalWidth)).map(i => i.getAttribute('src')),
    theme: document.documentElement.dataset.theme,
    footer: getComputedStyle(document.querySelector('.site-footer')).backgroundColor,
    hero: getComputedStyle(document.querySelector(document.documentElement.dataset.theme === 'dark' ? '.art-dark' : '.art-light')).display
  }));
  console.log(label, JSON.stringify(result));
  assert.equal(result.overflow, false, `${label}: page overflows`);
  assert.deepEqual(result.broken, [], `${label}: missing image`);
  assert.notEqual(result.hero, 'none', `${label}: artwork hidden`);
}
async function main() {
  checkLocalReferences();
  const browser = await chromium.launch({ headless: true, ...(process.env.PORTFOLIO_BROWSER_PATH ? { executablePath: process.env.PORTFOLIO_BROWSER_PATH } : {}) });
  const errors = [];
  try {
    for (const [label,width,height,scheme] of [['desktop-light',1440,1000,'light'],['desktop-dark',1440,1000,'dark'],['mobile-light',390,844,'light'],['mobile-dark',390,844,'dark'],['small-mobile',320,780,'light'],['tablet',768,1024,'dark']]) {
      const context = await browser.newContext({ viewport:{width,height}, colorScheme:scheme, reducedMotion:'reduce' });
      // Prevent any accidental delivery during QA, including future changes.
      await context.route('**/api.emailjs.com/**', route => route.abort());
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(label + ': ' + error.message));
      const response = await page.goto(base, { waitUntil:'networkidle' });
      assert.equal(response.status(),200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('html').getAttribute('data-theme'),scheme);
      await page.screenshot({ path:path.join(artifacts,label+'-hero.png') });
      for (const element of await page.locator('[data-reveal]').all()) await element.scrollIntoViewIfNeeded();
      await decoded(page);
      await audit(page,label);
      await page.evaluate(()=>scrollTo(0,0));
      await page.waitForFunction(()=>scrollY===0);
      await page.screenshot({ path:path.join(artifacts,label+'.png'),fullPage:true });
      await page.locator('.site-footer').screenshot({path:path.join(artifacts,label+'-footer.png')});
      await page.locator('#themeBtn').click();
      await decoded(page);
      assert.equal(await page.locator('html').getAttribute('data-theme'),scheme==='dark'?'light':'dark');
      await page.reload({waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('data-theme'),scheme==='dark'?'light':'dark');
      await context.close();
    }

    const context = await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce',colorScheme:'light'});
    await context.route('**/api.emailjs.com/**',route=>route.abort());
    const page = await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base);
    for(const [filter,count] of [['telecom',3],['security',1],['products',2],['all',6]]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator('.project:visible').count(),count);
      assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'),'true');
    }
    assert.equal(await page.locator('.certificate:visible').count(),3);
    await page.locator('#certificates-toggle').click();
    assert.equal(await page.locator('.certificate:visible').count(),9);
    for(const button of await page.locator('.certificate').all()) {
      await button.click();
      await page.locator('#certificate-image').evaluate(i=>i.decode());
      assert.equal(await page.locator('#certificate-dialog').evaluate(d=>d.open),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#certificate-dialog').evaluate(d=>d.open),false);
      assert.equal(await button.evaluate(b=>b===document.activeElement),true);
    }
    await page.locator('#certificates-toggle').click();
    assert.equal(await page.locator('.certificate:visible').count(),3);

    await page.locator('#submitBtn').click();
    assert.equal(await page.locator('[aria-invalid=true]').count(),4);
    assert.equal(await page.locator('#name').evaluate(i=>i===document.activeElement),true);
    await page.locator('#name').fill('Test Visitor');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#subject').fill('Local QA');
    await page.locator('#message').fill('A synthetic message used only in a local browser test.');
    await page.locator('#submitBtn').click();
    assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');
    await page.locator('#email').fill('test@example.com');
    await page.evaluate(()=>{window.emailjs={init(){},send(){window.__testSends=(window.__testSends||0)+1;return Promise.resolve({status:200});}};});
    await page.locator('#submitBtn').click();
    await page.waitForFunction(()=>document.getElementById('form-status').dataset.state==='success');
    assert.equal(await page.evaluate(()=>window.__testSends),1);
    assert.equal(await page.locator('#message').inputValue(),'');
    await page.locator('#name').fill('Test Visitor');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Local QA');
    await page.locator('#message').fill('A synthetic failure case that never leaves this browser.');
    await page.evaluate(()=>{window.emailjs.send=()=>Promise.reject(new Error('Synthetic failure'));});
    await page.locator('#submitBtn').click();
    await page.waitForFunction(()=>document.getElementById('form-status').dataset.state==='error');
    assert.equal(await page.locator('#form-status a').getAttribute('href'),'mailto:adityaajaysingh0104@gmail.com');
    assert.equal(await page.locator('#submitBtn').isEnabled(),true);
    await page.setViewportSize({width:390,height:844});
    await page.locator('#menuBtn').click();
    assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'false');
    await page.locator('#menuBtn').click();
    await page.locator('#site-nav a[href="#work"]').click();
    assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'false');
    await context.close();

    // Verify offline activity has an honest fallback, without a fabricated count.
    const offline=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await offline.route('**/github-contributions-api.jogruber.de/**',route=>route.abort());
    const offlinePage=await offline.newPage();
    await offlinePage.goto(base);
    await offlinePage.locator('#activity').scrollIntoViewIfNeeded();
    await offlinePage.waitForFunction(()=>document.getElementById('gh-contrib-count').textContent.includes('unavailable'));
    assert.equal(await offlinePage.locator('#gh-calendar a').getAttribute('href'),'https://github.com/Adityasiig');
    await offline.close();

    // Exercise the successful calendar path with explicit synthetic data.
    // These fixture values are never used in user-facing screenshots.
    const fixture=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    await fixture.route('**/github-contributions-api.jogruber.de/**',route=>{
      const year=Number(new URL(route.request().url()).searchParams.get('y'));
      const today=new Date();
      const date=new Date(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())).toISOString().slice(0,10);
      route.fulfill({contentType:'application/json',body:JSON.stringify({contributions:year===today.getFullYear()?[{date,count:3}]:[]})});
    });
    const fixturePage=await fixture.newPage();
    await fixturePage.goto(base);
    await fixturePage.locator('#activity').scrollIntoViewIfNeeded();
    await fixturePage.waitForSelector('.calendar-svg');
    assert.equal(await fixturePage.locator('#gh-contrib-count').textContent(),'3 contributions in the last 12 months');
    assert.ok(await fixturePage.locator('.calendar-svg rect').count()>=365);
    await fixture.close();

    // Motion-enabled observers must actually reveal content during navigation.
    const motion=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'});
    const motionPage=await motion.newPage();
    await motionPage.goto(base);
    await motionPage.locator('#practice-title').scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(()=>document.getElementById('practice-title').closest('[data-reveal]').classList.contains('is-visible'));
    await motion.close();

    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const staticPage=await nojs.newPage();
    await staticPage.goto(base);
    assert.equal(await staticPage.locator('.project:visible').count(),6);
    assert.equal(await staticPage.locator('.certificate:visible').count(),9);
    await nojs.close();
    assert.deepEqual(errors,[],'JavaScript runtime errors');
    console.log('PASS: resources, six responsive/theme layouts, theme persistence, filters, nine certificate dialogs, mobile navigation, form validation and mocked delivery/failure, live-data rendering with fixtures, activity fallback, motion reveals, and no-JS content. No email was sent.');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
