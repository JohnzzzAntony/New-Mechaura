/**
 * Generates branded SVG "technical view" images for every product so each
 * product gallery has multiple related visuals alongside its photograph.
 *
 * Run with:  node tools/generate-product-media.mjs
 * Output:    public/images/products/*.svg
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const W = 1200;
const H = 800;

const BG = '#0A0A0A';
const SURFACE = '#141414';
const LINE = '#3A3A3A';
const LINE_SOFT = '#242424';
const TEXT = '#FFFFFF';
const MUTED = '#8A8A8A';
const ACCENT = '#FF4500';

/* -------------------------------------------------------------------------- */
/* Frame                                                                       */
/* -------------------------------------------------------------------------- */

function frame({ eyebrow, title, caption, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A4A4A"/>
      <stop offset="45%" stop-color="#2A2A2A"/>
      <stop offset="55%" stop-color="#333333"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="metalH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="35%" stop-color="#4A4A4A"/>
      <stop offset="65%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="ember" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="#B32F00"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- corner ticks -->
  <g stroke="${ACCENT}" stroke-width="2" fill="none" opacity="0.9">
    <path d="M40 76V40h36"/><path d="M${W - 76} 40h36v36"/>
    <path d="M40 ${H - 76}v36h36"/><path d="M${W - 40} ${H - 76}v36h-36"/>
  </g>

  <text x="64" y="90" fill="${ACCENT}" font-family="'Space Grotesk',sans-serif" font-size="17" font-weight="700" letter-spacing="4.5">${esc(eyebrow.toUpperCase())}</text>
  <text x="64" y="134" fill="${TEXT}" font-family="'Space Grotesk',sans-serif" font-size="40" font-weight="700">${esc(title)}</text>

  ${body}

  <line x1="64" y1="${H - 96}" x2="${W - 64}" y2="${H - 96}" stroke="${LINE_SOFT}" stroke-width="1"/>
  <text x="64" y="${H - 60}" fill="${MUTED}" font-family="Inter,sans-serif" font-size="19">${esc(caption)}</text>
  <text x="${W - 64}" y="${H - 60}" fill="${MUTED}" text-anchor="end" font-family="'Space Grotesk',sans-serif" font-size="15" letter-spacing="3">MECHAURA INTERNATIONAL</text>
</svg>
`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* -------------------------------------------------------------------------- */
/* Shared drawing helpers                                                      */
/* -------------------------------------------------------------------------- */

/** Horizontal dimension line with a centred label. */
function dimH(x1, x2, y, label) {
  const mid = (x1 + x2) / 2;
  return `<g stroke="${ACCENT}" stroke-width="1.5" fill="none" opacity="0.85">
    <path d="M${x1} ${y - 9}v18"/><path d="M${x2} ${y - 9}v18"/><path d="M${x1} ${y}H${x2}"/>
  </g>
  <text x="${mid}" y="${y - 16}" fill="${ACCENT}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="600">${esc(label)}</text>`;
}

/** Leader line from a drawing feature out to a text callout. */
function callout(x, y, tx, ty, label) {
  const anchor = tx < x ? 'end' : 'start';
  return `<g stroke="${ACCENT}" stroke-width="1.4" fill="none" opacity="0.85">
    <path d="M${x} ${y}L${tx} ${ty}"/>
    <circle cx="${x}" cy="${y}" r="4" fill="${ACCENT}" stroke="none"/>
  </g>
  <text x="${tx + (anchor === 'end' ? -10 : 10)}" y="${ty + 5}" fill="${TEXT}" text-anchor="${anchor}" font-family="Inter,sans-serif" font-size="17">${esc(label)}</text>`;
}

/* -------------------------------------------------------------------------- */
/* Product schematics                                                          */
/* -------------------------------------------------------------------------- */

const schematics = {
  'air-filter'() {
    const x = 430, y = 250, w = 340, h = 300;
    let pleats = '';
    for (let i = 0; i <= 20; i++) {
      const px = x + (i * w) / 20;
      pleats += `<path d="M${px} ${y}V${y + h}" stroke="${LINE}" stroke-width="${i % 2 ? 1 : 2}"/>`;
    }
    return `<g>
      <ellipse cx="${x + w / 2}" cy="${y - 26}" rx="${w / 2}" ry="26" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${pleats}</g>
      <ellipse cx="${x + w / 2}" cy="${y + h}" rx="${w / 2}" ry="26" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <ellipse cx="${x + w / 2}" cy="${y - 26}" rx="52" ry="15" fill="${BG}" stroke="${ACCENT}" stroke-width="2"/>
      <!-- airflow -->
      <g stroke="${ACCENT}" stroke-width="2" fill="none" opacity="0.75">
        <path d="M250 330h120"/><path d="M250 400h120"/><path d="M250 470h120"/>
        <path d="M355 322l16 8-16 8"/><path d="M355 392l16 8-16 8"/><path d="M355 462l16 8-16 8"/>
      </g>
      <text x="250" y="300" fill="${MUTED}" font-family="Inter,sans-serif" font-size="15">CONTAMINATED AIR</text>
      ${callout(x + w, y + 60, 900, 230, 'Pleated media pack')}
      ${callout(x + w / 2, y - 26, 900, 300, 'Sealed end cap')}
      ${callout(x + w - 30, y + h - 20, 900, 372, 'Anti-collapse core')}
      ${dimH(x, x + w, y + h + 90, 'Ø 90 – 450 mm')}
    </g>`;
  },

  'hydraulic-pumps'() {
    const cx = 560, cy = 400, r = 150;
    let teeth = '';
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * 74, y1 = cy + Math.sin(a) * 74;
      const x2 = cx + Math.cos(a) * 100, y2 = cy + Math.sin(a) * 100;
      teeth += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${LINE}" stroke-width="7" stroke-linecap="round"/>`;
    }
    return `<g>
      <rect x="${cx - r - 40}" y="${cy - r - 10}" width="${2 * r + 80}" height="${2 * r + 20}" rx="34" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="104" fill="${BG}" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${teeth}</g>
      <circle cx="${cx}" cy="${cy}" r="66" fill="url(#metalH)" stroke="${ACCENT}" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${cy}" r="26" fill="${BG}" stroke="${LINE}" stroke-width="2"/>
      <!-- shaft -->
      <rect x="${cx - 250}" y="${cy - 18}" width="86" height="36" rx="6" fill="url(#metalH)" stroke="${LINE}" stroke-width="2"/>
      <!-- ports -->
      <rect x="${cx + r + 20}" y="${cy - 108}" width="70" height="56" rx="8" fill="${SURFACE}" stroke="${ACCENT}" stroke-width="2"/>
      <rect x="${cx + r + 20}" y="${cy + 52}" width="70" height="56" rx="8" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
      <text x="${cx + r + 55}" y="${cy - 74}" fill="${ACCENT}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="18" font-weight="700">P</text>
      <text x="${cx + r + 55}" y="${cy + 88}" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="18" font-weight="700">T</text>
      ${callout(cx - 210, cy, 300, 210, 'Drive shaft')}
      ${callout(cx, cy - 88, 300, 600, 'Gear set')}
      ${callout(cx + r + 90, cy - 80, 960, 240, 'Pressure port')}
      ${callout(cx + r + 90, cy + 80, 960, 560, 'Tank / return port')}
      ${dimH(cx - r, cx + r, cy + r + 78, 'Ø 120 – 320 mm')}
    </g>`;
  },

  brushes() {
    // Strip brush profile (left) + wheel brush (right)
    let bristles = '';
    for (let i = 0; i <= 46; i++) {
      const bx = 190 + i * 6;
      bristles += `<path d="M${bx} 330V${470 + (i % 3) * 6}" stroke="${LINE}" stroke-width="2"/>`;
    }
    let radial = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const x1 = 900 + Math.cos(a) * 78, y1 = 420 + Math.sin(a) * 78;
      const x2 = 900 + Math.cos(a) * 138, y2 = 420 + Math.sin(a) * 138;
      radial += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${i % 5 === 0 ? ACCENT : LINE}" stroke-width="2.4"/>`;
    }
    return `<g>
      <!-- strip brush -->
      <path d="M186 246h296v84h-40v-44H226v44h-40z" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${bristles}</g>
      <text x="334" y="222" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">STRIP / CHANNEL</text>
      ${dimH(186, 482, 560, 'Backing 6 – 30 mm')}
      <!-- wheel brush -->
      <g fill="none">${radial}</g>
      <circle cx="900" cy="420" r="78" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <circle cx="900" cy="420" r="30" fill="${BG}" stroke="${ACCENT}" stroke-width="2.5"/>
      <text x="900" y="222" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">WHEEL / CUP</text>
      ${dimH(762, 1038, 620, 'Ø 75 – 350 mm')}
      <line x1="620" y1="200" x2="620" y2="640" stroke="${LINE_SOFT}" stroke-width="1" stroke-dasharray="6 8"/>
    </g>`;
  },

  hose() {
    const cx = 340, cy = 400;
    const layers = [
      [148, 'Abrasion-resistant cover', LINE],
      [124, 'Outer wire braid', ACCENT],
      [100, 'Intermediate rubber', LINE],
      [78, 'Inner wire braid', ACCENT],
      [56, 'Synthetic rubber tube', LINE],
    ];
    let rings = '';
    layers.forEach(([r, , c]) => {
      rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${c === ACCENT ? 3 : 2}" opacity="${c === ACCENT ? 0.9 : 1}"/>`;
    });
    let braid = '';
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      braid += `<path d="M${(cx + Math.cos(a) * 78).toFixed(1)} ${(cy + Math.sin(a) * 78).toFixed(1)}L${(cx + Math.cos(a) * 100).toFixed(1)} ${(cy + Math.sin(a) * 100).toFixed(1)}" stroke="${LINE}" stroke-width="2"/>`;
    }
    let legend = '';
    layers.forEach(([, label, c], i) => {
      const ly = 236 + i * 66;
      legend += `<rect x="740" y="${ly - 14}" width="18" height="18" rx="4" fill="${c === ACCENT ? ACCENT : LINE}"/>
      <text x="774" y="${ly}" fill="${TEXT}" font-family="Inter,sans-serif" font-size="18">${esc(label)}</text>
      <text x="${W - 64}" y="${ly}" fill="${MUTED}" text-anchor="end" font-family="'Space Grotesk',sans-serif" font-size="16">Layer ${i + 1}</text>`;
    });
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="160" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${braid}</g>
      <g fill="none">${rings}</g>
      <circle cx="${cx}" cy="${cy}" r="56" fill="${BG}"/>
      <text x="${cx}" y="${cy + 8}" fill="${ACCENT}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="22" font-weight="700">BORE</text>
      <text x="${cx}" y="612" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">CROSS-SECTION</text>
      <line x1="620" y1="200" x2="620" y2="640" stroke="${LINE_SOFT}" stroke-width="1" stroke-dasharray="6 8"/>
      ${legend}
      <text x="740" y="600" fill="${ACCENT}" font-family="'Space Grotesk',sans-serif" font-size="19" font-weight="700">Working pressure up to 420 bar</text>
    </g>`;
  },

  elevator() {
    // Guide rail T-profile + hoistway elevation
    let rungs = '';
    for (let i = 0; i < 9; i++) {
      rungs += `<path d="M700 ${240 + i * 44}h300" stroke="${LINE_SOFT}" stroke-width="1"/>`;
    }
    return `<g>
      <!-- T-profile rail -->
      <path d="M180 250h260v58H344v290h-58V308H180z" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <text x="310" y="222" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">T-GUIDE RAIL</text>
      ${dimH(180, 440, 640, 'T70 / T89 / T127')}
      <line x1="620" y1="200" x2="620" y2="660" stroke="${LINE_SOFT}" stroke-width="1" stroke-dasharray="6 8"/>
      <!-- hoistway -->
      <rect x="700" y="220" width="300" height="400" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${rungs}</g>
      <rect x="740" y="330" width="220" height="180" rx="6" fill="${BG}" stroke="${ACCENT}" stroke-width="2.5"/>
      <path d="M850 330V220" stroke="${ACCENT}" stroke-width="2.5"/>
      <circle cx="850" cy="220" r="26" fill="${SURFACE}" stroke="${ACCENT}" stroke-width="2.5"/>
      <path d="M850 510v70" stroke="${LINE}" stroke-width="2"/>
      <rect x="800" y="580" width="100" height="34" rx="6" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      ${callout(850, 220, 1100, 190, 'Traction machine')}
      ${callout(960, 360, 1100, 400, 'Door operator')}
      ${callout(850, 597, 1100, 640, 'Buffer system')}
      <text x="850" y="690" fill="${MUTED}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">HOISTWAY ASSEMBLY</text>
    </g>`;
  },

  blades() {
    // Blade band + tooth geometry detail
    let teeth = '';
    for (let i = 0; i < 22; i++) {
      const tx = 160 + i * 42;
      teeth += `<path d="M${tx} 330l24-42 18 42z" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>`;
    }
    return `<g>
      <rect x="160" y="330" width="920" height="86" fill="url(#metalH)" stroke="${LINE}" stroke-width="2"/>
      <g>${teeth}</g>
      <path d="M160 372h920" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="10 10" opacity="0.6"/>
      ${dimH(160, 1080, 470, 'Band length 1 000 – 8 000 mm')}
      <!-- tooth detail -->
      <circle cx="320" cy="600" r="96" fill="${SURFACE}" stroke="${ACCENT}" stroke-width="2"/>
      <path d="M254 640l44-78 30 46 32-52 34 84z" fill="none" stroke="${TEXT}" stroke-width="2.5"/>
      <path d="M254 640h140" stroke="${LINE}" stroke-width="2"/>
      <line x1="330" y1="500" x2="374" y2="380" stroke="${ACCENT}" stroke-width="1.4" stroke-dasharray="5 6"/>
      <text x="450" y="560" fill="${TEXT}" font-family="Inter,sans-serif" font-size="19">Variable tooth pitch — 2/3, 3/4, 4/6, 5/8 TPI</text>
      <text x="450" y="600" fill="${MUTED}" font-family="Inter,sans-serif" font-size="18">Bimetal M42 / M51 high-speed steel edge</text>
      <text x="450" y="640" fill="${MUTED}" font-family="Inter,sans-serif" font-size="18">Widths 13 – 80 mm · Gauge 0.65 – 1.60 mm</text>
      <text x="160" y="300" fill="${MUTED}" font-family="'Space Grotesk',sans-serif" font-size="17" letter-spacing="2">TOOTH PROFILE</text>
    </g>`;
  },

  bearings() {
    const cx = 400, cy = 410;
    let balls = '';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      balls += `<circle cx="${(cx + Math.cos(a) * 132).toFixed(1)}" cy="${(cy + Math.sin(a) * 132).toFixed(1)}" r="30" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>`;
    }
    let cage = '';
    for (let i = 0; i < 10; i++) {
      const a = ((i + 0.5) / 10) * Math.PI * 2 - Math.PI / 2;
      cage += `<path d="M${(cx + Math.cos(a) * 106).toFixed(1)} ${(cy + Math.sin(a) * 106).toFixed(1)}L${(cx + Math.cos(a) * 158).toFixed(1)} ${(cy + Math.sin(a) * 158).toFixed(1)}" stroke="${ACCENT}" stroke-width="3" opacity="0.8"/>`;
    }
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="186" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="160" fill="${BG}" stroke="${LINE}" stroke-width="2"/>
      <g fill="none">${cage}</g>
      <g>${balls}</g>
      <circle cx="${cx}" cy="${cy}" r="104" fill="url(#metal)" stroke="${LINE}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="62" fill="${BG}" stroke="${ACCENT}" stroke-width="2.5"/>
      ${callout(cx, cy - 186, 820, 240, 'Outer ring')}
      ${callout(cx + 132, cy, 820, 316, 'Rolling element')}
      ${callout(cx + 74, cy + 74, 820, 392, 'Cage / retainer')}
      ${callout(cx, cy + 62, 820, 468, 'Bore — inner ring')}
      <text x="820" y="560" fill="${ACCENT}" font-family="'Space Grotesk',sans-serif" font-size="19" font-weight="700">Tolerance class P0 – P4</text>
      <text x="820" y="600" fill="${MUTED}" font-family="Inter,sans-serif" font-size="18">Bore Ø 8 – 400 mm</text>
      ${dimH(cx - 186, cx + 186, cy + 236, 'Outside Ø')}
    </g>`;
  },

  'cutting-tools': (function () {
    return function () {
      let flutes = '';
      for (let i = 0; i < 7; i++) {
        const y0 = 300 + i * 46;
        flutes += `<path d="M700 ${y0}C640 ${y0 + 18} 580 ${y0 + 26} 520 ${y0 + 40}" fill="none" stroke="${LINE}" stroke-width="3"/>`;
      }
      return `<g>
        <!-- shank -->
        <rect x="700" y="286" width="300" height="300" rx="10" fill="url(#metalH)" stroke="${LINE}" stroke-width="2"/>
        <!-- flute body -->
        <path d="M700 286H470l-60 150 60 150h230z" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
        <g>${flutes}</g>
        <path d="M410 436l-60-40v80z" fill="url(#ember)"/>
        ${dimH(350, 700, 640, 'Flute length')}
        ${dimH(700, 1000, 640, 'Shank')}
        ${callout(430, 400, 300, 250, '4-flute geometry')}
        ${callout(860, 300, 900, 210, 'h6 ground shank')}
        <text x="64" y="700" fill="${MUTED}" font-family="Inter,sans-serif" font-size="18">Micro-grain carbide · TiAlN coated · Ø 1 – 25 mm</text>
      </g>`;
    };
  })(),
};

/* -------------------------------------------------------------------------- */
/* Spec sheet + applications                                                   */
/* -------------------------------------------------------------------------- */

function specSheet(specs, note) {
  let rows = '';
  specs.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 90 + col * 530;
    const y = 240 + row * 96;
    rows += `<rect x="${x}" y="${y}" width="490" height="72" rx="12" fill="${SURFACE}" stroke="${LINE_SOFT}" stroke-width="1"/>
    <circle cx="${x + 42}" cy="${y + 36}" r="18" fill="${ACCENT}" fill-opacity="0.14" stroke="${ACCENT}" stroke-opacity="0.4"/>
    <path d="M${x + 34} ${y + 36}l6 7 12-14" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + 78}" y="${y + 43}" fill="${TEXT}" font-family="Inter,sans-serif" font-size="21">${esc(s)}</text>`;
  });
  return `<g>${rows}
    <text x="90" y="${240 + Math.ceil(specs.length / 2) * 96 + 34}" fill="${ACCENT}" font-family="Inter,sans-serif" font-size="18">${esc(note)}</text>
  </g>`;
}

const APP_ICONS = {
  Manufacturing: 'M6 30V14l8-6 8 6v16z M14 30v-8h6v8',
  Automotive: 'M4 24h28M8 24l4-10h16l4 10M10 28a3 3 0 106 0 3 3 0 10-6 0M20 28a3 3 0 106 0 3 3 0 10-6 0',
  Construction: 'M4 30h30M8 30V16l12-8 12 8v14',
  'Oil & Gas': 'M18 4l10 14a10 10 0 11-20 0z',
  Fabrication: 'M6 28l14-14M14 8l12 12-6 6L8 14z',
  'Facility Management': 'M6 30V10h22v20zM12 16h4M20 16h4M12 22h4M20 22h4',
  Marine: 'M6 26h26l-4 6H10zM19 6v18M12 16h14',
  Aerospace: 'M18 4l4 14 12 4-12 4-4 14-4-14-12-4 12-4z',
};

function applications(apps, note) {
  let cards = '';
  apps.forEach((a, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 90 + col * 350;
    const y = 230 + row * 200;
    cards += `<rect x="${x}" y="${y}" width="310" height="170" rx="18" fill="${SURFACE}" stroke="${LINE_SOFT}" stroke-width="1"/>
    <g transform="translate(${x + 32} ${y + 32}) scale(1.5)" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="${APP_ICONS[a] || APP_ICONS.Manufacturing}"/>
    </g>
    <text x="${x + 32}" y="${y + 140}" fill="${TEXT}" font-family="'Space Grotesk',sans-serif" font-size="22" font-weight="600">${esc(a)}</text>`;
  });
  return `<g>${cards}
    <text x="90" y="${230 + Math.ceil(apps.length / 3) * 200 + 34}" fill="${MUTED}" font-family="Inter,sans-serif" font-size="18">${esc(note)}</text>
  </g>`;
}

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                   */
/* -------------------------------------------------------------------------- */

const products = {
  'air-filter': {
    title: 'Industrial Air Filter',
    specs: ['Wire Filters', 'Depth Filters', 'Adsorption Filters', 'Coalescer Filters', 'Separator Filters', 'Spin-on Filters'],
    apps: ['Manufacturing', 'Oil & Gas', 'Facility Management'],
    note: 'Efficiency ratings from G4 to H14 · Beta ratio documented per batch',
    appNote: 'Supplied with element cross-reference for all major OEM housings.',
  },
  'hydraulic-pumps': {
    title: 'Industrial Hydraulic Pumps',
    specs: ['Gear Pumps', 'Vane Pumps', 'Piston Pumps', 'Axial Pumps', 'Radial Pumps', 'Variable Displacement'],
    apps: ['Manufacturing', 'Construction', 'Marine'],
    note: 'Displacement 0.5 – 250 cc/rev · Pressure to 350 bar',
    appNote: 'Bench-tested before dispatch with a printed performance curve.',
  },
  brushes: {
    title: 'Specialized Brushes',
    specs: ['Strip Brushes', 'Cylinder Brushes', 'Wheel Brushes', 'Cup Brushes', 'End Brushes', 'Honing Brushes'],
    apps: ['Manufacturing', 'Automotive', 'Fabrication'],
    note: 'Fill: crimped/knotted steel, brass, nylon, abrasive nylon grit 46 – 600',
    appNote: 'Custom fill, trim length and backing profiles built to drawing.',
  },
  hose: {
    title: 'Hydraulic Hose',
    specs: ['Wire Braided', 'Spiral Reinforced', 'Thermoplastic', 'Suction & Return', 'High Temp', 'Chemical Resistant'],
    apps: ['Construction', 'Oil & Gas', 'Marine'],
    note: 'EN 853 / EN 856 / SAE 100R · Assemblies crimped and pressure-tested in house',
    appNote: 'Same-day assembly service with test certificates on request.',
  },
  elevator: {
    title: 'Elevator Accessories',
    specs: ['Guide Rails', 'Traction Machines', 'Control Systems', 'Door Operators', 'Safety Gears', 'Buffer Systems'],
    apps: ['Construction', 'Facility Management', 'Manufacturing'],
    note: 'EN 81-20/50 compliant components · OEM and compatible equivalents',
    appNote: 'Model-matched spares for the major lift brands installed across the UAE.',
  },
  blades: {
    title: 'Bandsaw Blades',
    specs: ['Bimetal', 'Carbide Tipped', 'Carbon Steel', 'Wood Cutting', 'Meat Cutting', 'Pallet Dismantling'],
    apps: ['Manufacturing', 'Fabrication', 'Construction'],
    note: 'Welded to length in house · Width 13 – 80 mm · 2/3 – 10/14 TPI',
    appNote: 'Blade selection advice based on your material, section and machine.',
  },
  bearings: {
    title: 'Industrial Bearings',
    specs: ['Ball Bearings', 'Roller Bearings', 'Needle Bearings', 'Tapered Roller', 'Spherical Roller', 'Thrust Bearings'],
    apps: ['Manufacturing', 'Automotive', 'Aerospace'],
    note: 'Genuine brand stock with traceable batch numbers · P0 – P4 tolerance',
    appNote: 'Interchange lookup across SKF, FAG, NSK, NTN and Timken numbering.',
  },
  'cutting-tools': {
    title: 'Cutting Tools',
    specs: ['End Mills', 'Drills', 'Taps', 'Reamers', 'Inserts', 'Tool Holders'],
    apps: ['Manufacturing', 'Fabrication', 'Aerospace'],
    note: 'Solid carbide and HSS-Co · TiN / TiAlN / DLC coatings available',
    appNote: 'Cutting-data sheets supplied with every tooling package.',
  },
};

/* -------------------------------------------------------------------------- */

const outDirs = [join(ROOT, 'public', 'images', 'products')];
outDirs.forEach((d) => mkdirSync(d, { recursive: true }));

let count = 0;
for (const [id, p] of Object.entries(products)) {
  const files = {
    [`${id}-schematic.svg`]: frame({
      eyebrow: 'Technical View',
      title: p.title,
      caption: 'Indicative schematic — dimensions confirmed against your specification at quotation.',
      body: schematics[id](),
    }),
    [`${id}-specifications.svg`]: frame({
      eyebrow: 'Range & Specification',
      title: `${p.title} — Range`,
      caption: 'Full technical datasheets available on request.',
      body: specSheet(p.specs, p.note),
    }),
    [`${id}-applications.svg`]: frame({
      eyebrow: 'Applications',
      title: `Where ${p.title} Are Used`,
      caption: 'Supplied across the UAE and wider GCC.',
      body: applications(p.apps, p.appNote),
    }),
  };

  for (const [name, svg] of Object.entries(files)) {
    outDirs.forEach((d) => writeFileSync(join(d, name), svg, 'utf8'));
    count++;
  }
}

console.log(`Generated ${count} SVG views across ${Object.keys(products).length} products.`);
