// Taverna details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious taverna, Blue Quince. The sample address is
// a public landmark (Washington Square Park, New York) used only so the map has something to show;
// no restaurant operates there. Replace it with your own address.
// Plain strings only: text is rendered as text, never as HTML.

import type { OpeningHours } from '../lib/opening-hours';

export type { Day, OpeningHours } from '../lib/opening-hours';

export interface Address {
  /** Street line, e.g. "112 Example Street". */
  street: string;
  /** Town or city, e.g. "New York". */
  locality: string;
  /** State, county or region, e.g. "NY". */
  region: string;
  /** Postal or ZIP code, e.g. "10012". */
  postalCode: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "US". */
  country: string;
  /** Optional landmark or cross streets shown under the address. Leave out or '' to hide it. */
  note?: string;
}

export interface Amenity {
  /** Unique, URL-safe id, e.g. "outdoor-tables". */
  id: string;
  /** Small drawing shown beside the amenity (components/icons.tsx). */
  icon: 'sharing' | 'terrace' | 'leaf';
  /** Short heading, e.g. "Plates for the middle". */
  title: string;
  /** One sentence of detail. */
  detail: string;
}

export interface Faq {
  /** Unique, URL-safe id, also the anchor /#faq-<id>. */
  id: string;
  /** The visitor's question, in their words. */
  question: string;
  /** A plain, honest answer. */
  answer: string;
}

export interface ProfileLink {
  /** Visible label, e.g. "Instagram". */
  label: string;
  /** Absolute https:// URL. Entries with an empty or non-HTTPS URL are not rendered. */
  url: string;
}

export interface Terrace {
  /** Section heading on the home page, e.g. "Summer courtyard". */
  title: string;
  /** One or two sentences describing the outdoor tables. */
  description: string;
  /** When the terrace is used, as editorial copy, e.g. "Summer evenings, weather permitting." */
  seasonNote: string;
  /** Seating guidance, e.g. "Outdoor tables are limited." */
  seatingNote: string;
  /** Weather caveat, e.g. "Plans can change with the weather." */
  weatherNote: string;
  /** How to ask about it; seating is confirmed only by a reply. */
  enquiryNote: string;
  /**
   * Show the terrace section, the header's Terrace link and other terrace links. Set to false
   * when you have no outdoor tables; the header then has two items. Never derived from dates or weather.
   */
  enabled: boolean;
}

export interface ContactCopy {
  /** Contact page heading. */
  heading: string;
  /** The paragraph under the heading. */
  introduction: string;
  /** "Useful to include" checklist beside the form. */
  usefulToInclude: string[];
  /** Reminder that a message is an enquiry until you reply. */
  confirmationNote: string;
}

export interface Taverna {
  /** Business name. Also `name` in site.config.json: renaming is those two lines. */
  name: string;
  /** Short descriptor under the name, e.g. "Greek taverna". */
  tagline: string;
  /** One sentence: the first thing visitors read under the headline. */
  introduction: string;
  /** "A little about the kitchen" paragraphs. Two short ones work best. */
  story: string[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(212) 555-0146". Set to '' to hide calling links. */
  phone: string;
  /** Postal address used by Find us, the map, directions links and structured data. */
  address: Address;
  /** How to find you: walking routes, transit, landmarks. */
  directions: string[];
  /** Seven entries, Monday to Sunday, in the time zone set by `timeZone` in site.config.json. */
  hours: OpeningHours[];
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  /** Short "how we share" points on the home page. */
  amenities: Amenity[];
  /** "Before you come" questions on the home page. */
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: ProfileLink[];
  /** The seasonal courtyard: all terrace copy in one place. */
  terrace: Terrace;
  /** All enquiry copy on the Contact page. */
  contact: ContactCopy;
}

export const taverna: Taverna = {
  name: 'Blue Quince',
  tagline: 'Greek taverna',
  introduction:
    'A neighbourhood Greek taverna for meze, the charcoal grill and long evenings, where plates go in the middle and everyone reaches in.',
  story: [
    'The menu is built for sharing: cold meze to start, salads and vegetables alongside, then whatever comes off the grill, passed around until the plates are clean.',
    'We cook with plenty of olive oil, lemon and oregano, bake our pita through the evening and keep the drinks simple, so the table can stay a while.',
  ],
  email: 'hello@example.com',
  phone: '(212) 555-0146',
  address: {
    street: 'Washington Square Park, Washington Square',
    locality: 'New York',
    region: 'NY',
    postalCode: '10012',
    country: 'US',
    note: 'Sample location: a public landmark used only to show the map. Replace it with your own address.',
  },
  directions: [
    'Sample directions: the park is a short walk from West 4 St–Washington Sq station (A, B, C, D, E, F and M trains).',
    'From 8 St–NYU station (R and W trains), walk west along 8th Street to the park.',
    'Replace these lines with your own entrance, step-free access and nearby transit details.',
  ],
  hours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '17:00', closes: '22:00' },
    { day: 'Wednesday', opens: '17:00', closes: '22:00' },
    { day: 'Thursday', opens: '17:00', closes: '22:00' },
    { day: 'Friday', opens: '17:00', closes: '23:00' },
    { day: 'Saturday', opens: '12:00', closes: '23:00' },
    { day: 'Sunday', opens: '12:00', closes: '21:00' },
  ],
  notice: '',
  amenities: [
    { id: 'plates-for-the-middle', icon: 'sharing', title: 'Plates for the middle', detail: 'Order a few meze and a salad, then add from the grill as you go.' },
    { id: 'outdoor-tables', icon: 'terrace', title: 'Outdoor tables in summer', detail: 'A small courtyard on warm evenings, weather permitting.' },
    { id: 'vegetable-choices', icon: 'leaf', title: 'Plenty without meat', detail: 'Dips, beans, salads and vegetable skewers are marked on the menu.' },
  ],
  faqs: [
    {
      id: 'reservations',
      question: 'Do you take reservations, or can we walk in?',
      answer: 'Walk-ins are welcome when there is room. To ask about a particular date, send an enquiry with the time and party size. A message alone does not reserve a table; it is confirmed only when we reply.',
    },
    {
      id: 'terrace',
      question: 'Can we sit outside?',
      answer: 'On summer evenings we set out a few courtyard tables, weather permitting. Mention the terrace in your enquiry and we will tell you what we can do; outdoor seating is never guaranteed.',
    },
    {
      id: 'celebrations',
      question: 'Can you host a birthday or a larger group?',
      answer: 'Often, yes. Tell us the date, roughly how many people and the occasion, and we will reply with what is possible. Larger tables usually share a selection of meze and grill plates.',
    },
    {
      id: 'vegetarian',
      question: 'Is there enough for vegetarians?',
      answer: 'Yes. Most meze, the salads, the beans, the potatoes and the vegetable skewers are vegetarian, and several are vegan. Use the filters on the menu page to see them.',
    },
    {
      id: 'allergies',
      question: 'Can you cater for allergies?',
      answer: 'Menu markers describe each recipe’s ingredients, but our kitchen handles gluten, dairy, nuts, sesame, eggs and fish in shared spaces, so we cannot guarantee any dish is free of an allergen. Please tell us about allergies when you arrive and in any enquiry; a message does not guarantee a dietary accommodation.',
    },
    {
      id: 'enquiries-and-takeaway',
      question: 'How do we enquire, or ask about takeaway?',
      answer: 'Use the enquiry page or email us, and call for anything time-sensitive. We do not take orders or payments through the website; sending a message does not place an order.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty or non-HTTPS URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
  terrace: {
    title: 'Summer courtyard',
    description: 'A handful of tables set out against the courtyard wall, for meze in the open air while the evening cools.',
    seasonNote: 'Summer evenings, weather permitting.',
    seatingNote: 'Outdoor tables are limited.',
    weatherNote: 'Plans can change with the weather.',
    enquiryNote: 'Ask about the terrace in your message; seating is confirmed only when we reply.',
    enabled: true,
  },
  contact: {
    heading: 'Reservation & celebration enquiries',
    introduction: 'Tell us about the table you have in mind. A reservation is confirmed only when we reply.',
    usefulToInclude: [
      'Your preferred date and time, and how flexible you are',
      'How many people are coming',
      'A terrace preference or the occasion you are celebrating',
      'Any dietary or access questions',
    ],
    confirmationNote: 'Sending a message does not reserve a table, place an order or guarantee a dietary accommodation. We reply to every enquiry to confirm what we can do.',
  },
};

/** Profile links with a valid https:// URL. */
export const publicLinks: ProfileLink[] = taverna.links.filter(link => isHttpsUrl(link.url));

/** True for an absolute https:// URL with a host. */
export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}

/** Single-line postal address, used for the map and directions. */
export function formatAddress(address: Address = taverna.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** "tel:" href for the public phone number, or '' when there is none. */
export function telHref(phone: string = taverna.phone): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
}
