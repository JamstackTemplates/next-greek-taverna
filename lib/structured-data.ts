import { menu } from '../content/menu';
import { isHttpsUrl, taverna } from '../content/taverna';
import { isOpenDay } from './opening-hours';
import { absoluteUrl } from './paths';

/**
 * schema.org Restaurant for search engines and maps, built from the same content as the pages.
 * Empty fields and closed days are omitted. No coordinates, ratings, price claims or booking actions
 * are invented.
 */
export function restaurantStructuredData() {
  const url = absoluteUrl('/');
  const { address } = taverna;
  const postalAddress = Object.fromEntries(Object.entries({
    '@type': 'PostalAddress',
    streetAddress: address.street,
    addressLocality: address.locality,
    addressRegion: address.region,
    postalCode: address.postalCode,
    addressCountry: address.country,
  }).filter(([, value]) => value.trim() !== ''));
  const sameAs = taverna.links.filter(link => isHttpsUrl(link.url)).map(link => link.url.trim());

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: taverna.name,
    description: taverna.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    ...(taverna.email ? { email: taverna.email } : {}),
    ...(taverna.phone ? { telephone: taverna.phone } : {}),
    servesCuisine: ['Greek', 'Mediterranean'],
    currenciesAccepted: menu.currency,
    address: postalAddress,
    openingHoursSpecification: taverna.hours.filter(isOpenDay).map(entry => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: entry.opens,
      closes: entry.closes,
    })),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
