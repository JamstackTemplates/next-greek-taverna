// The taverna menu. Add, remove, reorder or reprice items here; every page reads from this file.
// The edits you'll make most: `price`, `available` (false = "Not available") and `badge`.
// Dishes and prices are sample content — replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.

/**
 * Dietary markers. They describe a recipe's ingredients, not an allergen-free kitchen:
 * "gluten-free-ingredients" means no gluten in the recipe, prepared in a kitchen that handles gluten.
 */
export type Diet = 'vegan' | 'vegetarian' | 'gluten-free-ingredients' | 'dairy-free-ingredients' | 'contains-nuts';

/** Label and abbreviation for each marker, shown on the menu and in its legend. */
export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegan: { label: 'Vegan', short: 'VG' },
  vegetarian: { label: 'Vegetarian', short: 'V' },
  'gluten-free-ingredients': { label: 'Made with gluten-free ingredients', short: 'GF' },
  'dairy-free-ingredients': { label: 'Made with dairy-free ingredients', short: 'DF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

/** Food silhouette drawn on a plate (components/plate-art.tsx). */
export type Art = 'dip' | 'salad' | 'skewer' | 'fish' | 'pastry' | 'yoghurt' | 'glass' | 'cup';

export const ARTS: readonly Art[] = ['dip', 'salad', 'skewer', 'fish', 'pastry', 'yoghurt', 'glass', 'cup'];

/**
 * Main colour of the drawing, as a template colour token (`--food-<name>` in app/tailwind.input.css),
 * never a raw CSS colour. The tokens change with light and dark mode.
 */
export type FoodColor = 'olive' | 'lemon' | 'tomato' | 'aubergine' | 'honey' | 'ceramic';

export const FOOD_COLORS: readonly FoodColor[] = ['olive', 'lemon', 'tomato', 'aubergine', 'honey', 'ceramic'];

/** Optional highlight, edited by hand. Never read as "today's special". */
export type Badge = 'signature' | 'seasonal' | 'new';

export const BADGES: Record<Badge, string> = { signature: 'House favourite', seasonal: 'Seasonal', new: 'New' };

export interface SizePrice {
  /** Portion or measure, e.g. "Small", "For the table", "Glass", "Bottle". Unique within the item. */
  label: string;
  /** Price in `menu.currency`, e.g. 14 for $14 or 9.5 for $9.50. */
  amount: number;
}

export interface MenuItem {
  /** Unique, URL-safe id (lowercase, hyphens) used for links such as /menu/#tzatziki. */
  id: string;
  /** Dish name as guests know it, e.g. "Horiatiki". */
  name: string;
  /** Short plain-English description of what is on the plate. */
  description: string;
  /** One price, or a price per portion. Amounts are in `menu.currency`. */
  price: number | SizePrice[];
  /** Ingredient markers; see `Diet`. */
  diet?: Diet[];
  /** Optional highlight shown beside the name. */
  badge?: Badge;
  /** For drinks only, when useful: how it is served. */
  serve?: 'hot' | 'iced' | 'hot-or-iced';
  /** Silhouette drawn on the plate when this item is featured on the shared table. */
  art: Art;
  /** Colour token for the drawing. */
  color: FoodColor;
  /** Set to false to show "Not available" without deleting the item. Defaults to true. */
  available?: boolean;
  /** One of exactly four dishes laid on the home page's shared table. */
  featured?: boolean;
}

export interface MenuSection {
  /** Unique, URL-safe id used for links such as /menu/#meze. */
  id: string;
  /** Section heading, e.g. "Meze". */
  title: string;
  /** Short line shown under the heading. */
  description: string;
  /** Items in the order they appear. */
  items: MenuItem[];
}

export interface Menu {
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  /** Sections in menu order. */
  sections: MenuSection[];
  /** Small additions with an explicit price, such as extra pita. */
  extras: { /** What is added. */ name: string; /** Price in `currency`; 0 shows "Free". */ price: number }[];
  /** Small print under the menu: legend, sharing guidance, cross-contact and alcohol notes. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  sections: [
    {
      id: 'meze',
      title: 'Meze',
      description: 'Cold and warm small plates to start the table. Most come with warm pita.',
      items: [
        {
          id: 'tzatziki',
          name: 'Tzatziki',
          description: 'Strained yoghurt with grated cucumber, garlic and dill, with warm pita.',
          price: [{ label: 'Small', amount: 8 }, { label: 'For the table', amount: 14 }],
          diet: ['vegetarian'],
          badge: 'signature',
          art: 'dip',
          color: 'ceramic',
          featured: true,
        },
        {
          id: 'hummus',
          name: 'Hummus',
          description: 'Chickpeas, tahini and lemon, finished with olive oil and paprika, with warm pita.',
          price: 9,
          diet: ['vegan'],
          art: 'dip',
          color: 'honey',
        },
        {
          id: 'melitzanosalata',
          name: 'Melitzanosalata',
          description: 'Smoky charred aubergine with garlic, parsley, red wine vinegar and olive oil.',
          price: 10,
          diet: ['vegan', 'gluten-free-ingredients'],
          art: 'dip',
          color: 'aubergine',
        },
        {
          id: 'whipped-feta',
          name: 'Whipped feta',
          description: 'Feta whipped with roasted red pepper and chilli flakes, with cucumber to scoop.',
          price: 11,
          diet: ['vegetarian', 'gluten-free-ingredients'],
          art: 'dip',
          color: 'tomato',
        },
        {
          id: 'dolmades',
          name: 'Dolmades',
          description: 'Vine leaves rolled around rice, herbs and lemon, served cool.',
          price: [{ label: 'Four', amount: 9 }, { label: 'Eight', amount: 16 }],
          diet: ['vegan', 'gluten-free-ingredients'],
          art: 'salad',
          color: 'olive',
        },
        {
          id: 'spanakopita',
          name: 'Spanakopita',
          description: 'Spinach, feta, spring onion and dill baked in crisp filo.',
          price: 12,
          diet: ['vegetarian'],
          art: 'pastry',
          color: 'olive',
          available: false,
        },
        {
          id: 'pita-and-olives',
          name: 'Pita & olives',
          description: 'Warm pita, marinated olives and a little dish of oregano oil.',
          price: 7,
          diet: ['vegan'],
          art: 'dip',
          color: 'olive',
        },
      ],
    },
    {
      id: 'salads-and-vegetables',
      title: 'Salads & vegetables',
      description: 'For the middle of the table, alongside everything else.',
      items: [
        {
          id: 'horiatiki',
          name: 'Horiatiki',
          description: 'Village salad of tomato, cucumber, red onion, green pepper and olives, under a slab of feta and oregano.',
          price: [{ label: 'For one', amount: 13 }, { label: 'For the table', amount: 21 }],
          diet: ['vegetarian', 'gluten-free-ingredients'],
          art: 'salad',
          color: 'tomato',
          featured: true,
        },
        {
          id: 'lemon-potatoes',
          name: 'Lemon potatoes',
          description: 'Roasted in lemon juice, garlic, oregano and olive oil until the edges catch.',
          price: 9,
          diet: ['vegan', 'gluten-free-ingredients'],
          art: 'salad',
          color: 'lemon',
          featured: true,
        },
        {
          id: 'gigantes',
          name: 'Gigantes',
          description: 'Giant white beans baked slowly in tomato, dill and olive oil.',
          price: 11,
          diet: ['vegan', 'gluten-free-ingredients'],
          art: 'dip',
          color: 'tomato',
        },
        {
          id: 'grilled-courgettes',
          name: 'Grilled courgettes',
          description: 'Charred courgette ribbons with mint, lemon and olive oil.',
          price: 10,
          diet: ['vegan', 'gluten-free-ingredients'],
          art: 'salad',
          color: 'olive',
        },
      ],
    },
    {
      id: 'from-the-grill',
      title: 'From the grill',
      description: 'Cooked over charcoal and brought out as they’re ready. Add pita from the extras.',
      items: [
        {
          id: 'chicken-souvlaki',
          name: 'Chicken souvlaki',
          description: 'Chicken thigh marinated in lemon, garlic and oregano, with tzatziki and pita.',
          price: [{ label: 'One skewer', amount: 9 }, { label: 'Plate of three', amount: 24 }],
          art: 'skewer',
          color: 'honey',
          featured: true,
        },
        {
          id: 'lamb-skewers',
          name: 'Lamb skewers',
          description: 'Lamb shoulder with grilled red onion, lemon and oregano salt.',
          price: 26,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          art: 'skewer',
          color: 'aubergine',
        },
        {
          id: 'grilled-sea-bream',
          name: 'Grilled sea bream',
          description: 'A whole fish dressed with olive oil, lemon and capers, with wild greens.',
          price: 32,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
          art: 'fish',
          color: 'lemon',
        },
        {
          id: 'bifteki',
          name: 'Bifteki',
          description: 'Grilled beef and herb patties with a little feta inside, tomato and red onion.',
          price: 22,
          art: 'skewer',
          color: 'tomato',
        },
        {
          id: 'vegetable-skewers',
          name: 'Vegetable skewers',
          description: 'Peppers, red onion, courgette and mushrooms brushed with oregano oil.',
          price: 18,
          diet: ['vegan', 'gluten-free-ingredients'],
          badge: 'new',
          art: 'skewer',
          color: 'olive',
        },
      ],
    },
    {
      id: 'something-sweet',
      title: 'Something sweet',
      description: 'To share with the last of the wine or a small coffee.',
      items: [
        {
          id: 'baklava',
          name: 'Baklava',
          description: 'Layers of filo, walnuts and pistachios soaked in honey syrup. Made in the cooler months.',
          price: 9,
          diet: ['vegetarian', 'contains-nuts'],
          badge: 'seasonal',
          art: 'pastry',
          color: 'honey',
        },
        {
          id: 'galaktoboureko',
          name: 'Galaktoboureko',
          description: 'Semolina custard baked in filo and finished with orange syrup.',
          price: 10,
          diet: ['vegetarian'],
          art: 'pastry',
          color: 'lemon',
        },
        {
          id: 'yoghurt-and-honey',
          name: 'Yoghurt & honey',
          description: 'Thick strained yoghurt with thyme honey and toasted walnuts.',
          price: 8,
          diet: ['vegetarian', 'gluten-free-ingredients', 'contains-nuts'],
          art: 'yoghurt',
          color: 'honey',
        },
        {
          id: 'orange-cake',
          name: 'Orange cake',
          description: 'Syrup-soaked orange and filo cake with a spoon of yoghurt.',
          price: 9,
          diet: ['vegetarian'],
          art: 'pastry',
          color: 'lemon',
        },
      ],
    },
    {
      id: 'drinks',
      title: 'Drinks',
      description: 'House wine by the glass or bottle, plus two without alcohol.',
      items: [
        {
          id: 'house-white-wine',
          name: 'House white wine',
          description: 'A crisp, dry white, good with meze and fish.',
          price: [{ label: 'Glass', amount: 12 }, { label: 'Bottle', amount: 46 }],
          art: 'glass',
          color: 'lemon',
        },
        {
          id: 'house-red-wine',
          name: 'House red wine',
          description: 'A medium-bodied dry red for the grill.',
          price: [{ label: 'Glass', amount: 13 }, { label: 'Bottle', amount: 50 }],
          art: 'glass',
          color: 'aubergine',
        },
        {
          id: 'lemon-soda',
          name: 'Lemon soda',
          description: 'House-made lemon syrup topped with sparkling water. No alcohol.',
          price: 5,
          diet: ['vegan', 'gluten-free-ingredients'],
          serve: 'iced',
          art: 'glass',
          color: 'lemon',
        },
        {
          id: 'greek-coffee',
          name: 'Greek coffee',
          description: 'Finely ground coffee brewed in a small pot, with a glass of water. Ask for it unsweetened, medium or sweet.',
          price: 4,
          diet: ['vegan', 'gluten-free-ingredients'],
          serve: 'hot',
          art: 'cup',
          color: 'honey',
        },
      ],
    },
  ],
  extras: [
    { name: 'Extra warm pita', price: 2 },
    { name: 'Cucumber and carrot to dip instead of pita', price: 0 },
    { name: 'Extra side of tzatziki', price: 4 },
  ],
  notes: [
    'VG vegan · V vegetarian · GF made with gluten-free ingredients · DF made with dairy-free ingredients · N contains nuts.',
    'Plates arrive as they’re ready and go in the middle of the table. Two or three plates each is a good start.',
    'Our kitchen handles gluten, dairy, nuts, sesame, eggs and fish in shared spaces. Markers describe ingredients, not the absence of cross-contact, so please tell us about any allergy before ordering.',
    'Wine is served to guests 21 and over; please bring ID.',
  ],
};

/** Every item, in menu order. */
export const allItems: MenuItem[] = menu.sections.flatMap(section => section.items);

/** The four dishes laid on the home page's shared table, in menu order. */
export const featuredItems: MenuItem[] = allItems.filter(item => item.featured);

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** "$4.50", "$14" for whole amounts, "Free" for 0. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Lowest price, for compact labels ("from $8"). */
export function startingPrice(item: MenuItem): number {
  return typeof item.price === 'number' ? item.price : Math.min(...item.price.map(size => size.amount));
}

/** "$9" or "from $8" — one short price for captions. */
export function shortPrice(item: MenuItem): string {
  return typeof item.price === 'number' ? formatPrice(item.price) : `from ${formatPrice(startingPrice(item))}`;
}

/** Items are available unless `available: false`. */
export function isAvailable(item: MenuItem): boolean {
  return item.available !== false;
}

/** The section an item belongs to. */
export function sectionOf(item: MenuItem): MenuSection | undefined {
  return menu.sections.find(section => section.items.includes(item));
}
