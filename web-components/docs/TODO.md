## TODO

### High

### Medium
- [ ] mini-compare-chart (+ mweb): Gallery-only — depends on undocumented merch-offer-select, merch-addon, merch-whats-included
- [ ] Express variants (simplified-pricing-express, full-pricing-express): `express.html` gallery only — no slot map or collection setup docs
- [ ] plans-modal: Shipped with attributes and slots but zero usage documentation
- [ ] deeplink / URL hash contract: Shared by collection, search, and sidenav — no docs on supported hash keys
- [ ] mas-mnemonic + merch-mnemonic-list: Used across express, fries, whats-included — no component pages
- [ ] catalog collection pattern: `catalog.md` shows isolated cards only — no `merch-card-collection` example

### Low
- [ ] merch-stock: Built and exported but plans stock UX uses merch-card `checkbox-label` instead — unclear when to use standalone element
- [ ] mini variant: One-line mention only — `MINI_AEM_FRAGMENT_MAPPING` slots undocumented
- [ ] image + special-offers galleries: Gallery-only — missing slot reference tables
- [ ] merch-secure-transaction: Small label/tooltip element with no page
- [ ] mas-field: Headless AEM field renderer — no docs
- [ ] merch-gradient: Internal gradient-border helper — no docs
- [ ] CCD / Adobe Home variant galleries: Gallery-only for ccd-slice, ccd-suggested, ah-try-buy-widget, ah-promoted-plans
- [ ] fries.html navigation gap: Page exists but not linked in mas-sidenav.js

## Done
- [x] media + inline-heading variants: Name-only in merch-card.md — missing slot maps and layout rules (completed in merch-card.md)
- [x] fries variant: `fries.html` gallery exists but absent from sidenav and build-docs.sh — no `FRIES_AEM_FRAGMENT_MAPPING` docs (completed in fries.md)
- [x] headless variant: No slot guide for `HEADLESS_AEM_FRAGMENT_MAPPING` label/value rows (completed in headless.md)
- [x] merch-icon: No element page beyond a single usage example — missing `size`, `href`, `loading`, tooltip fallback (completed in merch-icon.md)
- [x] merch-badge: No element page — only indirect mention via merch-card badge attributes (completed in merch-badge.md)
- [x] merch-whats-included: No docs for expandable feature list — missing slots, `has-bullets`, `mobileRows`, and `hide-see-more-elements` event (completed in merch-whats-included.md)
- [x] merch-addon: No docs for addon checkbox used in plans, plans-v2, product, mini-compare — missing `plan-type`, `custom-checkbox`, `checked`, `change` event, and `getOsi()` checkout mutation (completed in merch-addon.md)
- [x] merch-card commerce attributes (incomplete in merch-card.md): `checkbox-label`/`toggleStockOffer()`, `addon-offers`/`addon-title`, `secure-label`, `action-menu`, `plan-type`, `storage`, `custom-hr`, `detail-bg` documented in attributes table but without usage context (completed in merch-card.md)
- [x] plans-v2 variant: Listed in merch-card.md only; no variant guide for `PLANS_V2_AEM_FRAGMENT_MAPPING`, mobile accordion, stock toggle, or `collectionOptions` (completed in plans-v2.md)
- [x] plans / catalog / product / segment / commerce galleries: Gallery-only pages with no variant slot maps or AEM fragment field references — developers cannot infer authoring contracts from screenshots (completed in plans.md, catalog.md, product.md, segment.md, commerce.md)
- [x] merch-sidenav + merch-search: No docs though collections auto-wire them — missing `autoclose`/`modal`, deeplink hash sync, and AEM-driven `tagFilters` → checkbox groups (completed in merch-sidenav.md)
- [x] merch-quantity-select: No docs for quantity UI used in product and plans cards — missing attributes, `merch-quantity-selector:change` event, and sync with `merch-card-quantity:change` (completed in merch-quantity-select.md)
- [x] merch-offer-select + merch-offer: No docs for the multi-offer selection stack used in plans, product, and mini-compare variants — missing `container`, `variant`, slots, and the `merch-offer:ready` / `merch-offer-select:ready` / `merch-offer:selected` event chain (completed in merch-offer-select.md)
- [x] merch-card-collection: No API page — only live examples in plans-collection.md; missing attributes, events, AEM hydration, deeplink hash params, header placeholders, and sidenav integration (completed in merch-card-collection.md)
