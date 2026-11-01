// Usage: node render.js out.png "query-string" [timeoutSec]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, qs = '', tmo = '600'] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-watchdog', '--disable-features=GpuWatchdog'] });
  const p = await b.newPage({ viewport: { width: 2000, height: 1400 } });
  p.on('console', m => console.log('console:', m.text()));
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html') + '?noui=1&' + qs;
  const t0 = Date.now();
  await p.goto(url);
  const isFilm = qs.includes('mode=film');
  await p.waitForFunction(f => window.renderError || (f ? window.renderDone : (window.sppDone !== undefined && performance.now() > 1500)), isFilm, { timeout: +tmo * 1000, polling: 500 });
  const err = await p.evaluate(() => window.renderError);
  if (err) { console.error(err); process.exit(1); }
  const data = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  require('fs').writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  console.log('rendered', out, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  await b.close();
})();
