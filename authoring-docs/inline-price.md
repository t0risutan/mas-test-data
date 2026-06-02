## inline-price

### What it does

A customized built-in element (`<span is="inline-price">`) that fetches pricing from WCS for one or more Offer Selector IDs and renders formatted price HTML into the element. Implementation is in `web-components/src/inline-price.js`.

When multiple comma-separated OSIs are provided, each OSI is resolved independently, the best offer per OSI is selected, and prices are summed via `sumOffers()` before rendering.

Price formatting is delegated to `buildPriceHTML()` in `web-components/src/price.js`, which selects a template function based on the `data-template` value and offer data.

When `mas-ff-defaults` is enabled on `mas-commerce-service` (or passed per-element via options), unset tax and per-unit display options are inferred from locale and customer segment using `resolvePriceTaxFlags()`.

When `mas-ff-annual-price` is enabled and `data-display-annual` is not `false`, annual price display is turned on for eligible offers.

### Attributes / Props

Observed attributes (`InlinePrice.observedAttributes`):

| Attribute | Dataset key | Description | Default |
|-----------|-------------|-------------|---------|
| `data-wcs-osi` | `wcsOsi` | Comma-separated OSIs. Required. | (none) |
| `data-display-old-price` | `displayOldPrice` | Show strikethrough/old price for promos. | `true` when defaults off; otherwise from settings |
| `data-display-per-unit` | `displayPerUnit` | Show per-unit label (e.g. per license). | `false`; with `mas-ff-defaults`, `true` for non-INDIVIDUAL segments when unset |
| `data-display-recurrence` | `displayRecurrence` | Show recurrence (e.g. /mo). | `true` |
| `data-display-tax` | `displayTax` | Show tax label. | `false`; auto-resolved with `mas-ff-defaults` |
| `data-display-plan-type` | `displayPlanType` | Show plan type text. | `false` |
| `data-display-annual` | `displayAnnual` | Include annual price in output when annual-price flag is on. | unset; forced `true` when `mas-ff-annual-price` enabled unless explicitly `false` |
| `data-perpetual` | `perpetual` | Perpetual offer flag. | `false` |
| `data-promotion-code` | `promotionCode` | Flex promotion code. | (from settings) |
| `data-force-tax-exclusive` | `forceTaxExclusive` | Force tax-exclusive pricing. | `false` |
| `data-template` | `template` | Price template (see below). | `price` |
| `data-quantity` | `quantity` | Quantity for volume pricing. | `1` |

Supported `data-template` values handled in `price.js` `buildPriceHTML`:

| Value | Behavior |
|-------|----------|
| `price` | Standard price (default). Uses promo variant when promotion is active. |
| `discount` | Percentage discount. With two resolved offers, uses cross-offer comparison. |
| `strikethrough` | Strikethrough price display. |
| `promo-strikethrough` | Promo strikethrough variant. |
| `optical` | Monthly equivalent for paid-upfront (PUF) offers. |
| `annual` | Yearly price for annual-billed-monthly offers. |
| `legal` | Legal price line; respects `legalDisplayDot` from card variant layout. |

Read-only properties:

| Property | Description |
|----------|-------------|
| `isInlinePrice` | Always `true`. |
| `onceSettled` | Promise for resolved or failed state. |
| `options` | Collected price options. |
| `value` | Resolved offer data. |
| `isFailed` | Whether state is failed. |

Methods:

| Method | Description |
|--------|-------------|
| `requestUpdate(force?)` | Re-fetch and re-render price. |

Static factory:

| Method | Description |
|--------|-------------|
| `InlinePrice.createInlinePrice(options)` | Programmatic creation. |

### Events

| Event | When |
|-------|------|
| `mas:resolved` | Price HTML rendered successfully. |
| `mas:failed` | WCS resolution or offer selection failed. |

CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

Click behavior: clicks on child nodes are re-dispatched from the span so parent handlers on the price element receive them.

### Usage example

```html
<mas-commerce-service></mas-commerce-service>

<span
  is="inline-price"
  data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

Soft bundle (summed price):

```html
<span
  is="inline-price"
  data-wcs-osi="osi-photoshop,osi-lightroom"
></span>
```

With tax and per-unit labels:

```html
<span
  is="inline-price"
  data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
  data-display-per-unit="true"
  data-display-tax="true"
></span>
```

### Notes

- Requires `mas-commerce-service`. Resolution fails if any OSI in a multi-OSI list cannot be selected (`inline-price.js` throws when `selectedOffers.some(offer => !offer)`).
- Tax defaults for locales are implemented in `resolvePriceTaxFlags()` and `DISPLAY_ALL_TAX_COUNTRIES` / `TAX_EXCLUDED_MAP` in `inline-price.js`.
- Cards loaded from AEM fragments automatically opt inline prices into `mas-ff-defaults` via the price options provider in `merch-card.js`.
- Source: `web-components/src/inline-price.js`, `web-components/src/price.js`, `web-components/src/mas-element.js`.
