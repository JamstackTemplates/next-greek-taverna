import type { Metadata } from 'next';
import { MenuFilters } from '../../components/menu-filters';
import { MenuSheet } from '../../components/menu-sheet';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { formatPrice, menu } from '../../content/menu';
import { taverna } from '../../content/taverna';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Meze, salads, the grill, sweets and drinks at ${taverna.name}, with prices and dietary markers.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  const [legend, ...notes] = menu.notes;
  return (
    <>
      <PageHead kicker="The menu" title="Plates for the middle of the table">
        <p>Order a few things to share, then a few more. Plates come out as they’re ready, and everything on the menu is in the HTML below, prices included.</p>
      </PageHead>

      <div className="wrap">
        <nav id="menu-shortcuts" aria-label="Menu sections" className="print-hide">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-y border-rule py-3 font-display text-[1.1rem] font-semibold">
            {menu.sections.map(section => (
              <li key={section.id}><a className="text-link" href={`#${section.id}`}>{section.title}</a></li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-[.95rem] text-muted">{legend}</p>
        <MenuFilters />
      </div>

      <div className="wrap mt-10">
        <MenuSheet />
      </div>

      <div className="wrap grid gap-x-14 gap-y-8 pt-4 lg:grid-cols-2">
        <section id="extras" aria-labelledby="extras-title">
          <hr className="ceramic-rule" />
          <h2 id="extras-title" className="mt-4 text-[1.6rem]">Extras</h2>
          <ul className="mt-2">
            {menu.extras.map(extra => (
              <li key={extra.name} className="flex items-baseline gap-2 border-b border-rule py-2.5">
                <span>{extra.name}</span><span className="leader" aria-hidden="true" />
                <span className="font-semibold figures">{formatPrice(extra.price)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section id="menu-notes" aria-labelledby="menu-notes-title">
          <hr className="ceramic-rule" />
          <h2 id="menu-notes-title" className="mt-4 text-[1.6rem]">Good to know</h2>
          <ul className="mt-2 grid gap-2.5 text-[.97rem] text-muted">
            {notes.map(note => <li key={note} className="border-b border-rule pb-2.5">{note}</li>)}
          </ul>
          <p className="mt-5">
            Coming as a group or celebrating? <SiteLink href="/contact/" className="text-link">Enquire about a table</SiteLink>.
          </p>
        </section>
      </div>
    </>
  );
}
