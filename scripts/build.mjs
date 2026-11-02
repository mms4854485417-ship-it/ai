import { mkdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
let html = await readFile(new URL('public/index.html', root), 'utf8');
// The prototype is self-contained. Avoid optional external font requests in the published copy.
html = html.replace(/<link[^>]+href="https:\/\/fonts\.[^>]+>/g, '');
await mkdir(new URL('docs/', root), { recursive: true });
await writeFile(new URL('docs/index.html', root), html);
await writeFile(new URL('docs/.nojekyll', root), '');
console.log('GitHub Pages 배포 파일 생성: docs/index.html');
