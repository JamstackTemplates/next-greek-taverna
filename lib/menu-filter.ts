import type { Diet, MenuItem, MenuSection } from '../content/menu';

/**
 * Filters offered on the menu page. Each narrows the menu; several together must all match.
 * They read the ingredient markers only and are never an allergy guarantee.
 */
export type DietFilter = 'vegetarian' | 'vegan' | 'gluten-free-ingredients' | 'dairy-free-ingredients' | 'no-nuts-in-recipe';

export const DIET_FILTERS: { id: DietFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free-ingredients', label: 'GF ingredients' },
  { id: 'dairy-free-ingredients', label: 'DF ingredients' },
  { id: 'no-nuts-in-recipe', label: 'No nuts in recipe' },
];

function has(item: MenuItem, diet: Diet): boolean {
  return item.diet?.includes(diet) ?? false;
}

/** Vegan items count as vegetarian and dairy-free even when not marked twice. */
export function matchesFilter(item: MenuItem, filter: DietFilter): boolean {
  switch (filter) {
    case 'vegan': return has(item, 'vegan');
    case 'vegetarian': return has(item, 'vegetarian') || has(item, 'vegan');
    case 'gluten-free-ingredients': return has(item, 'gluten-free-ingredients');
    case 'dairy-free-ingredients': return has(item, 'dairy-free-ingredients') || has(item, 'vegan');
    case 'no-nuts-in-recipe': return !has(item, 'contains-nuts');
  }
}

export function matchesAll(item: MenuItem, filters: readonly DietFilter[]): boolean {
  return filters.every(filter => matchesFilter(item, filter));
}

/** Space-separated filter ids an item satisfies, rendered as data-match on each menu row. */
export function matchList(item: MenuItem): string {
  return DIET_FILTERS.filter(filter => matchesFilter(item, filter.id)).map(filter => filter.id).join(' ');
}

/** Count of visible items per section for the active filters. */
export function visibleCounts(sections: readonly MenuSection[], filters: readonly DietFilter[]): Record<string, number> {
  return Object.fromEntries(sections.map(section => [section.id, section.items.filter(item => matchesAll(item, filters)).length]));
}
