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

describe('public geographic metadata', () => {
  test('keeps public source free of geographic locale claims', () => {
    const publicRoots = ['app', 'components', 'config', 'data'].map((directory) => join(process.cwd(), 'src', directory));
    const source = publicRoots.flatMap(sourceFiles).map((file) => readFileSync(file, 'utf8')).join('\n');
    for (const forbidden of ['Uru' + 'guay', 'es-' + 'UY', 'es_' + 'UY']) assert.equal(source.includes(forbidden), false);
    assert.match(SITE_IDENTITY.contact.whatsapp, /\/598/);
  });
});
