'use client';

import { useEffect, useState } from 'react';
import { allItems, menu } from '../content/menu';
import { DIET_FILTERS, matchesAll, visibleCounts, type DietFilter } from '../lib/menu-filter';

/**
 * Optional dietary filters for the printed menu (progressive enhancement). The toolbar is in the
 * static HTML so the page doesn't shift when it hydrates (anchors land in the right place);
 * `@media (scripting: none)` hides it without JavaScript, when every row stays visible. With
 * JavaScript, the active filters are written to
 * #menu-sheet's data-filters attribute and CSS hides rows that don't match; sections with nothing
 * left show their empty note. Filters read ingredient markers only: they are not allergy advice.
 */
export function MenuFilters() {
  const [active, setActive] = useState<DietFilter[]>([]);

  useEffect(() => {
    const sheet = document.getElementById('menu-sheet');
    if (!sheet) return;
    if (active.length) sheet.dataset.filters = active.join(' ');
    else delete sheet.dataset.filters;
    const counts = visibleCounts(menu.sections, active);
    for (const section of menu.sections) {
      const element = document.getElementById(section.id);
      if (element) element.dataset.empty = String(counts[section.id] === 0);
    }
  }, [active]);

  const shown = allItems.filter(item => matchesAll(item, active)).length;
  const toggle = (id: DietFilter) => setActive(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);

  return (
    <div id="menu-filters" role="group" aria-labelledby="menu-filters-title" className="menu-filters print-hide mt-6 border-t border-rule pt-5">
      <p id="menu-filters-title" className="text-[.95rem] font-semibold">Show dishes that are…</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {DIET_FILTERS.map(filter => (
          <button key={filter.id} type="button" className="filter-toggle" aria-pressed={active.includes(filter.id)} onClick={() => toggle(filter.id)}>
            {filter.label}
          </button>
        ))}
        {active.length ? (
          <button type="button" className="text-link ml-1 cursor-pointer border-0 bg-transparent p-1 text-[.95rem]" onClick={() => setActive([])}>Reset filters</button>
        ) : null}
      </div>
      <p className="mt-2.5 text-[.9rem] text-muted" role="status" aria-live="polite">
        {!active.length ? `Showing all ${allItems.length} dishes and drinks. Filters read the ingredient markers and are not an allergy guarantee.`
          : shown === 0 ? 'Nothing on the menu matches all of these. Try removing a filter, or ask us when you visit.'
          : `Showing ${shown} of ${allItems.length}. Markers describe ingredients, not cross-contact.`}
      </p>
    </div>
  );
}
