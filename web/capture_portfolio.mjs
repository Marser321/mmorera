import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
    { name: 'lnb-saass', url: 'https://lnb-saass.vercel.app/' },
    { name: 'evowrap', url: 'https://evowrap.vercel.app/' },
    { name: 'punta-360', url: 'https://punta-360-git-main-marios-projects-4a53e443.vercel.app/' },
    { name: 'realstate-brown', url: 'https://realstate2-brown.vercel.app/' },
    { name: 'booking-clinico', url: 'https://nb-oa7mhumgz-marios-projects-4a53e443.vercel.app/reservar' },
    { name: 'henrylasa', url: 'https://henrylasa-n4sx.vercel.app/' },
    { name: 'gym-beta', url: 'https://gym-beta-sable.vercel.app/' },
    { name: 'smartpoint', url: 'https://smartpoint-rho.vercel.app/' },
    { name: 'n95-gloves', url: 'https://n95-gloves-boutique.vercel.app/' }
];

const outputDir = path.join(__dirname, 'public', 'portfolio');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function captureScreenshots() {
    console.log('Iniciando captura de pantalla de los 9 proyectos...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Viewport tamaño desktop (resolución estándar alta)
    await page.setViewport({ width: 1440, height: 900 });

    for (const site of urls) {
        const outputPath = path.join(outputDir, `${site.name}.png`);
        console.log(`Visitando ${site.name} (${site.url})...`);
        try {
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });
            // Esperampos un ratito más por si hay animaciones de entrada.
            await new Promise(r => setTimeout(r, 2000));

            await page.screenshot({ path: outputPath, fullPage: false });
            console.log(`✅ Captura guardada para ${site.name}: ${outputPath}`);
        } catch (err) {
            console.error(`❌ Error al capturar ${site.name}:`, err.message);
        }
    }

    await browser.close();
    console.log('Proceso de capturas finalizado.');
}

captureScreenshots().catch(console.error);
