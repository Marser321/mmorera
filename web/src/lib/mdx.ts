import fs from 'fs';
import path from 'path';

// El directorio raíz es el padre de "web"
const rootDirectory = path.join(process.cwd(), '..');

export async function getMarkdownFile(filename: string) {
    const filePath = path.join(rootDirectory, filename);
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return fileContents;
    } catch (error) {
        console.error(`Error reading markdown file ${filename}:`, error);
        return null;
    }
}
