import { BADGES, DIETS, formatPrice, isAvailable, menu, type MenuItem } from '../content/menu';
import { matchList } from '../lib/menu-filter';
import { DishGlyph } from './icons';

const SERVE = { hot: 'Served hot', iced: 'Served over ice', 'hot-or-iced': 'Hot or iced' } as const;

function Price({ item }: { item: MenuItem }) {
  if (!isAvailable(item)) return <span className="font-semibold whitespace-nowrap text-ink">Not available</span>;
  if (typeof item.price === 'number') return <span className="font-semibold figures">{formatPrice(item.price)}</span>;
  return (
    <span className="text-right font-semibold figures">
      {item.price.map((size, i) => (
        <span key={size.label} className="whitespace-nowrap">
          {i ? <span className="px-1.5 text-muted" aria-hidden="true">·</span> : null}
          <span className="font-normal text-muted">{size.label}</span> {formatPrice(size.amount)}
        </span>
      ))}
    </span>
  );
}

function Row({ item }: { item: MenuItem }) {
  const available = isAvailable(item);
  return (
    <li id={item.id} className="menu-row break-inside-avoid border-b border-rule py-3.5"
      data-match={matchList(item)} data-available={String(available)}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3 className="menu-row__name font-display text-[1.18rem] font-semibold">{item.name}</h3>
        <span className="leader max-sm:hidden" aria-hidden="true" />
        <span className="max-sm:basis-full"><Price item={item} /></span>
      </div>
      <p className="mt-0.5 text-[.97rem] text-muted">{item.description}</p>
      {(item.diet?.length || item.badge || item.serve || !available) ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[.85rem]">
          {item.diet?.map(diet => <abbr key={diet} className="tag-diet" title={DIETS[diet].label}>{DIETS[diet].short}</abbr>)}
          {item.badge ? <em className="font-display text-olive">{BADGES[item.badge]}</em> : null}
          {item.serve ? <span className="text-muted">{SERVE[item.serve]}</span> : null}
          {!available ? <span className="text-muted">Still on the menu; ask us when it’s back.</span> : null}
        </p>
      ) : null}
    </li>
  );
}

/**
 * The printed menu: sections in menu order under cobalt ceramic rules, set in two text columns on
 * desktop and one on phones. Every row is in the static HTML with its own anchor (/menu/#tzatziki).
 */
export function MenuSheet() {
  return (
    <div id="menu-sheet" className="gap-x-14 lg:columns-2">
      {menu.sections.map(section => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}
          className="menu-section mb-10">
          <div className="break-inside-avoid break-after-avoid">
            <hr className="ceramic-rule" />
            <div className="mt-4 flex items-center gap-3">
              <DishGlyph art={section.items[0]?.art ?? 'dip'} className="size-9 flex-none" />
              <h2 id={`${section.id}-title`} className="text-[clamp(1.7rem,3vw,2.15rem)]">{section.title}</h2>
            </div>
            <p className="mt-1.5 text-[.98rem] text-muted italic">{section.description}</p>
          </div>
          <p className="section-empty mt-3 text-[.95rem] text-muted">Nothing in {section.title} matches these filters.</p>
          <ul className="mt-1">
            {section.items.map(item => <Row key={item.id} item={item} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
