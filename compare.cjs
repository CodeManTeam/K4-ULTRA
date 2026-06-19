// K4 Ultra UI comparison script
const { chromium } = require('playwright');
const path = require('path');
const outDir = 'D:\\Lumina Project\\Kitten4 Ultra';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ============ ONLINE ============
  console.log('=== ONLINE ===');
  const ctx1 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p1 = await ctx1.newPage();
  p1.on('pageerror', function(e) { console.log('[ONLINE-CRASH]', e.message); });
  await p1.goto('https://kitten.codemao.cn', { waitUntil: 'networkidle', timeout: 30000 });
  await p1.waitForTimeout(8000);

  const oUI = await p1.evaluate(function() {
    function g(s) { var e = document.querySelector(s); return e ? { v: getComputedStyle(e).visibility, d: getComputedStyle(e).display } : null; }
    return {
      loader: g('#kitten-loader-wrap'),
      root: g('#root'),
      container: g('#kitten_main_container'),
      header: g('header'),
      toolbar: g('.blocklyToolboxDiv'),
      canvas: document.querySelectorAll('canvas').length,
      divs: document.querySelectorAll('div').length
    };
  });
  console.log('ONLINE:', JSON.stringify(oUI));
  await p1.screenshot({ path: path.join(outDir, 'online_ui.png') });
  await ctx1.close();

  // ============ LOCAL via HTTP ============
  console.log('=== LOCAL ===');
  const ctx2 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p2 = await ctx2.newPage();
  p2.on('pageerror', function(e) { console.log('[LOCAL-CRASH]', e.message); });
  p2.on('console', function(m) { if (m.type() === 'error') console.log('[LOCAL-ERR]', m.text()); });
  await p2.goto('http://localhost:9876/index.html', { waitUntil: 'networkidle', timeout: 30000 });
  await p2.waitForTimeout(12000);

  const lUI = await p2.evaluate(function() {
    function g(s) { var e = document.querySelector(s); return e ? { v: getComputedStyle(e).visibility, d: getComputedStyle(e).display, z: getComputedStyle(e).zIndex } : null; }
    return {
      loaderWrap: g('#kitten-loader-wrap'),
      root: g('#root'),
      kitten: g('#kitten_main_container'),
      toolbar: g('.blocklyToolboxDiv'),
      canvas: document.querySelectorAll('canvas').length,
      divs: document.querySelectorAll('div').length,
      svelteScope: g('.k4-scope'),
      fab: g('.k4-fab'),
      svelteLoader: g('.k4-loader'),
      settings: g('.k4-settings-panel'),
      welcome: g('.k4-welcome'),
      debug: g('.k4-debug-panel'),
      loaderInRoot: !!document.querySelector('#root #kitten-loader-wrap'),
      bodyKids: document.body.children.length
    };
  });
  console.log('LOCAL:', JSON.stringify(lUI));

  // Try clicking FAB
  var fabs = await p2.$$('.k4-fab');
  console.log('FAB elements:', fabs.length);
  if (fabs.length > 0) {
    console.log('Clicking FAB...');
    await fabs[0].click();
    await p2.waitForTimeout(800);
    var menu = await p2.$$('.k4-fab-menu');
    console.log('FAB menu visible:', menu.length);
    if (menu.length > 0) {
      // Click Settings in menu
      var items = await menu[0].$$('button');
      console.log('FAB menu items:', items.length);
    }
  }

  // Check toolbar
  var tOnline = await p1.evaluate(function() {
    var t = document.querySelector('.blocklyToolboxDiv');
    if (!t) return null;
    var cats = t.querySelectorAll('[class*="category"]');
    var result = [];
    for (var i = 0; i < cats.length; i++) result.push(cats[i].textContent.trim().substring(0, 30));
    return result;
  });
  var tLocal = await p2.evaluate(function() {
    var t = document.querySelector('.blocklyToolboxDiv');
    if (!t) return null;
    var cats = t.querySelectorAll('[class*="category"]');
    var result = [];
    for (var i = 0; i < cats.length; i++) result.push(cats[i].textContent.trim().substring(0, 30));
    return result;
  });
  console.log('Online toolbox:', tOnline);
  console.log('Local toolbox:', tLocal);

  await p2.screenshot({ path: path.join(outDir, 'local_ui.png') });
  await ctx2.close();
  await browser.close();
  console.log('Done');
})();

