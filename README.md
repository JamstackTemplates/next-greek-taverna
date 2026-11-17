# Blue Quince — Greek taverna (Next.js)

A whitewash-and-Aegean-blue theme for Greek tavernas and neighbourhood restaurants: editable meze, grill and drinks menus, a shared-table illustration drawn from your menu, seasonal terrace details, opening hours, location and a [Jamstacks](https://jamstacks.net) contact component for reservation and celebration enquiries.

The home page is built around a shared meze table seen from above. Four dishes from your menu sit on ceramic plates on an oval, cobalt-edged table, each linked to its line on the menu. The menu itself is an open printed menu with cobalt ceramic rules, two columns on desktop. Light mode is "Courtyard at noon" (whitewash, cobalt, olive and lemon); dark mode is "After the last sun" (an indigo courtyard with moonlit plates). Both follow the visitor's device unless they choose one with the header toggle.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend.

**Blue Quince**, its menu, story, phone number and email are fictitious placeholders. The sample address is a public landmark, **Washington Square Park** in New York, used only so the map has something real to show; no restaurant operates there. Replace all of it with your own details.

## Pages

| Route | What's there |
| --- | --- |
| `/` | **Welcome**: "Good things belong in the middle.", your introduction, See the menu, Enquire about a table, the opening status, address, phone and Find us, then the **shared table** with four featured dishes. Then **Find us** (address, landmark note, Get directions / Open in Google Maps, directions, seven-day hours with the time zone, map), **Summer courtyard** (terrace drawing and notes), **How we share** (with links to each menu section), **A little about the kitchen**, **Before you come** (six FAQs) and an enquiry line |
| `/menu/` | Section shortcuts, the diet legend, optional diet filters, the printed menu (portions, prices, diet markers and "Not available" rows), extras and notes, and a link to enquire about groups |
| `/contact/` | Reservation & celebration enquiries: the hosted form when connected, otherwise "Email us with your enquiry.", plus email, phone and what to include |
| any other URL | A friendly 404: "This plate isn't on the table." |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # content, opening hours, configuration and embed checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ at http://localhost:3000/
npm run check     # test + typecheck + build
```

No account, API key or network service is needed to build. Fonts come from npm and are bundled at build time.

## Make it yours

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | Sections, dishes and drinks, prices and portions, diet markers, badges, availability, the four featured dishes, extras, notes, currency |
| [content/taverna.ts](content/taverna.ts) | Name, tagline, introduction, story, email, phone, address and its note, directions, opening hours, notice, "How we share" points, FAQs, profile links, the terrace and Contact page copy |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours, fonts and other customizations |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name and description, domain, time zone and public Jamstacks settings |

**Renaming the business** is a two-line change: `name` in `content/taverna.ts` and `name` in `site.config.json`. Page titles, the header, footer and structured data all read it from there.

### A menu item

```ts
{
  id: 'horiatiki',                 // unique; also the link /menu/#horiatiki
  name: 'Horiatiki',
  description: 'Village salad of tomato, cucumber, red onion, green pepper and olives, under a slab of feta and oregano.',
  price: [{ label: 'For one', amount: 13 }, { label: 'For the table', amount: 21 }],  // or simply: price: 12
  diet: ['vegetarian', 'gluten-free-ingredients'],
  art: 'salad',                    // the drawing if it's featured: dip, salad, skewer, fish, pastry, yoghurt, glass, cup
  color: 'tomato',                 // its colour: olive, lemon, tomato, aubergine, honey, ceramic
  featured: true,                  // one of exactly four plates on the home page table
}
```

Common tasks:

- **Sold out or off for now:** add `available: false`. The row stays on the menu and says "Not available" instead of a price. If it's a featured dish, its plate on the home page is emptied and its caption says "Not available" too. Remove the line when it's back.
- **Seasonal or new:** `badge: 'seasonal'` or `badge: 'new'` (`'signature'` shows "House favourite"). Badges are edited by hand and are never read as "today's special".
- **A new section:** add `{ id: 'soups', title: 'Soups', description: '…', items: [ … ] }` to `sections`. It appears in the shortcuts, the printed menu and the home page list automatically. The section's heading glyph comes from its first item's `art`.
- **Change the featured dishes:** move `featured: true` to four other items. The tests insist on exactly four.
- **Diet markers** describe a recipe's ingredients. `GF` means made with gluten-free ingredients in a kitchen that handles gluten; the menu notes say so. Vegan items also count as vegetarian and dairy-free in the filters. Review the markers on your real dishes; the tests can't judge food safety.
- **Prices** are numbers in `menu.currency` (`9` is $9, `9.5` is $9.50). Change `currency` and `locale` for other countries.

`npm test` checks everything after an edit: unique URL-safe ids, complete fields, known markers, art and colours, positive prices in cents, unique portion labels, exactly four featured dishes, careful diet labels, the cross-contact note, the terrace switch, the hours and the business name. A failure names what to fix.

### The terrace

All terrace copy is in `taverna.terrace`: `title`, `description`, `seasonNote` ("Summer evenings, weather permitting."), `seatingNote`, `weatherNote` and `enquiryNote`. It is editorial copy, not a live availability claim: nothing is inferred from the date, hours, weather or the light/dark theme. With no outdoor tables, set `enabled: false`; the section, the header's Terrace link and the footer link disappear, leaving no broken anchors.

### Hours, status and time zone

`hours` in `content/taverna.ts` lists every day once, Monday first, in 24-hour local time:

```ts
{ day: 'Monday' },                                   // closed: no times
{ day: 'Tuesday', opens: '17:00', closes: '22:00' },
{ day: 'Saturday', opens: '12:00', closes: '23:00' },
```

Each day has one interval that closes later the same day. Closing after midnight and split lunch/dinner days are rejected by the tests rather than shown wrongly; supporting them means changing `lib/opening-hours.ts`, the structured data and the tests together.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/New_York`. The visitor's browser works out the status from *your* clock and refreshes it every minute: "Open now · until 10pm", "Closed · opens today at 5pm" or "Closed · opens Tuesday at 5pm". "Times shown in Eastern Time" appears beside the hours. The built files never contain a time-dependent claim: before JavaScript runs, without it, or without a valid time zone, the status says "See opening hours." Hours are opening hours only, not a promise of a table, the terrace or a last kitchen order. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it.

### Location and map

Find us, the map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/taverna.ts`. The `note` under the address currently says it's a sample location; replace it with your cross streets or a landmark.

The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), and the map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `maps?q=…&output=embed` redirects to). Neither needs an account or key. For Google's officially supported option, create a [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts). The map is lazy-loaded, may set Google cookies, is softened in dark mode by `--map-filter` and is hidden when printing.

## Appearance

Everything you see is inline SVG and CSS coloured by tokens, so there are no image files to swap: the shared table (with its runner, olive bowl, lemon wedges and pita), the plates and food silhouettes, the courtyard wall with woven chairs, the olive branch, the section glyphs and the brushstroke divider. The olive leaves sway very slowly and links underline with a short transition; both stop for visitors who prefer reduced motion.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's colour tokens; Tailwind's default palette is switched off. To change a colour, edit its variable in `app/tailwind.input.css` (the light `:root` block and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on). Food colours are `--food-*` tokens; drawing colours such as `--plate`, `--table-top` and `--wall` are tokens too.

| Font | Used for | Licence |
| --- | --- | --- |
| [Gelasio](https://fonts.google.com/specimen/Gelasio) (`@fontsource/gelasio`) | Headings, dish names and short italic notes | SIL Open Font License 1.1 |
| [Commissioner](https://fonts.google.com/specimen/Commissioner) (`@fontsource-variable/commissioner`) | Body text, navigation, buttons and prices (tabular figures) | SIL Open Font License 1.1 |

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)", an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). It's your website: keep it, reword it or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite it when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Blue Quince",
  "description": "A neighbourhood Greek taverna for shared meze, the grill and a summer courtyard. Menu, opening hours, how to find us and table enquiries.",
  "domain": "next-greek-taverna.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo, `next-greek-taverna.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `www.example.com`), or set it to `""` until you know it. It's used for canonical links, the social image, the sitemap and structured data. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-taverna` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. Validation happens at build time in [lib/config.mjs](lib/config.mjs): the site ID must be a single path-safe segment, the CDN must be HTTPS, the domain a bare hostname and the base path a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and always in GitHub Actions. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty.

The home page includes schema.org `Restaurant` data built from your content: name, description, URL, menu URL, phone, email, postal address, `servesCuisine: ["Greek", "Mediterranean"]` and opening hours (closed days omitted). It doesn't invent coordinates, ratings, prices or booking actions.

## Contact and Jamstacks

**Without Jamstacks** (default): Contact says "Email us with your enquiry." with your email (and a copy button), your phone for time-sensitive questions, a "useful to include" list (date and time, party size, terrace or occasion, dietary or access questions) and the reminder that nothing is reserved until you reply. No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure and **publish** the support form (for example heading "Reservation & celebration enquiries", name/email/message labels and a success message), set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you don't use `https://cdn.jamstacks.net`) and rebuild. Contact then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

- The hosted component owns validation, spam protection, submission and its success/error messages. The template never submits, registers the element or shows success itself.
- Your email stays visible beside the form. If the script fails or is slow, a short note offers email; without JavaScript, the page points to email.
- Form text and theme changes published in the portal appear after a reload, with no rebuild. Content and site ID changes need a rebuild.
- The form supports name, email and message. A message is an enquiry: it doesn't reserve a table, place an order or guarantee a dietary accommodation. Don't promise booking slots, deposits or extra fields.
- Only Contact loads the Jamstacks script. Links to and from Contact are full page loads ([components/site-link.tsx](components/site-link.tsx)), because the runtime finds its host when its script runs and has no remount API.
- The page maps its tokens to the `--jamstacks-*` CSS variables; the form's primary colour stays cobalt in both modes so its white button text is readable. Don't style the component's internals.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the form's spam-check provider (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN` (public variables, not secrets).
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/greek-preview npm run build
node scripts/serve.mjs --base /greek-preview   # http://localhost:3000/greek-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain**, create the DNS records GitHub shows, and put the same hostname in `site.config.json`'s `domain`. Don't add a `public/CNAME` file; Actions deployments ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository, it already enabled Pages, set the variables and started the first run, named `Jamstacks <operation id>` (the workflow's `provisioning_id` input). Keep the workflow's path, inputs and run name.

## Local Jamstacks development

Against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

Trust the local development certificate and register `http://localhost:3000` as an allowed origin for the website in the portal.

## Project structure

```
app/                    routes (home, menu, contact, 404), metadata, sitemap/robots, styles and tokens
components/             header, footer, shared table, plates and food drawings, courtyard, menu sheet and filters,
                        opening status, icons, page head, map, Jamstacks host/loader
content/                taverna.ts and menu.ts: your content
lib/config.mjs          build-time public config resolution and validation
lib/opening-hours.ts    hours validation, open/closed status and the next opening
lib/navigation.ts       header/footer links (and the terrace switch) and reserved anchors
lib/menu-filter.ts      diet filters
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/                  typed JSX for <jamstacks-support-form>
public/                 social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Blue Quince (in `content/taverna.ts` and `site.config.json`), the story, address and its sample-location note, directions, email, phone, menu, prices, diet markers, FAQs, terrace copy and profile links with your own. Check the name isn't already used by another business near you.
- Set your real hours and `timeZone`, and check the status on the home page.
- Replace the demo `domain` in `site.config.json` with your own, and update the description, icon and social image.
- Run `npm run check`, plus a project-path build if you use a repository URL.
- Check every page on phone and desktop, in light and dark, with the keyboard and with the Contact email fallback.
- If you connect Jamstacks, publish the form and send a real test message. A successful build doesn't verify delivery.

`AGENTS.md` gives coding assistants the same guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template. **A customer website can delete the whole folder**, and Jamstacks provisioning removes it after verifying it. Normal `npm test`, type checking, builds and the Pages workflow never read it. `site.config.json`, the embed integration and `.github/workflows/pages.yml` stay outside it and keep working without it.
