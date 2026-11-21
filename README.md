# Student Laptop Finder

SW302 - Assignment 2. A plain HTML, JavaScript ES modules and Tailwind CSS 4 app. No framework, application library, database or account is needed.

## Run

Open this folder in VS Code and use **Live Server** to open `index.html`. Do not double-click the HTML files: `fetch()` needs an HTTP server. The compiled `dist/output.css` is included, so installation is not needed just to view the site.

To install and rebuild Tailwind (Node.js and npm required):

```sh
npm install
npm run build
```

For automatic CSS rebuilding while editing:

```sh
npm run watch
```

`node_modules` is deliberately excluded from the submission. The only project dependencies are Tailwind, its CLI and the official forms plugin. Bun can also run the build with `bun run build`.

## Pages

- `index.html`: introduction, live statistics and featured laptops.
- `laptops.html`: live name/brand search, category, maximum price, minimum RAM and six sort options.
- `details.html?id=1`: one laptop, all specifications, favorites and comparison buttons. Missing or unknown IDs have a friendly message.
- `favorites.html`: saved laptops, removal, clear-all, total and average price.
- `compare.html`: choose two to four favorites and compare their specifications. A fifth selection is blocked with a message.

## How It Works

- `api.js` fetches `data/laptops.json` using `async/await` inside `try/catch`. Pages show animated card skeletons first and an error with a retry button on failure.
- `storage.js` reads and writes JSON in `localStorage`. Favorites, comparison selections and theme persist between pages and reloads. Removing a favorite also removes it from the active comparison.
- `ui.js` contains the shared header, footer, card renderer, loading state, currency formatting and favorite buttons. Home, catalogue and favorites reuse the same card function.
- `compare.js` defines the common specification rows and calculates numeric winners. Lower price and weight win; higher RAM, storage and battery win. Ties are all marked Best. CPU and screen size have no universal winner.
- Each page has its own small entry module, linked with `type="module"`. Imports share functions instead of duplicating them.
- `map()` creates cards and rows; `filter()` combines catalogue conditions; `[...filtered].sort()` sorts a copy rather than changing the original data. `reduce()` calculates the lowest home price and the favorites total; average is total divided by count, with an empty-list guard.
- Arrow functions include `money`, `escapeHTML`, `getFavorites` and `getComparison`. Other reusable functions include `fetchLaptops`, `renderCards`, `renderSkeleton`, `loadPage` and `toggleFavorite`.
- `src/input.css` begins with the Tailwind import, loads `@tailwindcss/forms`, defines semantic colors in `@theme`, and uses `@apply` for reusable component classes. Theme variables change under `data-theme="performance"`. Form styling, layout, spacing and responsive behavior use Tailwind utilities.
- Performance Mode uses a charcoal background and orange accent; Battery Saver Mode uses cream and green. These names describe visual themes, not actual device power settings.

## Data And Images

The dataset contains 20 laptops across five categories. Prices are illustrative USD values, not live offers. Specifications and battery estimates are sample educational data, not purchasing guarantees. Five original, local SVG illustrations represent categories rather than exact product photographs. No external image or font requests are required.

## Manual Test Checklist

Use Chrome or Edge at **375 px**, **768 px** and **1280 px** widths:

1. Open the catalogue, type a brand, enter a maximum price, select a battery sort and open a matching laptop. Check the result count, all category/RAM filters and the reset button. Search nonsense to check the empty state.
2. Save a laptop on Home, a second in the catalogue and a third in Details. Reload and visit Favorites. Check removal, clear-all, total and average.
3. In Compare, choose three favorites. Check the aligned rows and calculated Best labels. Save five favorites, select four, and try the fifth: it must remain unchecked and show a limit message.
4. Switch to Performance Mode, navigate to another page and reload. Check backgrounds, text, cards, controls and the saved theme.
5. At phone width, open and close Menu. Check keyboard focus, one-column cards and stacked filters. At larger widths check multi-column layouts. The comparison table should scroll inside its wrapper, not widen the whole page.
6. Visit `details.html`, then `details.html?id=999`. Both should show the friendly not-found state.
7. Temporarily make `data/laptops.json` unavailable and reload to check the loading/error flow; restore it afterward.

The CSS build, module syntax, dataset and storage/comparison logic were checked during implementation. A full interactive Chrome/Edge viewport test is still required before submission.

## Submission Notes

[Public GitHub repository for SW302 Assignment 2](https://github.com/xX-youssuf-Xx/ui-assignment-2)

For the discussion, be ready to explain the actual code: ES modules, asynchronous fetching, DOM rendering, event listeners, array methods, localStorage serialization, URLSearchParams, Tailwind compilation, theme variables and comparison winner calculations.
