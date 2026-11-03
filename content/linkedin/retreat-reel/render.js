const { chromium } = require('playwright');
(async () => {
  const fps = 30, dur = 26, only = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/reel-source.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  require('fs').mkdirSync(__dirname + '/frames', { recursive: true });
  const times = only ? only.split(',').map(Number) : [...Array(fps * dur).keys()].map(i => i / fps);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.render(t), times[i]);
    await p.screenshot({ path: only ? `preview_${times[i]}.jpg` : `frames/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
