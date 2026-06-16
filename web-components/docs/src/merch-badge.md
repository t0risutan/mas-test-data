<script type="module" src="../dist/mas.js"></script>

# merch-badge {#merch-badge}

## Introduction {#introduction}

`merch-badge` is a small label element for plan highlights such as "Best value", "Recommended", or "Save 40%". It supports Spectrum color tokens, optional icons, and dynamic pricing via [inline-price](inline-price.html).

On [merch-card](merch-card.html), badges appear in two ways:

1. **Attribute-based** — set `badge-text`, `badge-color`, and `badge-background-color` on the card. The variant layout renders a shadow-DOM `#badge` div (no `merch-badge` element). Used in manual authoring and in [merch-offer-select](merch-offer-select.html) offer switching.
2. **Slot-based** — place `<merch-badge slot="badge">` (or `slot="trial-badge"`) on the card. AEM hydration wraps fragment `badge` / `trialBadge` fields in `<merch-badge>` automatically when the variant mapping defines a `badge.slot`.

Registered when [mas.js](mas.js.html) or [merch-card](merch-card.html) loads.

See also: [merch-card](merch-card.html), [Special Offer Gallery](specialoffer.html), [Plans Gallery](plans.html), [merch-offer-select](merch-offer-select.html).

## Example {#example}

Standalone badge using a plans color token. The `background-color` value is a CSS custom property name (without the `--` prefix); the component resolves it as `var(--<token>)`.

```html {.demo .light}
<merch-badge background-color="spectrum-yellow-300-plans" color="#000000">
  Best value
</merch-badge>
```

Badge with a Spectrum icon. Values starting with `sp-icon-` render as custom elements; any other `icon` value is treated as an image URL.

```html {.demo .light}
<merch-badge
  background-color="spectrum-green-900-plans"
  color="#FFFFFF"
  icon="sp-icon-checkmark-circle"
>
  Save 40%
</merch-badge>
```

## On merch-card {#on-merch-card}

### Attribute-based badge {#attribute-based}

Set badge attributes on `merch-card`. The variant layout's `badge` getter renders a styled `<div id="badge">` in shadow DOM. [merch-offer-select](merch-offer-select.html) copies the selected offer's `badge-text` onto these attributes at runtime.

```html {.demo .light}
<merch-card
  variant="plans"
  badge-color="#000000"
  badge-background-color="#EDCC2D"
  badge-text="Recommended"
>
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs"><p>Access advanced PDF tools.</p></div>
  <div slot="footer">
    <a href="#" class="con-button blue">Buy now</a>
  </div>
</merch-card>
```

### Slot-based badge {#slot-based}

Place `merch-badge` in the card's `badge` slot. Match `background-color` to the card's `border-color` token so the badge border aligns with the card outline.

```html {.demo .light}
<merch-card
  variant="special-offers"
  border-color="spectrum-green-900-special-offers"
>
  <merch-badge
    slot="badge"
    background-color="spectrum-green-900-special-offers"
  >
    <span>Save 40%</span>
  </merch-badge>
  <h4 slot="detail-m">INDIVIDUALS</h4>
  <h3 slot="heading-xs">Green badge card</h3>
  <div slot="body-xs"><p>Badge with green highlight.</p></div>
  <div slot="footer">
    <a href="#" class="con-button blue">Buy now</a>
  </div>
</merch-card>
```

### Trial badge {#trial-badge}

Some variants expose a separate `trial-badge` slot for secondary labels (for example "Free trial" under the title). AEM hydration wraps `trialBadge` fragment fields the same way as `badge`, using `border-color` instead of `background-color`.

Variants with a `trial-badge` slot: `fries`, `full-pricing-express`, `simplified-pricing-express`, `headless`.

## Slot content {#slot-content}

| Content | Purpose |
| --- | --- |
| Default slot | Badge label text. Cleared on connect unless an `inline-price` span is present (see below). |
| `span[is="inline-price"]` | Dynamic price inside the badge. When present, light-DOM text is preserved so the slot can render settled pricing. Styled in `mini-compare-chart` and `mini-compare-chart-mweb` variants. |

## Attributes {#attributes}

| Attribute | Property | Description | Default | Reflects |
| --- | --- | --- | --- | --- |
| `background-color` | `backgroundColor` | CSS custom property name for fill (e.g. `spectrum-yellow-300-plans`, `gradient-purple-blue`). Resolved as `var(--<value>)`. Also used for the default border when `border-color` is absent or `transparent`. | `''` | yes |
| `border-color` | `borderColor` | CSS custom property name for border. When set and not `transparent`, overrides the background-derived border. Trial badges from AEM hydration use this attribute. | `''` | yes |
| `color` | `color` | Text color. Set as a literal value on `--merch-badge-color` (hex or any valid CSS color). | `''` | yes |
| `icon` | `icon` | Leading icon. `sp-icon-*` names render as Spectrum icon elements; other values render as `<img src="...">`. | `''` | yes |
| `variant` | `variant` | Card variant string. Set by AEM hydration (`processBadge`, `processTrialBadge`); not read by the component stylesheet. | `''` | yes |

## background-color tokens {#background-color-tokens}

Token names must match CSS custom properties defined in `global.css.js`. Variant mappings restrict AEM authoring via `allowedBadgeColors`.

| Token family | Example values | White text override |
| --- | --- | --- |
| Plans | `spectrum-yellow-300-plans`, `spectrum-gray-300-plans`, `spectrum-gray-700-plans`, `spectrum-green-900-plans`, `spectrum-red-700-plans` | `spectrum-red-700-plans` |
| Special offers | `spectrum-yellow-300-special-offers`, `spectrum-gray-300-special-offers`, `spectrum-green-900-special-offers` | `spectrum-green-900-special-offers` |
| Segment | `color-yellow-300-variation`, `color-green-900-variation`, `color-gray-300-variation`, `color-gray-700-variation`, `color-red-700-variation` | — |
| Express | `spectrum-blue-400`, `spectrum-gray-300`, `spectrum-yellow-300`, `gradient-purple-blue`, `gradient-firefly-spectrum` | — |
| Adobe Home | `fuchsia` | — |

Gradient tokens (`gradient-*`) use slightly larger padding (`3px 11px 4px 11px` vs `2px 10px 3px 10px`) and skip the background-derived border.

## AEM hydration {#aem-hydration}

`processBadge()` in `hydrate.js` handles the fragment `badge` field:

| Variant mapping | Behavior |
| --- | --- |
| `badge.slot` defined | Plain-text badge values are wrapped in `<merch-badge variant="…" background-color="…" border-color="…">`. Default background is `#F8D904`; when the mapping `badge.default` is in `allowedBadgeColors` and no `borderColor` is set, the default token is also applied as `border-color`. |
| No `badge.slot` | Sets `badge-text`, `badge-color` (default `#000000`), and `badge-background-color` on `merch-card`. Also mirrors background onto `border-color`. |

`processTrialBadge()` wraps `trialBadge` fields in `<merch-badge>` with `border-color` (default `#31A547`) and appends to the `trial-badge` slot.

Pre-authored `<merch-badge>` markup in fragment fields is passed through unchanged.

## CSS custom properties {#css-custom-properties}

Set on the host in `connectedCallback()` from attributes and parent card context:

| Property | Source | Purpose |
| --- | --- | --- |
| `--merch-badge-background-color` | `background-color` attribute → `var(--<token>)` | Fill |
| `--merch-badge-color` | `color` attribute | Text color (fallback `#000`) |
| `--merch-badge-border` | `border-color` or `background-color` | `1px solid var(--<token>)` |
| `--merch-badge-padding` | Gradient vs solid background | Inner spacing |
| `--merch-badge-font-size` | Fixed | `var(--consonant-merch-card-body-xs-font-size)` |
| `--merch-badge-border-radius` | `global.css.js` | `4px 0 0 4px` (LTR); flipped in RTL |
| `--merch-badge-offset` | Parent `merch-icon` count | Icon spacing adjustment on plans cards |
| `--merch-badge-with-offset` | `1` when offset > 0, else `0` | Used in max-width calc |
| `--merch-badge-card-size` | `2` when parent has `size` attribute, else `1` | Used in max-width calc |

Variant styles (for example `plans.css.js`) use the offset and card-size variables to cap badge width when icons are present.

## Variant placement {#variant-placement}

| Card variant | Badge mechanism | Slot |
| --- | --- | --- |
| `plans`, `plans-v2`, `plans-education`, `plans-students` | Attribute-based shadow `#badge` and/or slotted `merch-badge` | `badge` |
| `product`, `segment`, `catalog`, `commerce`, `image` | Attribute-based and/or slotted | `badge` |
| `mini-compare-chart`, `mini-compare-chart-mweb` | Attribute-based and/or slotted; supports `inline-price` in badge | `badge` |
| `special-offers` | Slotted `merch-badge` on image overlay; attribute-based `#badge` in `cardImage` | `badge` |
| `simplified-pricing-express`, `full-pricing-express` | Slotted only (no attribute shadow badge) | `badge`, `trial-badge` |
| `fries`, `headless` | Slotted only | `badge`, `trial-badge` |
| `ah-try-buy-widget` | Slotted only | `badge` |

## Bundle {#bundle}

Import via [mas.js](mas.js.html) (recommended for `merch-card` pages). `merch-badge` is registered when `merch-card` or `mas.js` loads; there is no separate bundle entry.
