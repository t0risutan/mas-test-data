# inline-price

## inline-price

### What it does

`inline-price` is a customized built-in element (`<span is="inline-price">`) that resolves WCS pricing for one or more Offer Selector IDs and renders formatted price HTML.

For comma-separated OSIs (soft bundles), prices are resolved independently, the best offer is selected per OSI, and the results are summed. If any OSI fails, the entire element fails.

Requires `mas-commerce-service` on the page. See [MAS](mas.html#terminology) for terminology.

### Attributes / Props

| Attribute / property | Description | Default | Required |
| --- | --- | --- | --- |
| `data-wcs-osi` | Offer Selector ID. Comma-separated for soft bundles (prices summed). | — | yes |
| `data-display-old-price` | Show old/strikethrough price for promo offers. | `true` | no |
| `data-display-per-unit` | Show per-unit label (for example "per license"). | `false` | no |
| `data-display-recurrence` | Show recurrence (for example `/mo`). | `true` | no |
| `data-display-tax` | Show tax label. When unset and `mas-ff-defaults` is on, resolved from locale/segment. | `false` | no |
| `data-display-plan-type` | Show plan type text. | `false` | no |
| `data-display-annual` | Enable annual price display for ABM offers when `mas-ff-annual-price` is on. Set to `false` to opt out. | — | no |
| `data-perpetual` | Whether the offer is perpetual. | `false` | no |
| `data-promotion-code` | Flex promotion code. | — | no |
| `data-force-tax-exclusive` | Force tax-exclusive pricing. When unset and `mas-ff-defaults` is on, resolved from locale/segment. | `false` | no |
| `data-template` | Price template (see table below). | `price` | no |
| `data-quantity` | Quantity for volume promotions. **Not supported for soft bundles.** | `1` | no |
| `isInlinePrice` (property) | Returns `true` on inline-price elements. | — | — |
| `isFailed` (property) | Returns `true` when render failed. | — | — |
| `value` (property) | Resolved offer/price data. | — | — |
| `options` (property) | Full option set used to resolve the price. | — | — |
| `onceSettled()` (method) | Promise resolving when the element settles to resolved or failed. | — | — |
| `requestUpdate(force?)` (method) | Re-renders from current attributes. | — | — |
| `InlinePrice.createInlinePrice(options)` (static) | Programmatically creates an inline-price element. Returns `null` if service is missing. | — | — |

**`data-template` values** (from `price.js` / `buildPriceHTML`):

| Value | Behavior |
| --- | --- |
| `price` | Default price display |
| `discount` | Promo discount percentage. With two OSIs, uses cross-offer percentage logic. |
| `optical` | Monthly price for paid-upfront (PUF) offers |
| `annual` | Yearly price for annual-billed-monthly offers |
| `strikethrough` | Strikethrough price styling |
| `promo-strikethrough` | Promo strikethrough styling |
| `legal` | Legal/plan-type price line |

When `mas-ff-annual-price` is enabled and `data-display-annual` is not `false`, ABM offers may also render annual pricing through the default `price` template path.

### Events

| Event | Description |
| --- | --- |
| `mas:resolved` | Fires when price HTML is rendered. |
| `mas:failed` | Fires when price cannot be resolved. |

CSS classes `placeholder-pending`, `placeholder-resolved`, and `placeholder-failed` reflect state. **`mas:pending` is not dispatched by the current implementation.**

Clicks on child price nodes are re-dispatched from the host element so parent handlers can listen on the `inline-price` itself.

### Usage example

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

Soft bundle (summed price):

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M,Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
></span>
```

Optical vs default template:

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
vs
<span
    is="inline-price"
    data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"
    data-display-per-unit="true"
    data-display-tax="true"
    data-template="optical"
></span>
```

Inspect resolved data:

```html {.demo}
<span
    id="ip1"
    is="inline-price"
    data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
></span>
<script type="module">
    document.getElementById('ip1').onceSettled().then((el) => {
        document.getElementById('ipValue').innerHTML = JSON.stringify(
            el.value,
            null,
            '\t',
        );
    });
</script>
```

#### value property

```json {#ipValue}

```

### Notes

- All OSIs in a soft bundle must resolve successfully; partial failure fails the whole element.
- `data-quantity` is ignored for soft bundles.
- With `mas-ff-defaults` enabled (via meta tag, service attribute, or parent `merch-card` / `mas-field`), unset tax flags are resolved using `resolvePriceTaxFlags()` based on country, language, and customer/market segment.
- With `mas-ff-defaults` off, `data-display-old-price` defaults to `true` when not explicitly set.
- When a parent contains paired strikethrough and price elements, the component may set `alternativePrice` on sibling inline-price elements to add screen-reader "Alternatively at" text.
- Tax defaults for Milo locales are documented under [Feature Flags](feature-flags.html#mas-ff-defaults).
