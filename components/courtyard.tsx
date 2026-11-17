/**
 * An olive branch with leaves and two olives, about 220 × 160. Used over the table edge and the
 * courtyard wall. The leaves sway very slowly; the motion stops for reduced-motion visitors.
 */
export function OliveBranch() {
  const leaves: [number, number, number, boolean][] = [
    [30, 22, 28, false], [58, 44, -30, true], [84, 50, 34, false], [110, 74, -24, true],
    [134, 82, 40, false], [158, 106, -18, true], [176, 116, 46, false], [194, 140, 10, true],
  ];
  return (
    <g>
      <path className="branch" d="M0 0 C40 30 90 52 120 78 S180 120 206 150" strokeWidth="4" strokeLinecap="round" />
      <g className="sway">
        {leaves.map(([x, y, angle, light], i) => (
          <ellipse key={i} className={light ? 'leaf-2' : 'leaf'} cx={x} cy={y} rx="24" ry="7"
            transform={`rotate(${angle} ${x} ${y}) translate(${light ? 12 : -12} ${light ? 10 : -10})`} />
        ))}
      </g>
      <g className="sway sway-late">
        <ellipse className="olive-fruit" cx="96" cy="84" rx="8" ry="10" />
        <ellipse className="olive-fruit" cx="150" cy="118" rx="7" ry="9" />
      </g>
    </g>
  );
}

/**
 * The summer courtyard: a low whitewashed wall with a painted cobalt cap, two woven chairs, a small
 * table and an olive branch. Palette tokens turn the same drawing moonlit in dark mode; the theme
 * never represents the actual local time or claims the terrace is open.
 */
export function Courtyard({ className = '' }: { className?: string }) {
  return (
    <svg className={`courtyard-art block h-auto w-full ${className}`} viewBox="0 0 640 440" aria-hidden="true" focusable="false">
      <circle className="c-orb" cx="400" cy="84" r="40" opacity=".9" />
      {/* Wall */}
      <rect className="c-wall" x="0" y="180" width="640" height="190" />
      <rect className="c-wall-shade" x="0" y="300" width="640" height="70" opacity=".7" />
      <rect className="c-cap" x="-6" y="168" width="652" height="18" rx="3" />
      <path className="c-wall-shade" d="M120 220 h60 M300 250 h90 M470 230 h70 M60 280 h50" stroke="var(--wall-shade)" strokeWidth="3" strokeLinecap="round" />
      {/* Ground */}
      <rect className="c-ground" x="0" y="370" width="640" height="70" />
      <path d="M0 370 H640" stroke="var(--wall-cap)" strokeWidth="2" opacity=".35" />

      {/* Planter with basil on the wall */}
      <g transform="translate(560 132)">
        <path className="c-cap" d="M-26 18 h52 l-6 26 h-40 Z" />
        <circle className="leaf" cx="-12" cy="10" r="12" /><circle className="leaf-2" cx="6" cy="4" r="13" /><circle className="leaf" cx="18" cy="14" r="10" />
      </g>

      {/* Small round table */}
      <g transform="translate(320 300)">
        <ellipse className="c-table" cx="0" cy="0" rx="62" ry="14" strokeWidth="4" />
        <path className="c-chair" d="M0 14 V86 M-26 90 H26" strokeWidth="5" strokeLinecap="round" />
        <circle className="c-table" cx="-20" cy="-8" r="9" strokeWidth="3" />
        <path className="f-lemon" d="M14 -6 a12 12 0 0 1 22 0 Z" />
      </g>

      {/* Two woven chairs, side view */}
      {[{ x: 170, flip: 1 }, { x: 470, flip: -1 }].map(({ x, flip }) => (
        <g key={x} transform={`translate(${x} 250) scale(${flip} 1)`}>
          <rect className="c-weave" x="-6" y="70" width="70" height="14" rx="3" />
          <path className="c-chair" d="M0 0 V150 M0 78 H64 V150 M8 10 L8 70 M0 20 H4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path className="c-chair" d="M4 34 H-2 M4 52 H-2" strokeWidth="3" />
          <path d="M8 74 h52 M8 80 h52" stroke="var(--chair)" strokeWidth="1.5" opacity=".5" />
        </g>
      ))}

      {/* Olive branch reaching over the wall */}
      <g transform="translate(-8 40) scale(1.25)"><OliveBranch /></g>
    </svg>
  );
}

/** An empty ceramic plate, for the 404 page. */
export function EmptyPlate({ className = '' }: { className?: string }) {
  return (
    <svg className={`block h-auto ${className}`} viewBox="-110 -110 220 220" aria-hidden="true" focusable="false">
      <ellipse className="plate-shadow" cx="8" cy="12" rx="96" ry="92" />
      <circle className="plate-body" r="96" strokeWidth="6" />
      <circle className="plate-ring" r="82" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
      <circle className="plate-ring" r="52" strokeWidth="1.5" opacity=".4" />
      <circle className="f-bread" cx="20" cy="-14" r="3" opacity=".7" />
      <circle className="f-bread" cx="-12" cy="24" r="2.4" opacity=".7" />
    </svg>
  );
}
