#!/usr/bin/env node
// Builds index.html from index.src.html: compiles the page's JSX and Tailwind
// ahead of time so visitors no longer run Babel and the Tailwind CDN.
// Edit index.src.html, then run: node scripts/build-site.mjs
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const ESBUILD = 'esbuild@0.25.12';
const TAILWIND = 'tailwindcss@3.4.17';
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const once = (html, from, to) => {
  if (html.split(from).length !== 2) throw new Error('Expected exactly one match: ' + from);
  return html.replace(from, () => to);
};

let html = readFileSync('index.src.html', 'utf8');

const open = '<script type="text/babel">';
const start = html.indexOf(open);
const end = html.indexOf('</script>', start);
if (start < 0 || end < 0 || html.indexOf(open, start + 1) >= 0) throw new Error('Expected one text/babel script');
const jsx = html.slice(start + open.length, end).replace('__BENCH3D_V__', hash(readFileSync('refinement/workbench3d.js', 'utf8')));

const js = execFileSync('npx', ['--yes', ESBUILD, '--loader=jsx', '--minify', '--target=es2019', '--jsx-factory=React.createElement', '--jsx-fragment=React.Fragment'], { input: jsx, maxBuffer: 1 << 28 }).toString();
writeFileSync('refinement/app.js', js);

execFileSync('npx', ['--yes', TAILWIND, '-c', 'scripts/tailwind.config.cjs', '-o', 'refinement/tailwind.css', '--minify'], { stdio: ['ignore', 'ignore', 'inherit'] });
const css = readFileSync('refinement/tailwind.css', 'utf8');

html = html.slice(0, start) + `<script src="refinement/app.js?v=${hash(js)}"></script>` + html.slice(end + '</script>'.length);
html = html.replace(/<script src="https:\/\/unpkg\.com\/react@[^>]*><\/script>/, '<script src="refinement/vendor/react.production.min.js"></script>');
html = html.replace(/<script src="https:\/\/unpkg\.com\/react-dom@[^>]*><\/script>/, '<script src="refinement/vendor/react-dom.production.min.js"></script>');
html = html.replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^>]*><\/script>/, '');
html = once(html, '<script src="https://cdn.tailwindcss.com"></script>', '');
// The CDN appended its styles last in <head>, so the built sheet goes there too.
html = once(html, '</head>', `<link rel="stylesheet" href="refinement/tailwind.css?v=${hash(css)}">\n</head>`);
for (const bad of ['unpkg.com', 'cdn.tailwindcss.com', 'text/babel']) if (html.includes(bad)) throw new Error('Left in output: ' + bad);

writeFileSync('index.html', html);
console.log(`index.html ${html.length} bytes, app.js ${js.length}, tailwind.css ${css.length}`);
