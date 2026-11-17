import { featuredItems, isAvailable, shortPrice } from '../content/menu';
import { menuAnchor } from '../lib/paths';
import { OliveBranch } from './courtyard';
import { Plate } from './plate-art';
import { SiteLink } from './site-link';

// Overhead table, drawn in a 1400 × 520 box. Plate centres and where each caption sits on desktop.
const W = 1400;
const H = 520;
const SEATS = [
  { x: 268, y: 262, caption: { x: 268, y: 362 } },
  { x: 562, y: 186, caption: { x: 562, y: 286 } },
  { x: 852, y: 282, caption: { x: 852, y: 382 } },
  { x: 1136, y: 214, caption: { x: 1136, y: 314 } },
] as const;

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(2)}%`;

/**
 * The signature: a shared meze table laid from the menu. The four `featured` dishes each take a
 * plate; the drawing, name, price and availability all come from the same item record as /menu/.
 * Captions are real HTML links to the dish anchors: beside each plate on desktop, a numbered list
 * under the table on smaller screens. An unavailable dish keeps its plate, emptied and marked.
 */
export function SharedTable() {
  const dishes = featuredItems.slice(0, SEATS.length);
  return (
    <figure id="shared-table" className="relative m-0" aria-labelledby="shared-table-title">
      <svg className="table-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="table-clip"><ellipse cx="700" cy="260" rx="652" ry="214" /></clipPath>
        </defs>
        <ellipse className="t-shadow" cx="714" cy="276" rx="664" ry="224" />
        <ellipse className="t-top" cx="700" cy="260" rx="660" ry="222" strokeWidth="16" />
        {/* Linen runner across the middle of the table */}
        <g clipPath="url(#table-clip)">
          <rect className="t-runner" x="0" y="200" width={W} height="116" />
          <path className="t-runner-line" d="M0 209 H1400 M0 307 H1400" strokeWidth="2" />
          <path className="t-runner-line" d="M0 215 H1400 M0 301 H1400" strokeWidth="1" strokeDasharray="6 8" />
        </g>
        <ellipse className="t-inner" cx="700" cy="260" rx="630" ry="196" strokeWidth="2" />

        {/* Napkins and forks at the places */}
        {[[150, 170, -20], [420, 410, 12], [1010, 420, -8], [1290, 330, 24], [760, 74, 4]].map(([x, y, a]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${a})`}>
            <rect className="t-napkin" x="-22" y="-34" width="44" height="68" rx="4" />
            <path className="t-cutlery" d="M-6 -26 V26 M6 -26 V26 M3 -26 V-12 M9 -26 V-12" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}

        {/* Olive bowl */}
        <g transform="translate(400 98)">
          <circle className="t-bowl" r="46" />
          <circle className="t-bowl-inner" r="36" />
          {[[-12, -8], [8, -14], [14, 6], [-6, 12], [-18, 8], [2, -2]].map(([x, y], i) => (
            <ellipse key={i} className={i % 2 ? 'olive-fruit' : 'leaf'} cx={x} cy={y} rx="8" ry="10" transform={`rotate(${i * 30} ${x} ${y})`} />
          ))}
        </g>

        {/* Lemon wedges on a small dish */}
        <g transform="translate(990 90)">
          <circle className="plate-body" r="40" strokeWidth="3" />
          <path className="f-lemon" d="M-22 4 a22 22 0 0 1 22 -22 L0 4 Z" />
          <path className="f-lemon" d="M4 -6 a22 22 0 0 1 22 22 L4 16 Z" />
          <path className="f-lemon" d="M-12 10 a20 20 0 0 0 18 18 L6 10 Z" />
        </g>

        {/* Pita in a basket */}
        <g transform="translate(640 420) scale(.9)">
          <ellipse className="t-napkin" rx="84" ry="44" />
          <path className="f-bread" d="M-64 0 L-6 -30 L-2 22 Z M-14 -22 L50 -24 L22 26 Z M6 14 L66 4 L28 34 Z" />
        </g>

        {/* Water glasses */}
        <circle className="t-glass" cx="148" cy="330" r="24" strokeWidth="3" />
        <circle className="t-glass" cx="1196" cy="128" r="24" strokeWidth="3" />

        {dishes.map((item, index) => (
          <Plate key={item.id} x={SEATS[index].x} y={SEATS[index].y} art={item.art} color={item.color}
            r={88} available={isAvailable(item)} number={index + 1} />
        ))}

        <g transform="translate(1190 -20) scale(.85)"><OliveBranch /></g>
      </svg>

      <figcaption>
        <h2 id="shared-table-title" className="sr-only">Four dishes from the menu, laid on the shared table</h2>
        <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 lg:mt-0 lg:block">
          {dishes.map((item, index) => {
            const available = isAvailable(item);
            const seat = SEATS[index];
            return (
              <li key={item.id}
                className="flex gap-2.5 lg:absolute lg:block lg:w-44 lg:-translate-x-1/2 lg:text-center"
                style={{ left: pct(seat.caption.x, W), top: pct(seat.caption.y, H) }}>
                <span className="grid size-7 flex-none place-items-center rounded-full border-2 border-accent text-[.8rem] font-bold text-link figures lg:hidden" aria-hidden="true">{index + 1}</span>
                <span className="grid">
                  <SiteLink href={menuAnchor(item.id)} className="text-link justify-self-start font-display lg:justify-self-center text-[1.02rem] leading-snug lg:text-[1.1rem]">{item.name}</SiteLink>
                  <span className="text-[.86rem] text-muted figures">
                    {available ? shortPrice(item) : <strong className="font-semibold text-ink">Not available</strong>}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </figcaption>
    </figure>
  );
}
