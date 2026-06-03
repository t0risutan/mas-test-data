# inline-price

## inline-price

### What it does

A customized built-in element (`<span is="inline-price">`) that fetches offer(s) from WCS by OSI, selects the best matching offer per OSI, optionally sums multiple offers (soft bundle), and renders formatted price HTML via consonant price templates (`price.js` / `buildPriceHTML`).

Tax display defaults can be resolved per geo/segment when `mas-ff-defaults` is enabled (`resolvePriceTaxFlags` in `inline-price.js`). Click events on child price nodes are re-dispatched from the span for analytics.

### Attributes / Props

Observed attributes (`inline-price.js`):

| Attribute | Option key | Description |
| --- | --- | --- |
| `data-wcs-osi` | `wcsOsi` | One or more comma-separated OSIs. Required. |
| `data-display-old-price` | `displayOldPrice` | Show strikethrough/old price when promo applies. |
| `data-display-per-unit` | `displayPerUnit` | Show per-unit label (e.g. per license). |
| `data-display-recurrence` | `displayRecurrence` | Show recurrence (e.g. `/mo`). |
| `data-display-tax` | `displayTax` | Show tax label. |
| `data-display-plan-type` | `displayPlanType` | Show plan type text. |
| `data-display-annual` | `displayAnnual` | Enable annual price display when `mas-ff-annual-price` is on. |
| `data-perpetual` | `perpetual` | Perpetual offer flag. |
| `data-promotion-code` | `promotionCode` | Flex promotion code. |
| `data-force-tax-exclusive` | `forceTaxExclusive` | Force tax-exclusive display; when unset under `mas-ff-defaults`, geo defaults apply. |
| `data-template` | `template` | Price template (see table below). |
| `data-quantity` | `quantity` | Quantity for volume promos. Not applied per soft-bundle note in prior docs — multiple OSIs use default quantity handling in `collectPriceOptions`. |

`data-template` values implemented in `price.js` `buildPriceHTML`:

| Template | Behavior |
| --- | --- |
| `price` (default) | Standard price; uses `pricePromo` when promotion active. |
| `discount` | Percentage discount; with exactly two OSIs, uses cross-offer reference pricing. |
| `optical` | Monthly equivalent for paid-upfront (PUF) offers. |
| `annual` | Yearly price for ABM-style offers. |
| `strikethrough` | Strikethrough price styling. |
| `promo-strikethrough` | Promo strikethrough variant. |
| `legal` | Legal/plan copy template (`legal` in `price/index.js`). |

With `mas-ff-annual-price` and ABM offers, `displayAnnual` can also switch rendering to `priceWithAnnual` / `pricePromoWithAnnual` without `data-template="annual"`.

`alternativePrice` is an option (not a `data-*` attribute in `observedAttributes`); when true, adds screen-reader “Alternatively at” copy for paired strikethrough layouts (set programmatically in `renderOffers`).

| Property / method | Description |
| --- | --- |
| `isInlinePrice` | Always `true`. |
| `value`, `options` | Resolved offer data and render options. |
| `isFailed` | True when internal state is failed. |
| `onceSettled()`, `requestUpdate(force?)` | Same pattern as checkout elements. |
| `InlinePrice.createInlinePrice(options)` | Factory via service `collectPriceOptions`. |

CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

### Events

| Event | When |
| --- | --- |
| `mas:resolved` | Price HTML rendered |
| `mas:failed` | No offers / selection failure / thrown error in `render()` |

No `mas:pending` event; pending state uses `placeholder-pending` class only.

### Usage example

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

Soft bundle (sum of multiple OSIs — all must resolve):

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M,Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
></span>
```

Tax and per-unit:

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
```

### Notes

- On render failure, `render()` clears `innerHTML` and rethrows; failed state is set via `mas-element`.
- `mas-ff-defaults`: when `displayPerUnit`, `displayTax`, or `forceTaxExclusive` are unset, values come from `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)`.
- Without `mas-ff-defaults`, `displayOldPrice` defaults to `true` when unset.
- Feature flags: [feature-flags](feature-flags.html).
