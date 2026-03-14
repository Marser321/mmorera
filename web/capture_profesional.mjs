import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    try {
        console.log('Navegando a la URL...');
        await page.goto('https://profecionalcv.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(__dirname, 'public', 'portfolio', 'profesional-cv.png') });
        console.log('Captura exitosa');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
}
capture();
