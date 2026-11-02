import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_IDENTITY } from '@/config/site';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) && !entry.endsWith('.test.ts') ? [path] : [];
  });
}

// D7 (1/11/2026): las páginas legales nombran la ley aplicable; el resto del sitio, no.
const LEGAL_PAGE = /[\\/]app[\\/](en[\\/])?(privacidad|terminos|cookies)[\\/]/;

function publicSourceFiles(): string[] {
  return ['app', 'components', 'config', 'data'].flatMap((directory) => sourceFiles(join(process.cwd(), 'src', directory)));
}

describe('public geographic metadata', () => {
  test('keeps public source free of geographic locale claims', () => {
    const source = publicSourceFiles()
      .filter((file) => !LEGAL_PAGE.test(file))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    for (const forbidden of ['Uru' + 'guay', 'es-' + 'UY', 'es_' + 'UY']) assert.equal(source.includes(forbidden), false);
    assert.match(SITE_IDENTITY.contact.whatsapp, /\/598/);
  });

  test('the exception covers only the legal pages', () => {
    const naming = publicSourceFiles().filter((file) => readFileSync(file, 'utf8').includes('Uru' + 'guay'));
    assert.ok(naming.length > 0, 'las páginas legales nombran la ley aplicable');
    assert.deepEqual(naming.filter((file) => !LEGAL_PAGE.test(file)), []);
  });
});
