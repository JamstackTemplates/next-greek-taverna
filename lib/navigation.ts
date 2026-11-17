// Site navigation, in one place so the terrace switch (taverna.terrace.enabled) removes every
// terrace link at once and never leaves a link to a missing #terrace anchor.

export interface NavItem {
  /** Site route or in-page anchor, without the base path. */
  href: string;
  /** Visible label. */
  label: string;
}

/** Header: Menu · Terrace · Contact (two items when the terrace is switched off). */
export function headerNavigation(terraceEnabled: boolean): NavItem[] {
  return [
    { href: '/menu/', label: 'Menu' },
    ...(terraceEnabled ? [{ href: '/#terrace', label: 'Terrace' }] : []),
    { href: '/contact/', label: 'Contact' },
  ];
}

/** Footer links. */
export function footerNavigation(terraceEnabled: boolean): NavItem[] {
  return [
    { href: '/menu/', label: 'Menu' },
    { href: '/#find-us', label: 'Find us' },
    ...(terraceEnabled ? [{ href: '/#terrace', label: 'Terrace' }] : []),
    { href: '/#before-you-come', label: 'FAQs' },
    { href: '/contact/', label: 'Enquiries' },
  ];
}

/** In-page anchors used by the home and menu pages; content ids must not reuse them. */
export const RESERVED_IDS = [
  'main', 'welcome', 'find-us', 'hours', 'terrace', 'how-we-share', 'kitchen', 'before-you-come',
  'enquire', 'shared-table', 'menu-sheet', 'menu-shortcuts', 'menu-filters', 'extras', 'menu-notes',
] as const;
