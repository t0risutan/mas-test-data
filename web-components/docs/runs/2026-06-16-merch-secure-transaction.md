# merch-secure-transaction: Small label/tooltip element with no page

**Date:** 2026-06-16
**Commit:** 05808ce
**Priority:** Low

## What was added or fixed

- Created `web-components/docs/src/merch-secure-transaction.md` — API page covering attributes (`label`, `icon`, `tooltip`), render behavior, Spectrum dependencies, CSS custom properties, and the distinction from `merch-card` `secure-label`
- Generated `web-components/docs/merch-secure-transaction.html`
- Added build entry in `web-components/docs/src/build-docs.sh`
- Added sidenav link in `web-components/docs/mas-sidenav.js`
- Marked TODO item complete in `web-components/docs/TODO.md`

## Next item

**mas-field: Headless AEM field renderer — no docs** — `mas-field.js` is built as a standalone bundle (`build.mjs`) but has no documentation page or sidenav entry. Developers integrating headless AEM fragment rendering would not discover its API without reading source.
