# inline-price

## What it does

`inline-price` is a customized built-in element (`<span is="inline-price">`) that fetches offer pricing from WCS for one or more OSIs and renders formatted price HTML via the commerce service `buildPriceHTML` pipeline (`price.js` templates).

Supports single offers and soft bundles (comma-separated OSIs): each OSI is resolved, the best offer per OSI is selected, then prices are summed (`sumOffers` in `utilities.js`). If any OSI fails, the whole element fails.

Requires `<mas-commerce-service>` on the page.

## Attributes / Props

Observed attributes (`inline-price.js`):

| Attribute | Option key | Description |
| --------- | ---------- | ----------- |
| `data-wcs-osi` | `wcsOsi` | Offer selector ID(s). Comma-separated for soft bundles. **Required**. |
| `data-display-old-price` | `displayOldPrice` | Show strikethrough/old price when applicable. |
| `data-display-per-unit` | `displayPerUnit` | Show per-unit label (e.g. per license). |
| `data-display-recurrence` | `displayRecurrence` | Show recurrence (e.g. `/mo`). |
| `data-display-tax` | `displayTax` | Show tax label. |
| `data-display-plan-type` | `displayPlanType` | Show plan type text. |
| `data-display-annual` | `displayAnnual` | When `false`, disables annual price line even if `mas-ff-annual-price` is on. |
| `data-perpetual` | `perpetual` | Perpetual offer flag. |
| `data-promotion-code` | `promotionCode` | Flex promotion code. |
| `data-force-tax-exclusive` | `forceTaxExclusive` | Force tax-exclusive display; when unset, geo defaults may apply with `mas-ff-defaults`. |
| `data-template` | `template` | Price template (see below). |
| `data-quantity` | `quantity` | Quantity for volume/promo pricing. **Not supported for soft bundles** (multiple OSIs). |

**`data-template` values** implemented in `price.js` `buildPriceHTML`:

| Value | Behavior |
| ----- | -------- |
| `price` | Default price display (or promo variant when promotion applies). |
| `discount` | Percentage discount; with two OSIs, uses cross-offer comparison. |
| `optical` | Monthly equivalent for paid-upfront (PUF) offers. |
| `strikethrough` | Strikethrough price styling. |
| `promo-strikethrough` | Promo strikethrough template. |
| `annual` | Annual price line for eligible offers. |
| `legal` | Legal price copy (`TEMPLATE_PRICE_LEGAL`). |

When `mas-ff-annual-price` is enabled and `data-display-annual` is not `false`, annual pricing may render via `priceWithAnnual` / `pricePromoWithAnnual` for ABM plan types even without `data-template="annual"`.

**Properties and methods:**

| Name | Description |
| ---- | ----------- |
| `isInlinePrice` | Always `true`. |
| `value` | Resolved offer / summed offer data. |
| `options` | Options used for rendering (includes literals). |
| `isFailed` | Whether state is failed. |
| `onceSettled()` | Promise for resolve/fail lifecycle. |
| `requestUpdate(force?)` | Re-fetch and re-render. |

Static helper: `InlinePrice.createInlinePrice(options)`.

Cards with an `aem-fragment` enable `mas-ff-defaults` for nested inline prices via the price provider (`merch-card.js`).

## Events

| Event | Description |
| ----- | ----------- |
| `mas:resolved` | Price HTML rendered successfully. Bubbles. |
| `mas:failed` | Resolution or selection failed. Bubbles. |

**CSS classes:** `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

`mas:pending` is not dispatched by `MasElement` (pending state only updates CSS classes).

Clicks on child nodes inside the span are re-dispatched as a bubbling `click` on the `inline-price` element (`handleClick`).

## Usage example

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

Soft bundle (sum of two OSIs):

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M,Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
></span>
```

Template and tax display:

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-display-per-unit="true"
    data-display-tax="true"
    data-template="optical"
></span>
```

## Notes

- Implementation: `web-components/src/inline-price.js`, rendering in `price.js` and `price/index.js`.
- With `mas-ff-defaults` (meta, service `data-mas-ff-defaults`, or card fragment context), unset `displayPerUnit` defaults to `true` for non-`INDIVIDUAL` segments; tax flags use `resolvePriceTaxFlags` (`inline-price.js`).
- Without `mas-ff-defaults`, unset `displayOldPrice` defaults to `true`.
- Pairing strikethrough + price siblings can trigger `alternativePrice` screen-reader labeling logic in `renderOffers`.
