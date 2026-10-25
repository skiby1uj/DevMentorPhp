// Łączy pliki src/*.ts (kolejność ma znaczenie) w jeden skrypt i kompiluje przez tsc.
// Użycie: npm i && npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const files = ['types', 'data', 'ui', 'screens-public', 'screens-mentee', 'screens-mentor', 'screens-admin', 'app'];
mkdirSync('.build', { recursive: true });
writeFileSync('.build/app.ts', files.map(f => `// ---- ${f}.ts ----\n` + readFileSync(`src/${f}.ts`, 'utf8')).join('\n'));
execFileSync('npx', ['tsc', '--target', 'ES2020', '--lib', 'ES2020,DOM', '--strict', '--outDir', 'dist', '.build/app.ts'], { stdio: 'inherit' });
console.log('OK → dist/app.js');
