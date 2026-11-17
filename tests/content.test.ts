// Content checks: each failure names the section, item, field or day to fix.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  allItems, ARTS, BADGES, DIETS, featuredItems, FOOD_COLORS, formatPrice, isAvailable, menu, shortPrice,
  startingPrice, type MenuItem,
} from '../content/menu.ts';
import { isHttpsUrl, publicLinks, taverna } from '../content/taverna.ts';
import { DIET_FILTERS, matchesAll, matchList, visibleCounts } from '../lib/menu-filter.ts';
import { footerNavigation, headerNavigation, RESERVED_IDS } from '../lib/navigation.ts';
import { validateHours } from '../lib/opening-hours.ts';

const URL_SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const root = new URL('../', import.meta.url);
const nonEmpty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

test('business details are complete', () => {
  for (const field of ['name', 'tagline', 'introduction', 'email'] as const) {
    assert.ok(nonEmpty(taverna[field]), `taverna.${field} must be a nonempty string`);
  }
  assert.ok(typeof taverna.phone === 'string', 'taverna.phone must be a string ("" hides it)');
  assert.ok(taverna.story.length > 0 && taverna.story.every(nonEmpty), 'taverna.story needs nonempty paragraphs');
  assert.match(taverna.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'taverna.email must be an email address');
  for (const field of ['street', 'locality', 'region', 'postalCode', 'country'] as const) {
    assert.ok(nonEmpty(taverna.address[field]), `taverna.address.${field} must be a nonempty string`);
  }
  assert.match(taverna.address.country, /^[A-Z]{2}$/, 'taverna.address.country must be an ISO code such as "US"');
  assert.ok(taverna.directions.every(nonEmpty), 'taverna.directions entries must be nonempty');
  assert.equal(typeof taverna.notice, 'string', 'taverna.notice must be a string ("" hides it)');
  for (const amenity of taverna.amenities) {
    assert.ok(['sharing', 'terrace', 'leaf'].includes(amenity.icon), `amenity "${amenity.id}" has unknown icon "${amenity.icon}"`);
    assert.ok(nonEmpty(amenity.title) && nonEmpty(amenity.detail), `amenity "${amenity.id}" needs a title and detail`);
  }
  for (const faq of taverna.faqs) {
    assert.ok(nonEmpty(faq.question) && nonEmpty(faq.answer), `FAQ "${faq.id}" needs a question and answer`);
  }
  for (const field of ['heading', 'introduction', 'confirmationNote'] as const) {
    assert.ok(nonEmpty(taverna.contact[field]), `taverna.contact.${field} must be a nonempty string`);
  }
  assert.ok(taverna.contact.usefulToInclude.length > 0 && taverna.contact.usefulToInclude.every(nonEmpty),
    'taverna.contact.usefulToInclude needs nonempty entries');
});

test('the six sample questions cover the visitor’s practical worries', () => {
  assert.equal(taverna.faqs.length, 6, 'the sample has six FAQs');
  const answers = taverna.faqs.map(faq => faq.answer).join(' ');
  assert.match(answers, /does not reserve a table/, 'an answer must say a message alone does not reserve a table');
  assert.match(answers, /does not place an order/, 'an answer must say a message does not place an order');
  assert.match(answers, /does not guarantee a dietary accommodation/, 'an answer must say a message does not guarantee dietary accommodation');
});

test('profile links are empty or HTTPS', () => {
  for (const link of taverna.links) {
    assert.ok(nonEmpty(link.label), 'every link needs a label');
    assert.ok(link.url.trim() === '' || isHttpsUrl(link.url), `link "${link.label}" must be empty or an https:// URL`);
  }
  assert.ok(publicLinks.every(link => isHttpsUrl(link.url)));
  assert.equal(isHttpsUrl('http://example.com'), false);
  assert.equal(isHttpsUrl('javascript:alert(1)'), false);
});

test('ids are URL-safe and unique across every rendered anchor', () => {
  const seen = new Map<string, string>(RESERVED_IDS.map(id => [id, 'a reserved page anchor']));
  const claim = (id: string, owner: string) => {
    assert.match(id, URL_SAFE_ID, `${owner} id "${id}" must be lowercase letters, numbers and hyphens`);
    assert.ok(!seen.has(id), `${owner} id "${id}" is already used by ${seen.get(id)}`);
    seen.set(id, owner);
  };
  for (const section of menu.sections) {
    claim(section.id, `section "${section.title}"`);
    for (const item of section.items) claim(item.id, `item "${item.name}"`);
  }
  for (const faq of taverna.faqs) claim(`faq-${faq.id}`, `FAQ "${faq.question}"`);
  for (const amenity of taverna.amenities) claim(amenity.id, `amenity "${amenity.title}"`);
});

test('the sample menu has five sections and 24 items', () => {
  // Sample fixture only: owners can add or remove sections and items freely.
  assert.equal(menu.sections.length, 5);
  assert.deepEqual(menu.sections.map(section => section.items.length), [7, 4, 5, 4, 4]);
  assert.equal(allItems.length, 24);
});

test('sections and items are complete', () => {
  assert.ok(menu.sections.length > 0, 'the menu needs at least one section');
  assert.match(menu.currency, /^[A-Z]{3}$/, 'menu.currency must be an ISO 4217 code such as "USD"');
  for (const section of menu.sections) {
    assert.ok(nonEmpty(section.title) && nonEmpty(section.description), `section "${section.id}" needs a title and description`);
    assert.ok(section.items.length > 0, `section "${section.id}" has no items`);
    for (const item of section.items) {
      assert.ok(nonEmpty(item.name), `item "${item.id}" needs a name`);
      assert.ok(nonEmpty(item.description), `item "${item.id}" needs a description`);
      assert.ok(ARTS.includes(item.art), `item "${item.id}" has unknown art "${item.art}"`);
      assert.ok(FOOD_COLORS.includes(item.color), `item "${item.id}" has unknown color "${item.color}"`);
      if (item.badge !== undefined) assert.ok(item.badge in BADGES, `item "${item.id}" has unknown badge "${item.badge}"`);
      if (item.serve !== undefined) assert.ok(['hot', 'iced', 'hot-or-iced'].includes(item.serve), `item "${item.id}" has unknown serve "${item.serve}"`);
      for (const diet of item.diet ?? []) assert.ok(diet in DIETS, `item "${item.id}" has unknown diet marker "${diet}"`);
      assert.equal(new Set(item.diet ?? []).size, (item.diet ?? []).length, `item "${item.id}" repeats a diet marker`);
      if (item.available !== undefined) assert.equal(typeof item.available, 'boolean', `item "${item.id}" available must be true or false`);
    }
  }
});

function validAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0 && Math.abs(Math.round(amount * 100) - amount * 100) < 1e-9;
}

test('prices are positive, finite and in cents; portions are labelled once', () => {
  for (const item of allItems) {
    if (typeof item.price === 'number') {
      assert.ok(validAmount(item.price), `item "${item.id}" price ${item.price} must be positive with at most two decimals`);
      continue;
    }
    assert.ok(item.price.length > 0, `item "${item.id}" has an empty price list`);
    const labels = item.price.map(size => size.label.trim());
    assert.ok(labels.every(label => label.length > 0), `item "${item.id}" has a portion without a label`);
    assert.equal(new Set(labels.map(label => label.toLowerCase())).size, labels.length, `item "${item.id}" repeats a portion label`);
    for (const size of item.price) {
      assert.ok(validAmount(size.amount), `item "${item.id}" portion "${size.label}" price ${size.amount} must be positive with at most two decimals`);
    }
  }
  for (const extra of menu.extras) {
    assert.ok(nonEmpty(extra.name), 'every extra needs a name');
    assert.ok(Number.isFinite(extra.price) && extra.price >= 0, `extra "${extra.name}" price must be zero or more`);
  }
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(9), '$9');
  assert.equal(formatPrice(9.5), '$9.50');
  assert.equal(formatPrice(0), 'Free');
  const tzatziki = allItems.find(item => item.id === 'tzatziki')!;
  assert.equal(startingPrice(tzatziki), 8);
  assert.equal(shortPrice(tzatziki), 'from $8');
});

test('the sample includes portions, wine by glass and bottle, and two non-alcoholic drinks', () => {
  const foodWithPortions = allItems.filter(item => item.art !== 'glass' && item.art !== 'cup' && Array.isArray(item.price));
  assert.ok(foodWithPortions.length >= 2, 'at least two foods need labelled portions');
  for (const id of ['house-white-wine', 'house-red-wine']) {
    const wine = allItems.find(item => item.id === id)!;
    assert.deepEqual(Array.isArray(wine.price) && wine.price.map(size => size.label), ['Glass', 'Bottle'], `${id} needs glass and bottle prices`);
  }
  const drinks = menu.sections.find(section => section.id === 'drinks')!;
  assert.ok(drinks.items.filter(item => !/wine/i.test(item.name)).length >= 2, 'drinks need two non-alcoholic choices');
  assert.ok(menu.notes.some(note => /21 and over/.test(note) && /ID/.test(note)), 'menu.notes needs the 21+ with ID alcohol note');
});

test('exactly four distinct featured dishes lay the shared table', () => {
  assert.equal(featuredItems.length, 4, `mark exactly four items featured: true (found ${featuredItems.map(item => item.id).join(', ') || 'none'})`);
  assert.equal(new Set(featuredItems.map(item => item.id)).size, 4, 'featured dishes must be distinct');
  assert.deepEqual(featuredItems.map(item => item.id), ['tzatziki', 'horiatiki', 'lemon-potatoes', 'chicken-souvlaki']);
  for (const item of featuredItems) assert.ok(allItems.includes(item), `featured "${item.id}" must be a menu item`);
});

test('availability is read the same way by menu rows and the shared table', () => {
  assert.equal(isAvailable(allItems.find(item => item.id === 'spanakopita')!), false, 'the sample marks spanakopita unavailable');
  assert.equal(allItems.find(item => item.id === 'baklava')!.badge, 'seasonal', 'the sample marks baklava seasonal');
  // Toggling a featured dish off keeps it (and its anchor) on the table, marked unavailable, never swapped.
  const featured: MenuItem = { ...featuredItems[0], available: false };
  assert.equal(isAvailable(featured), false);
  assert.equal(featured.id, featuredItems[0].id);
  assert.ok(featuredItems.every(item => isAvailable(item)), 'the sample’s featured dishes are available');
});

test('dietary markers are careful and consistent', () => {
  const animal = /\b(yoghurt|feta|cheese|honey|butter|milk|cream|custard|egg|chicken|lamb|beef|pork|fish|bream|anchov|tzatziki)/i;
  const nuts = /\b(walnut|pistachio|almond|hazelnut|pine nut|peanut)/i;
  for (const item of allItems) {
    const diet = item.diet ?? [];
    const text = `${item.name} ${item.description}`;
    if (diet.includes('vegan')) assert.doesNotMatch(text, animal, `item "${item.id}" is marked vegan but mentions an animal ingredient`);
    if (diet.includes('vegetarian')) assert.doesNotMatch(text, /\b(chicken|lamb|beef|pork|fish|bream|anchov)/i, `item "${item.id}" is marked vegetarian but mentions meat or fish`);
    if (diet.includes('vegan') && diet.includes('vegetarian')) assert.fail(`item "${item.id}": use vegan alone (it implies vegetarian)`);
    if (nuts.test(text)) assert.ok(diet.includes('contains-nuts'), `item "${item.id}" mentions nuts but is not marked contains-nuts`);
  }
  assert.match(DIETS['gluten-free-ingredients'].label, /ingredients/);
  assert.ok(menu.notes.some(note => /cross-contact/i.test(note)), 'menu.notes needs a visible kitchen cross-contact note');
});

test('diet filters show matching items and never hide every section silently', () => {
  assert.ok(DIET_FILTERS.length > 0);
  const vegan = allItems.filter(item => matchesAll(item, ['vegan']));
  assert.ok(vegan.length > 0 && vegan.every(item => item.diet?.includes('vegan')));
  assert.ok(matchList(allItems.find(item => item.id === 'hummus')!).split(' ').includes('vegetarian'), 'vegan counts as vegetarian');
  assert.equal(matchList(allItems.find(item => item.id === 'baklava')!).includes('no-nuts-in-recipe'), false);
  const counts = visibleCounts(menu.sections, ['vegan']);
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), vegan.length);
});

test('opening hours list every weekday once with valid same-day times', () => {
  assert.deepEqual(validateHours(taverna.hours), []);
});

test('the terrace is editorial copy and its switch removes every terrace link', () => {
  const { terrace } = taverna;
  assert.deepEqual(Object.keys(terrace).sort(),
    ['description', 'enabled', 'enquiryNote', 'seasonNote', 'seatingNote', 'title', 'weatherNote'],
    'taverna.terrace holds copy and one switch only: no live capacity, weather or availability fields');
  for (const field of ['title', 'description', 'seasonNote', 'seatingNote', 'weatherNote', 'enquiryNote'] as const) {
    assert.ok(nonEmpty(terrace[field]), `taverna.terrace.${field} must be a nonempty string`);
  }
  assert.equal(typeof terrace.enabled, 'boolean');
  assert.deepEqual(headerNavigation(true).map(item => item.label), ['Menu', 'Terrace', 'Contact']);
  assert.deepEqual(headerNavigation(false).map(item => item.label), ['Menu', 'Contact']);
  for (const items of [headerNavigation(false), footerNavigation(false)]) {
    assert.ok(items.every(item => !item.href.includes('terrace')), 'no terrace link may remain when the terrace is disabled');
  }
  // Pages only link to #terrace through the navigation helpers or inside the terrace section itself.
  for (const file of sourceFiles()) {
    const text = readFileSync(file, 'utf8');
    if (/#terrace/.test(text)) assert.match(file, /lib[\\/]navigation\.ts$/, `${file} links to #terrace directly; use lib/navigation.ts so the terrace switch removes it`);
  }
});

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(tsx?|mjs)$/.test(name)) out.push(path);
    }
  };
  for (const dir of ['app', 'components', 'lib']) walk(new URL(dir, root).pathname);
  return out;
}

test('the business name lives in content and site.config.json only', () => {
  const config = JSON.parse(readFileSync(new URL('site.config.json', root), 'utf8'));
  assert.equal(config.name, taverna.name, 'site.config.json "name" and taverna.name should match');
  for (const file of sourceFiles()) {
    // lib/config.mjs and lib/site.ts keep a fallback used only when site.config.json has no name.
    if (/lib[\\/](config\.mjs|site\.ts)$/.test(file)) continue;
    assert.ok(!readFileSync(file, 'utf8').includes(taverna.name), `${file} hard-codes "${taverna.name}"; read taverna.name instead`);
  }
});
