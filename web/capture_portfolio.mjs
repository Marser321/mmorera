import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
    // Capturas ya realizadas (descomentar para regenerar):
    // { name: 'lnb-saass', url: 'https://lnb-saass.vercel.app/' },
    // { name: 'evowrap', url: 'https://evowrap.vercel.app/' },
    // { name: 'punta-360', url: 'https://punta-360.vercel.app/' },
    // { name: 'realstate-brown', url: 'https://realstate2-brown.vercel.app/' },
    // { name: 'booking-clinico', url: 'https://nb-oa7mhumgz-marios-projects-4a53e443.vercel.app/reservar' },
    // { name: 'henrylasa', url: 'https://jenrylasaweb.vercel.app/' },
    // { name: 'gym-beta', url: 'https://gym-beta-sable.vercel.app/' },
    // { name: 'smartpoint', url: 'https://smartpoint-rho.vercel.app/' },
    // { name: 'n95-gloves', url: 'https://n95-gloves-boutique.vercel.app/' },
    // { name: 'profesional-cv', url: 'https://profecionalcv.vercel.app/' },
    // { name: 'fede-motos', url: 'https://fede-motos.vercel.app/' },
    // { name: 'gym-crm', url: 'https://gymcrm-mvp.vercel.app/' },
    { name: 'lb-elite-cover', url: 'https://l-b-five.vercel.app/' },
    { name: 'nb-barber-cover', url: 'https://nb-barber.vercel.app/' },
    { name: 'rangel-oviedo-cover', url: 'https://rangeloviedo-tor8.vercel.app/' },
    { name: 'mrstudio-tattoo-cover', url: 'https://www.mrstudiotattoo.com/' }
];

const outputDir = path.join(__dirname, 'public', 'portfolio');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function captureScreenshots() {
    console.log(`Iniciando captura de pantalla de ${urls.length} proyectos...`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    for (const site of urls) {
        const outputPath = path.join(outputDir, `${site.name}.jpg`);
        console.log(`Visitando ${site.name} (${site.url})...`);
        try {
            await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
            // Esperampos un ratito más por si hay animaciones de entrada.
            await page.waitForTimeout(4000);

            await page.screenshot({ path: outputPath, fullPage: false, type: 'jpeg', quality: 82 });
            console.log(`✅ Captura guardada para ${site.name}: ${outputPath}`);
        } catch (err) {
            console.error(`❌ Error al capturar ${site.name}:`, err.message);
        }
    }

    await browser.close();
    console.log('Proceso de capturas finalizado.');
}

captureScreenshots().catch(console.error);
