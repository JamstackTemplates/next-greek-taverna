# Working on this website

This is a customer-owned Next.js website for a Greek taverna. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample taverna (Blue Quince), its
  menu, address, directions, hours and contact details with the owner's real details; the fictional examples are
  starting content. The sample address is a public landmark (Washington Square Park), not a restaurant.

## Structure and content

- `content/menu.ts` owns the food and drink. Most owner requests are edits here only:
  - `sections`: each with `id`, `title`, `description` and `items`, in menu order.
  - Items: `id`, `name`, `description`, `price` (a number, or `[{ label, amount }]` portions such as
    "Small"/"For the table" or "Glass"/"Bottle"), `diet` (`vegan` | `vegetarian` | `gluten-free-ingredients` |
    `dairy-free-ingredients` | `contains-nuts`), `badge` (`signature` | `seasonal` | `new`), `serve` (drinks only),
    `art` (`dip` | `salad` | `skewer` | `fish` | `pastry` | `yoghurt` | `glass` | `cup`), `color` (`olive` | `lemon` |
    `tomato` | `aubergine` | `honey` | `ceramic`), `available` and `featured`.
  - The most frequent edits are `price`, `available: false` (the row stays listed and says "Not available") and `badge`.
  - Exactly four items have `featured: true`; they are the plates on the home page's shared table, drawn from `art`
    and `color`. An unavailable featured dish stays on its plate, marked; never swap in another item silently.
  - `extras` (explicit small additions with prices) and `notes` (diet legend, sharing guidance, kitchen
    cross-contact note, the 21+ alcohol note). Diet markers describe ingredients, never an allergen-free kitchen.
- `content/taverna.ts` owns the name, tagline, introduction, story, email, phone, address (with a `note`),
  directions, opening hours, notice, amenities ("How we share"), FAQs, profile links, the `terrace` object and the
  `contact` page copy.
  - `terrace.enabled: false` removes the terrace section and every terrace link (the header then has two items).
    Terrace copy is editorial: never infer availability from dates, hours, weather or theme.
  - Hours are seven entries, Monday first, with one same-day `opens`/`closes` pair or neither (closed). Overnight and
    split ranges are rejected by the tests; supporting them means extending `lib/opening-hours.ts`, the structured
    data and the tests together.
- Navigation lives in `lib/navigation.ts`; link to `#terrace` only through it.
- Ids are unique, lowercase and hyphenated, and are page anchors (`/menu/#tzatziki`). Section, item, FAQ
  (`faq-<id>`) and amenity ids share one namespace with the reserved page anchors in `lib/navigation.ts`.
- The business name lives in two places: `taverna.name` in `content/taverna.ts` and `name` in `site.config.json`.
- Use the existing drawings and colour tokens instead of adding image files. A new food colour is a token plus an
  entry in `FoodColor`; a new silhouette is a drawing in `components/plate-art.tsx` plus an `Art` value, with tests.
- Content never goes in `site.config.json`: Jamstacks may rewrite it. The IANA `timeZone` does live there.
- Text is rendered as plain text. Don't invent reviews, awards, history, suppliers or availability.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds what utilities can't express: colour tokens (`:root` "Courtyard at noon" plus two
  identical dark "After the last sun" blocks), the `@theme` built from them, base element styles, building blocks
  (`.button`, `.button-ghost`, `.button-quiet`, `.text-link`, `.kicker`, `.ceramic-rule`, `.section-title`,
  `.tag-diet`), the table, plate, food and courtyard drawing classes, the olive-leaf sway, and data-attribute
  states (opening status, diet filters, FAQs, the hosted form).
- Only this template's palette exists (`bg`, `surface`, `surface-alt`, `ink`, `muted`, `accent`, `accent-strong`,
  `on-accent`, `link`, `olive`, `lemon`, `rule`, `table`). Tailwind's default colours are switched off. To add a
  colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)`. Prefer tokens to `dark:` variants (`dark:` follows `html.dark`).
- Lemon is an illustration colour, never small text. Dark-mode text links use `--link`; buttons stay cobalt with
  white text.
- Reuse `PageHead`, `SharedTable`, `Plate`, `Courtyard`, `MenuSheet`, `MenuFilters`, `OpenStatus`, `DishGlyph` and
  `AmenityIcon` instead of restyling each instance.
- Keep contrast in both themes, layouts from 360px, visible keyboard focus, semantic headings, the skip link, print
  styles and reduced-motion support (the sway and link transitions stop).

## Static architecture

- Production is a static export in `out/`. No request-time rendering, Route Handlers, Server Actions, middleware,
  database or production Next.js server.
- Client code is only for browser interactions: the opening status, the diet filters and the copy button.
- Time-dependent text is computed in the browser, never at build time. The static HTML says "See opening hours.";
  never bake "Open now", "Tonight" or "Today's menu" into a page.
- Without JavaScript the full menu is visible and every anchor works; the filter toolbar is hidden by
  `@media (scripting: none)`.
- Use the shared path helpers (`lib/paths.ts`) and `SiteLink` so custom domains and `/repository/` paths both work.
- Files imported by the Node tests import other modules' values with a `.ts` extension.
- Read the relevant guides in `node_modules/next/dist/docs/` before changing framework behaviour.

## Optional Jamstacks form

- The host is `<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="…">`, rendered by
  `components/jamstacks-support-form.tsx` on Contact only.
- `JAMSTACKS_SITE` is a public website ID. One bootstrap, `{cdn}/sites/{siteId}/embed.js`, loads only when it is set;
  without it there's no script request and the page offers email. The email stays visible beside the form.
- The hosted runtime owns rendering, validation, spam protection, submission and success messages. Don't register
  the element, render a substitute form, intercept submission or show success.
- Links to and from Contact use full-document navigation (`SiteLink`); the runtime has no remount API.
- The form supports name, email and message only. Page copy must not promise bookings, orders, deposits, uploads or
  extra fields: a message is an enquiry until the taverna replies.
- Style through `--jamstacks-*` variables only. Configuration is public: never add credentials or private
  recipients. Keep `.github/workflows/pages.yml`, its `provisioning_id` input and its run name.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # content, opening hours, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/greek-preview npm run build
```

Run `npm run check` after every change; failures name the section, item, field or day to fix. `npm start` previews
`out/`. Browser-check changed pages in light and dark at phone and desktop widths. Report local checks separately
from actual deployments or delivered contact messages.

## Template publishing assets

- `jamstacks/` holds optional source-template metadata (`config.json`), capture evidence (`screenshots.json`), the
  gallery JPEGs and `config.test.mjs`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining the source template.
- Customer websites can delete the whole folder. Website code, normal tests, builds and the Pages workflow must never
  import or read it; keep `site.config.json`, the embed integration and the workflow outside it.
