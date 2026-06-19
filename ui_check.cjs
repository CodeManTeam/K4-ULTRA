const { chromium } = require("playwright");
const path = require("path");
const OUT = "D:/Lumina Project/Kitten4 Ultra";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await ctx.newPage();
  p.on("pageerror", e => console.log("CRASH:", e.message));

  await p.goto("http://localhost:9876/index.html", { waitUntil: "networkidle", timeout: 30000 });
  await p.waitForTimeout(12000);

  const ui = await p.evaluate(() => {
    const g = s => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); return { d: cs.display, v: cs.visibility, z: cs.zIndex }; };
    return {
      loaderWrap: g("#kitten-loader-wrap"), root: g("#root"), svelteLoader: g(".k4-loader"),
      fab: g(".k4-fab"), kittenContainer: g("#kitten_main_container"),
      stageContainer: g("#stage-container"), toolbar: g(".blocklyToolboxDiv"),
      blocklySvg: g(".blocklySvg"),
    };
  });
  console.log("UI:", JSON.stringify(ui, null, 2));

  const fabs = await p.$$(".k4-fab");
  console.log("FAB count:", fabs.length);
  if (fabs.length > 0) {
    await fabs[0].click();
    await p.waitForTimeout(800);
    const menu = await p.$$(".k4-fab-menu");
    console.log("Menu open:", menu.length);
    if (menu.length > 0) {
      const items = await menu[0].$$("button");
      for (let i = 0; i < items.length; i++) console.log("  [" + i + "]", (await items[i].textContent()).trim());
      if (items.length > 1) {
        await items[1].click();
        await p.waitForTimeout(1000);
        const settings = await p.$$(".k4-settings-panel");
        console.log("Settings panel:", settings.length);
      }
    }
  }

  await p.screenshot({ path: path.join(OUT, "local_ui_main.png") });
  await ctx.close(); await browser.close();
  console.log("Done");
})();
