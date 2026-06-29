// =====================================================================
// Générateur d'axonométrie — port fidèle de la fonction axo() du design
// Claude « Site Agence L&L ».
//
// À partir d'un massing (liste de boîtes), produit une chaîne SVG : projection
// isométrique, faces gauche/droite, toiture à deux pentes ou toit plat, nez de
// dalle (niveaux), et volumes « accent » en terre cuite. Les remplissages
// utilisent les variables CSS de teinte (--surface / --ph1 / --ph2) pour que
// l'axonométrie suive la palette du projet.
// =====================================================================
import type { AxoBox } from './projets-data';

const S = 12;
const INK = '#2A2620';

// Remplissages d'un volume « accent » (terre cuite) — valeurs du prototype.
const ACCENT = { top: '#E8C7B4', left: '#D9AB92', right: '#CB9A7F' };
// Remplissages neutres : variables de teinte avec repli.
const NEUTRAL = {
  top: 'var(--surface,#F4EFE6)',
  left: 'var(--ph1,#E7DECF)',
  right: 'var(--ph2,#D8CCB7)',
};

type Pt = [number, number];
const proj = (x: number, y: number, z: number): Pt => [
  (x - y) * 0.866 * S,
  (x + y) * 0.5 * S - z * S,
];

interface Poly { points: Pt[]; fill: string }
interface Line { a: Pt; b: Pt }

/** Génère le SVG (string) d'un massing axonométrique. */
export function axoSvg(boxes: AxoBox[]): string {
  if (!boxes.length) return '<svg viewBox="0 0 1 1" width="100%" height="100%"></svg>';
  const pts: Pt[] = [];
  const polys: Poly[] = [];
  const lines: Line[] = [];
  const track = (p: Pt) => { pts.push(p); };

  // tri arrière→avant (peintre)
  const sorted = boxes.slice().sort(
    (A, B) => (A.x + A.y + (A.z || 0)) - (B.x + B.y + (B.z || 0)),
  );

  for (const b of sorted) {
    const x = b.x, y = b.y, z = b.z || 0, w = b.w, d = b.d, h = b.h;
    const fill = b.accent ? ACCENT : NEUTRAL;

    const rf: Pt[] = [proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)];
    const lf: Pt[] = [proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)];
    rf.forEach(track); lf.forEach(track);
    polys.push({ points: rf, fill: fill.right });
    polys.push({ points: lf, fill: fill.left });

    if (b.roof) {
      const rh = b.roof;
      const P1 = proj(x, y, z + h), P2 = proj(x + w, y, z + h), P3 = proj(x + w, y + d, z + h), P4 = proj(x, y + d, z + h);
      const R1 = proj(x, y + d / 2, z + h + rh), R2 = proj(x + w, y + d / 2, z + h + rh);
      [P1, P2, P3, P4, R1, R2].forEach(track);
      polys.push({ points: [P1, P2, R2, R1], fill: fill.top });
      polys.push({ points: [P4, P3, R2, R1], fill: fill.left });
      polys.push({ points: [P2, P3, R2], fill: fill.right });
      lines.push({ a: R1, b: R2 });
    } else {
      const top: Pt[] = [proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)];
      top.forEach(track);
      polys.push({ points: top, fill: fill.top });
    }

    if (b.floors) {
      const n = b.floors;
      for (let i = 1; i < n; i++) {
        const zz = z + h * i / n;
        lines.push({ a: proj(x + w, y, zz), b: proj(x + w, y + d, zz) });
        lines.push({ a: proj(x, y + d, zz), b: proj(x + w, y + d, zz) });
      }
    }
  }

  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const p of pts) {
    minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
  }
  const pad = 12;
  const vb = `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`;
  const ps = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const polyEls = polys.map(
    (p) => `<polygon points="${ps(p.points)}" fill="${p.fill}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`,
  ).join('');
  const lineEls = lines.map(
    (l) => `<line x1="${l.a[0].toFixed(1)}" y1="${l.a[1].toFixed(1)}" x2="${l.b[0].toFixed(1)}" y2="${l.b[1].toFixed(1)}" stroke="${INK}" stroke-width="1.1" stroke-linecap="round"/>`,
  ).join('');

  return `<svg viewBox="${vb}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible">${polyEls}${lineEls}</svg>`;
}
