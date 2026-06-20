import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dir     = dirname(__filename);

const HTML_FILE  = join(__dir, 'frontend', 'presentation.html');
const OUTPUT_PDF = join(__dir, 'CleanCity_AI_Presentation.pdf');
const TMP_DIR    = join(__dir, '.pdf_tmp');
const TOTAL      = 10;

if (!existsSync(HTML_FILE)) {
  console.error('❌  presentation.html not found:', HTML_FILE);
  process.exit(1);
}

// Create temp dir
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR);

// ── Step 1: Screenshot every slide ───────────────────────────────────────────
console.log('🚀  Launching browser for screenshots...');
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

const fileUrl = `file:///${HTML_FILE.replace(/\\/g, '/')}`;
console.log('📄  Loading presentation...');
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500)); // let fonts/animations settle

const imgPaths = [];

for (let i = 0; i < TOTAL; i++) {
  process.stdout.write(`📸  Slide ${i + 1}/${TOTAL} ...`);

  await page.evaluate((idx) => {
    document.querySelectorAll('.slide').forEach((s, si) => {
      s.classList.toggle('active', si === idx);
      s.classList.remove('exit-left');
    });
    // update progress bar & dots via existing updateUI if available
    if (typeof updateUI === 'function') {
      // currentSlide may differ; just fire the slide switch manually
    }
  }, i);

  await new Promise(r => setTimeout(r, 800));

  const imgPath = join(TMP_DIR, `slide_${String(i + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: imgPath, type: 'png', fullPage: false });
  imgPaths.push(imgPath);
  console.log(' ✓');
}

await browser.close();

// ── Step 2: Write an HTML assembler file pointing to real disk images ─────────
console.log('📑  Building print page...');

const imgTags = imgPaths.map(p =>
  `<div class="page"><img src="file:///${p.replace(/\\/g, '/')}" /></div>`
).join('\n');

const printHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#000; }
  .page {
    width: 297mm;
    height: 167.0625mm;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    page-break-after: always;
    page-break-inside: avoid;
  }
  .page:last-child { page-break-after: auto; }
  img { width:100%; height:100%; object-fit:cover; display:block; }
</style>
</head>
<body>${imgTags}</body>
</html>`;

const printHtmlPath = join(TMP_DIR, 'print.html');
writeFileSync(printHtmlPath, printHtml, 'utf8');

// ── Step 3: Navigate to that file and print to PDF ────────────────────────────
console.log('🖨️   Generating PDF...');
const browser2 = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security',
         '--allow-file-access-from-files'],
});
const pdfPage = await browser2.newPage();
const printUrl = `file:///${printHtmlPath.replace(/\\/g, '/')}`;
await pdfPage.goto(printUrl, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));

await pdfPage.pdf({
  path: OUTPUT_PDF,
  width: '297mm',
  height: '167.0625mm',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser2.close();

// ── Cleanup temp files ────────────────────────────────────────────────────────
imgPaths.forEach(p => { try { unlinkSync(p); } catch {} });
try { unlinkSync(printHtmlPath); } catch {}

console.log(`\n✅  PDF created → ${OUTPUT_PDF}`);
console.log(`📊  ${TOTAL} slides  |  16:9 (1920×1080)  |  A4-landscape pages`);
