import type { ReactNode } from 'react';
import type { Art } from '../content/menu';
import type { Amenity } from '../content/taverna';

type IconProps = { className?: string };

/** Line icons for the "How we share" points (Amenity.icon). Decorative. */
export function AmenityIcon({ name, className = 'size-9' }: { name: Amenity['icon'] } & IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {name === 'sharing' ? (
        <g className="glyph">
          <circle cx="20" cy="20" r="15" />
          <circle cx="13" cy="15" r="4" /><circle cx="27" cy="15" r="4" /><circle cx="13" cy="26" r="4" /><circle cx="27" cy="26" r="4" />
        </g>
      ) : name === 'terrace' ? (
        <g className="glyph">
          <path d="M4 14 H36 M6 14 V36 M34 14 V36" />
          <path d="M12 24 V35 M12 28 H21 V35 M14 18 V28" />
          <path d="M26 30 H34 M30 30 V36" />
        </g>
      ) : (
        <g className="glyph">
          <path d="M8 32 C10 16 20 8 33 7 C33 20 25 30 8 32 Z" />
          <path d="M8 32 L24 16" />
        </g>
      )}
    </svg>
  );
}

/** Small serving-dish glyph beside each menu section heading, from the section's first item. */
export function DishGlyph({ art, className = 'size-8' }: { art: Art } & IconProps) {
  const shapes: Record<Art, ReactNode> = {
    dip: <><ellipse cx="20" cy="24" rx="15" ry="7" /><path d="M5 24 C7 33 33 33 35 24" /><path d="M14 22 C18 19 24 19 26 22" /></>,
    salad: <><path d="M5 22 H35 C34 31 27 35 20 35 C13 35 6 31 5 22 Z" /><path d="M11 21 C11 14 17 12 19 17 M21 21 C21 12 30 12 29 20" /></>,
    skewer: <><path d="M6 34 L34 6" /><rect x="11" y="21" width="8" height="8" rx="2" transform="rotate(-45 15 25)" /><rect x="19" y="13" width="8" height="8" rx="2" transform="rotate(-45 23 17)" /></>,
    fish: <><path d="M5 20 C12 11 24 11 29 19 L36 13 V27 L29 21 C24 29 12 29 5 20 Z" /><circle cx="11" cy="19" r=".8" className="glyph-fill" /></>,
    pastry: <><path d="M20 6 L34 20 L20 34 L6 20 Z" /><path d="M13 20 H27 M16 15 H24 M16 25 H24" /></>,
    yoghurt: <><path d="M6 18 H34 C33 29 27 34 20 34 C13 34 7 29 6 18 Z" /><path d="M11 18 C14 12 26 12 29 18" /></>,
    glass: <><path d="M12 5 H28 C28 16 24 21 20 21 C16 21 12 16 12 5 Z" /><path d="M20 21 V34 M13 35 H27" /></>,
    cup: <><path d="M8 14 H28 V24 C28 30 24 33 18 33 C12 33 8 30 8 24 Z" /><path d="M28 17 C34 17 34 25 28 25 M14 6 C12 9 16 10 14 12 M20 6 C18 9 22 10 20 12" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g className="glyph">{shapes[art]}</g>
    </svg>
  );
}

/** The single ceramic brushstroke divider. */
export function Brushstroke({ className = '' }: { className?: string }) {
  return (
    <svg className={`brushstroke ${className}`} viewBox="0 0 240 18" aria-hidden="true" focusable="false">
      <path d="M2 10 C30 4 62 5 96 7 C132 9 170 3 206 5 C222 6 232 7 238 9 C230 13 214 14 196 13 C160 11 128 15 92 14 C60 13 30 15 6 14 C2 13 1 11 2 10 Z" />
    </svg>
  );
}

/** Small arrow for "Get directions" style links. */
export function ArrowIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3 8 H12 M8.5 4.5 L12 8 L8.5 11.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
