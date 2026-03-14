import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Navegando a https://profecionalcv.vercel.app/...');
    await page.goto('https://profecionalcv.vercel.app/', { waitUntil: 'networkidle2' });
    const outputPath = path.join(__dirname, 'public', 'portfolio', 'profesional-cv.png');
    await page.screenshot({ path: outputPath });
    console.log('Captura guardada en:', outputPath);
    await browser.close();
}

run().catch(console.error);
