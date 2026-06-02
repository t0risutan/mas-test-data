# Component and Variant Inventory

Inventory derived from `web-components/src/` as of this branch. "Authoring doc" refers to [mas.adobe.com/docs](https://mas.adobe.com/docs/); "Developer doc" refers to [mas.adobe.com/web-components/docs](https://mas.adobe.com/web-components/docs/).

## Commerce elements

| Component | Source | Authoring doc | Developer doc |
|-----------|--------|---------------|---------------|
| `mas-commerce-service` | `mas-commerce-service.js` | [mas-commerce-service.md](mas-commerce-service.md) | [mas.js.html](https://mas.adobe.com/web-components/docs/mas.js.html) (partial) |
| `inline-price` | `inline-price.js` | [inline-price.md](inline-price.md) | [inline-price.html](https://mas.adobe.com/web-components/docs/inline-price.html) |
| `checkout-link` | `checkout-link.js` | [checkout-link.md](checkout-link.md) | [checkout-link.html](https://mas.adobe.com/web-components/docs/checkout-link.html) |
| `checkout-button` | `checkout-button.js` | [checkout-button.md](checkout-button.md) | [checkout-button.html](https://mas.adobe.com/web-components/docs/checkout-button.html) |
| `upt-link` | `upt-link.js` | — | [upt-link.html](https://mas.adobe.com/web-components/docs/upt-link.html) |
| `aem-fragment` | `aem-fragment.js` | [aem-fragment.md](aem-fragment.md) | [aem-fragment.html](https://mas.adobe.com/web-components/docs/aem-fragment.html) |

## Merch card and related UI

| Component | Source | Authoring doc | Developer doc |
|-----------|--------|---------------|---------------|
| `merch-card` | `merch-card.js` | [merch-card.md](merch-card.md) | [merch-card.html](https://mas.adobe.com/web-components/docs/merch-card.html) |
| `merch-card-collection` | `merch-card-collection.js` | — (see `/docs/collections` on live site) | [plans-collection.html](https://mas.adobe.com/web-components/docs/plans-collection.html) (gallery) |
| `merch-icon` | `merch-icon.js` | — | — |
| `merch-badge` | `merch-badge.js` | — | — |
| `merch-offer` | `merch-offer.js` | — | — |
| `merch-offer-select` | `merch-offer-select.js` | — | — |
| `merch-quantity-select` | `merch-quantity-select.js` | — | — |
| `merch-addon` | `merch-addon.js` | — | — |
| `merch-gradient` | `merch-gradient.js` | — | — |
| `merch-mnemonic-list` / `mas-mnemonic` | `merch-mnemonic-list.js`, `mas-mnemonic.js` | — | — |
| `merch-whats-included` | `merch-whats-included.js` | — | — |
| `merch-search` | `merch-search.js` | — | — |
| `merch-stock` | `merch-stock.js` | — | — |
| `merch-secure-transaction` | `merch-secure-transaction.js` | — | — |
| `merch-sidenav` (+ list, checkbox-group) | `sidenav/` | — | — |
| `plans-modal` | `plans-modal.js` | — | — |
| `mas-field` | `mas-field.js` | — | — |
| `json-ld` | `json-ld.js` | — | [json-ld.html](https://mas.adobe.com/web-components/docs/json-ld.html) |

## Registered merch-card variants

| Variant | Source | Developer gallery |
|---------|--------|-------------------|
| `catalog` | `variants/catalog.js` | catalog.html |
| `image` | `variants/image.js` | image.html |
| `inline-heading` | `variants/inline-heading.js` | — |
| `mini-compare-chart` | `variants/mini-compare-chart.js` | minicompare.html |
| `mini-compare-chart-mweb` | `variants/mini-compare-chart-mweb.js` | minicomparemweb.html |
| `plans` | `variants/plans.js` | plans.html |
| `plans-students` | `variants/plans.js` | — |
| `plans-education` | `variants/plans.js` | — |
| `plans-v2` | `variants/plans-v2.js` | — |
| `product` | `variants/product.js` | product.html |
| `segment` | `variants/segment.js` | segment.html |
| `media` | `variants/media.js` | — |
| `headless` | `variants/headless.js` | — |
| `special-offers` | `variants/special-offer.js` | specialoffer.html |
| `simplified-pricing-express` | `variants/simplified-pricing-express.js` | express.html (partial) |
| `full-pricing-express` | `variants/full-pricing-express.js` | express.html (partial) |
| `mini` | `variants/mini.js` | ccd-mini.html |
| `fries` | `variants/fries.js` | fries.html |
| `ccd-suggested` | `variants/ccd-suggested.js` | ccd.html |
| `ccd-slice` | `variants/ccd-slice.js` | ccd.html |
| `ah-try-buy-widget` | `variants/ah-try-buy-widget.js` | adobe-home.html |
| `ah-promoted-plans` | `variants/ah-promoted-plans.js` | adobe-home.html |

## Feature flags (in codebase)

| Flag | Implemented in |
|------|----------------|
| `mas-ff-defaults` | `mas-commerce-service.js`, `inline-price.js`, `merch-card.js`, `mas-field.js` |
| `mas-ff-annual-price` | `mas-commerce-service.js`, `inline-price.js` |
| `mas-ff-3in1` | `checkout-mixin.js`, `checkout.js` (via `<meta>`) |

## Live authoring site pages (query-index)

Existing pages at `/docs/` that are **not** component reference docs:

- `/docs/` — placeholder index
- `/docs/collections`, `/docs/placeholders`, `/docs/localization`, `/docs/override-literals`, `/docs/mas-defaults`
- `/docs/ccd-app-card-authoring`
- `/docs/how-to/*`, `/docs/acom/*`, `/docs/cache/*`, `/docs/troubleshooting/*`

None of the priority commerce components had dedicated authoring pages before this contribution.
