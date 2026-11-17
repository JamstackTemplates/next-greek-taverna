import type { ReactNode } from 'react';
import type { Art, FoodColor } from '../content/menu';

/**
 * Food silhouettes for the shared table, drawn around (0, 0) within a radius of about 60.
 * Each dish's `art` picks the shape and its `color` token tints it (see `.food` in tailwind.input.css),
 * so the same drawing follows light and dark mode. Decorative: names and prices are real HTML.
 */
export function PlateFood({ art, color }: { art: Art; color: FoodColor }) {
  return <g className="food" data-color={color}>{FOOD[art]}</g>;
}

const herbs = (points: [number, number, number][]) => points.map(([x, y, r], i) => (
  <ellipse key={i} className="f-herb" cx={x} cy={y} rx={r * 1.6} ry={r * .7} transform={`rotate(${(i * 47) % 180} ${x} ${y})`} />
));

const FOOD: Record<Art, ReactNode> = {
  // A swirled dip with a pool of olive oil and a scatter of herbs, pita leaning on the rim.
  dip: (
    <>
      <path className="f-bread" d="M38 -50 L70 -18 Q62 -8 50 -14 L30 -40 Z" />
      <path className="f-bread" d="M52 -56 L78 -32 Q76 -22 66 -24 L44 -48 Z" opacity=".85" />
      <circle className="f-main" r="50" />
      <path className="f-stroke" d="M-34 6 A34 34 0 0 1 32 -6 M30 10 A28 28 0 0 1 -24 22 M-18 6 A18 18 0 0 1 18 -2" strokeWidth="3.5" strokeLinecap="round" opacity=".4" />
      <ellipse className="f-oil" cx="6" cy="-4" rx="15" ry="10" opacity=".85" />
      <circle className="f-deep" cx="-6" cy="-2" r="2.4" />
      <circle className="f-deep" cx="14" cy="6" r="2" />
      {herbs([[-24, -26, 3], [26, 22, 3], [-30, 20, 2.6], [8, -30, 2.4]])}
    </>
  ),
  // Chunky salad or roast vegetables: wedges, rounds and herbs.
  salad: (
    <>
      <path className="f-main" d="M-40 -18 L-6 -34 L-14 -2 Z" />
      <path className="f-deep" d="M10 -40 L42 -20 L12 -10 Z" />
      <path className="f-main" d="M22 4 L50 22 L18 34 Z" />
      <path className="f-main" d="M-46 14 L-16 6 L-26 38 Z" />
      <path className="f-deep" d="M-8 22 L14 14 L6 46 Z" />
      <rect className="f-cream" x="-20" y="-14" width="34" height="24" rx="4" transform="rotate(-12 -3 -2)" stroke="var(--food-line)" strokeWidth="1.5" />
      <circle className="f-herb" cx="34" cy="-2" r="8" opacity=".75" />
      <circle className="f-cream" cx="34" cy="-2" r="4" opacity=".7" />
      <circle className="f-herb" cx="-34" cy="-38" r="7" opacity=".75" />
      <ellipse className="f-olive" cx="-4" cy="-44" rx="5" ry="6.5" />
      <ellipse className="f-olive" cx="40" cy="38" rx="5" ry="6.5" />
      {herbs([[-28, 0, 2.6], [0, 32, 2.6], [20, -28, 2.4], [-40, 30, 2.2]])}
    </>
  ),
  // Two skewers over the plate with a wedge of lemon.
  skewer: (
    <>
      {[-14, 14].map(offset => (
        <g key={offset} transform={`translate(0 ${offset}) rotate(-18)`}>
          <line className="f-wood" x1="-64" y1="0" x2="62" y2="0" strokeWidth="3" strokeLinecap="round" />
          {[-44, -22, 0, 22, 44].map((x, i) => (
            <rect key={x} className={i % 2 ? 'f-deep' : 'f-main'} x={x - 9} y="-9" width="18" height="18" rx="5" />
          ))}
          <path className="f-line" d="M-48 -4 l8 8 M-26 -4 l8 8 M-4 -4 l8 8 M18 -4 l8 8 M40 -4 l8 8" strokeWidth="2" />
        </g>
      ))}
      <path className="f-lemon" d="M30 -50 a18 18 0 0 1 22 22 Z" />
      {herbs([[-36, 40, 2.6], [-16, 46, 2.2]])}
    </>
  ),
  // A whole grilled fish with lemon slices.
  fish: (
    <>
      <path className="f-fish" d="M-60 0 C-34 -30 26 -30 42 -5 L62 -24 L56 0 L62 24 L42 5 C26 30 -34 30 -60 0 Z" />
      <path className="f-line" d="M-34 -14 l10 26 M-18 -18 l10 32 M-2 -18 l10 32 M14 -15 l8 24" strokeWidth="3" />
      <circle className="f-dark" cx="-44" cy="-4" r="3" />
      <circle className="f-lemon" cx="-14" cy="40" r="11" />
      <circle className="f-light" cx="-14" cy="40" r="7" />
      <circle className="f-lemon" cx="8" cy="44" r="10" />
      <circle className="f-light" cx="8" cy="44" r="6" />
      {herbs([[26, -32, 2.6], [36, 30, 2.4], [-36, -32, 2.4]])}
    </>
  ),
  // Diamonds and squares of filo pastry.
  pastry: (
    <>
      {[[-22, -20], [22, -20], [-22, 22], [22, 22]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(45)`}>
          <rect className={i % 3 ? 'f-main' : 'f-deep'} x="-17" y="-17" width="34" height="34" rx="3" />
          <path className="f-line" d="M-12 -6 H12 M-12 2 H12 M-12 10 H12" strokeWidth="1.6" />
        </g>
      ))}
      <circle className="f-herb" cx="-4" cy="2" r="2.4" />
      <circle className="f-herb" cx="6" cy="-4" r="2" />
      <circle className="f-herb" cx="2" cy="8" r="2" />
    </>
  ),
  // A bowl of thick yoghurt with a honey drizzle and walnuts.
  yoghurt: (
    <>
      <circle className="f-cream" r="48" />
      <path className="f-stroke" d="M-34 -14 Q-20 -30 -6 -12 T22 -10 T40 4 M-30 14 Q-12 0 4 16 T34 22" strokeWidth="5" strokeLinecap="round" />
      <path className="f-deep" d="M-6 -30 l7 -4 l5 6 l-6 6 Z M20 26 l8 -2 l2 8 l-8 3 Z M-24 26 l6 -5 l6 5 l-5 6 Z" />
    </>
  ),
  // A glass from above: rim, drink and a highlight.
  glass: (
    <>
      <circle className="t-glass" r="40" strokeWidth="3" />
      <circle className="f-main" r="31" opacity=".85" />
      <path d="M-18 -20 A26 26 0 0 1 8 -28" fill="none" stroke="var(--food-cream)" strokeWidth="4" strokeLinecap="round" opacity=".7" />
      <circle className="f-light" cx="52" cy="-30" r="12" />
      <path className="f-lemon" d="M48 -38 a10 10 0 0 1 12 12 Z" />
    </>
  ),
  // A small coffee cup on its saucer.
  cup: (
    <>
      <circle className="f-cream" r="46" />
      <rect className="f-cream" x="30" y="-7" width="26" height="14" rx="7" stroke="var(--food-line)" strokeWidth="2" />
      <circle className="f-cream" r="30" stroke="var(--food-line)" strokeWidth="2.5" />
      <circle className="f-dark" r="23" />
      <circle className="f-deep" r="16" opacity=".8" />
      <circle className="t-glass" cx="-40" cy="36" r="13" strokeWidth="2" />
    </>
  ),
};

/** A plate, its shadow and food, centred on (x, y). */
export function Plate({ x, y, r = 96, art, color, available = true, number }: {
  x: number; y: number; r?: number; art: Art; color: FoodColor; available?: boolean; number?: number;
}) {
  const scale = r / 70;
  return (
    <g className="plate" data-available={String(available)} transform={`translate(${x} ${y})`}>
      <ellipse className="plate-shadow" cx="6" cy="10" rx={r} ry={r * .96} />
      <circle className="plate-body" r={r} strokeWidth="5" />
      <circle className="plate-ring" r={r - 12} strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
      <g transform={`scale(${scale})`}><PlateFood art={art} color={color} /></g>
      {number !== undefined ? (
        <g className="plate-number-group">
          <circle className="plate-body" cx={-r * .74} cy={-r * .74} r="26" strokeWidth="4" />
          <text className="plate-number" x={-r * .74} y={-r * .74} dy="11" textAnchor="middle" fontSize="32">{number}</text>
        </g>
      ) : null}
    </g>
  );
}
