// Validates meta titles (pixel width, Arial 20px table) and description length.
import { readFileSync } from 'node:fs';

const WIDTHS = {
  ' ': 5.56, '!': 5.56, '"': 6.67, '#': 11.11, '$': 11.11, '%': 14.44, '&': 13.33, "'": 3.33,
  '(': 6.67, ')': 6.67, '*': 6.67, '+': 11.11, ',': 4.44, '-': 6.67, '.': 4.44, '/': 6.67,
  ':': 4.44, ';': 4.44, '<': 11.11, '=': 11.11, '>': 11.11, '?': 11.11, '@': 18.89, '[': 6.67,
  '\\': 6.67, ']': 6.67, '^': 8.89, '_': 8.89, '`': 6.67, '{': 7.78, '|': 4.44, '}': 7.78, '~': 11.11,
  '…': 8.89, '—': 13.33, '–': 8.33, '’': 3.33, '“': 6.67, '”': 6.67,
  'a': 11.11, 'b': 11.11, 'c': 10.0, 'd': 11.11, 'e': 11.11, 'f': 5.56, 'g': 11.11, 'h': 11.11,
  'i': 4.44, 'j': 4.44, 'k': 10.0, 'l': 4.44, 'm': 16.67, 'n': 11.11, 'o': 11.11, 'p': 11.11,
  'q': 11.11, 'r': 6.67, 's': 10.0, 't': 5.56, 'u': 11.11, 'v': 10.0, 'w': 15.56, 'x': 10.0,
  'y': 10.0, 'z': 10.0,
  'A': 13.33, 'B': 11.67, 'C': 12.78, 'D': 13.33, 'E': 10.56, 'F': 10.0, 'G': 13.33, 'H': 13.33,
  'I': 4.44, 'J': 7.78, 'K': 11.67, 'L': 10.0, 'M': 16.67, 'N': 13.33, 'O': 13.33, 'P': 11.67,
  'Q': 13.33, 'R': 11.67, 'S': 11.11, 'T': 11.11, 'U': 13.33, 'V': 13.33, 'W': 18.33, 'X': 12.22,
  'Y': 11.67, 'Z': 11.11,
  '0': 11.11, '1': 11.11, '2': 11.11, '3': 11.11, '4': 11.11, '5': 11.11, '6': 11.11, '7': 11.11,
  '8': 11.11, '9': 11.11,
};

function widthPx(text, fontSize = 20) {
  let em = 0;
  for (const ch of text) em += WIDTHS[ch] ?? 11.11;
  return (em / 20) * fontSize;
}

const src = readFileSync('src/data/pages.ts', 'utf8');
const meta = src.match(/'(?:\\'|[^'])*': \{[^}]*?\},/gs).join('\n');
const entries = [...src.matchAll(/'(\/[^']*)': \{[\s\S]*?title: '((?:\\'|[^'])*)',[\s\S]*?description:\s*\n?\s*'((?:\\'|[^'])*)',/g)];

const TITLE_MAX = 580, DESC_MAX_CHARS = 155;
let fails = 0;
for (const [, path, title, desc] of entries) {
  const t = title.replace(/\\'/g, "'");
  const d = desc.replace(/\\'/g, "'");
  const w = Math.round(widthPx(t));
  const status = [];
  if (w > TITLE_MAX) { status.push(`TITLE ${w}px > ${TITLE_MAX}px`); fails++; }
  if (d.length > DESC_MAX_CHARS) { status.push(`DESC ${d.length} > ${DESC_MAX_CHARS}`); fails++; }
  console.log(`${w}px ${t.length}ch | ${d.length}ch  ${path}${status.length ? '  <<< ' + status.join('; ') : ''}`);
}
console.log(fails ? `\n${fails} FAILURES` : '\nALL PASS');

// --- Localized metadata check ---
function jpWidthPx(text, fontSize = 20) {
  let em = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code > 0x2e80) { em += 20; continue; } // CJK/kana glyphs ~ full width
    em += WIDTHS[ch] ?? 11.11;
  }
  return (em / 20) * fontSize;
}

const loc = readFileSync('src/data/pageMetaLocalized.ts', 'utf8');
const locEntries = [...loc.matchAll(/\{[\s\S]*?title: '((?:\\'|[^'])*)',[\s\S]*?description:\s*\n?\s*'((?:\\'|[^'])*)',/g)];
let lfails = 0;
for (const [, title, desc] of locEntries) {
  const t = title.replace(/\\'/g, "'"), d = desc.replace(/\\'/g, "'");
  const w = Math.round(jpWidthPx(t));
  const status = [];
  if (w > 580) { status.push(`TITLE ${w}px > 580`); lfails++; }
  if (d.length > 170) { status.push(`DESC ${d.length} > 170`); lfails++; }
}

  if (lfails) {
    for (const [, title, desc] of [...loc.matchAll(/\{[\s\S]*?title: '((?:\\'|[^'])*)',[\s\S]*?description:\s*\n?\s*'((?:\\'|[^'])*)',/g)]) {
      const decode = (x) => x.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\'/g, "'");
      const t = decode(title), d = decode(desc);
      const w = Math.round(jpWidthPx(t));
      const status = [];
      if (w > 580) status.push("TITLE " + w + "px > 580");
      if (d.length > 170) status.push("DESC " + d.length + " > 170");
      if (status.length) console.log("  " + status.join("; ") + "  " + t.slice(0, 45));
    }
  }

console.log(`\nLocalized: ${locEntries.length} title/desc pairs checked${lfails ? ` — ${lfails} FAILURES` : ' — ALL PASS'}`);
process.exit(fails || lfails ? 1 : 0);
