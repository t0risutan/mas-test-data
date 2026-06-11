<script type="module" src="../dist/mas.js"></script>

# merch-offer-select {#merch-offer-select}

## Introduction {#introduction}

`merch-offer-select` and its child `merch-offer` elements implement multi-offer selection inside a parent container (typically `merch-card`). Each `merch-offer` bundles an [inline-price](inline-price.html), [checkout-link](checkout-link.html), and optional per-offer copy. When the shopper picks an offer, the select component copies the active offer's slotted content into matching slots on the container — updating price, CTAs, description, and badge without re-fetching the card fragment.

Used in `plans`, `product`, `mini-compare-chart`, and `mini-compare-chart-mweb` card variants. When nested inside `merch-quantity-select`, offer selection is driven by quantity instead of radio clicks.

Requires an active [mas-commerce-service](mas-commerce-service.html).

See also: [merch-card](merch-card.html), [Plans Gallery](plans.html), [Product Gallery](product.html), [Mini Compare Gallery](minicompare.html).

## Example {#example}

```html {.demo .light}
<merch-card variant="plans" badge-text="Recommended">
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs">
    <p slot="description">Access advanced PDF.</p>
    <h4><span slot="price"></span></h4>
    <merch-offer-select container="merch-card">
      <merch-offer text="Annual, monthly payment">
        <span
          slot="price"
          is="inline-price"
          data-display-recurrence="true"
          data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
        ></span>
        <a
          slot="cta"
          is="checkout-link"
          href="#"
          class="con-button blue"
          data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
          >Buy now</a
        >
      </merch-offer>
      <merch-offer text="Annual, one-time payment" badge-text="Only today!">
        <span
          slot="price"
          is="inline-price"
          data-display-recurrence="true"
          data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
        ></span>
        <a
          slot="cta"
          is="checkout-link"
          href="#"
          class="con-button blue"
          data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
          >Buy now</a
        >
        <p slot="description">New description text.</p>
      </merch-offer>
    </merch-offer-select>
  </div>
  <div slot="footer">
    <a slot="cta"></a>
  </div>
</merch-card>
```

Place empty placeholder elements (`span[slot="price"]`, `a[slot="cta"]`, and so on) on the container for each slot the select should update. The first `merch-offer` is selected on load.

## merch-offer-select attributes {#attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `container` | Tag name passed to `Element.closest()` to find the parent whose slots are updated (e.g. `merch-card`). Required for slot syncing. | — | no |
| `variant` | Layout class applied to the default slot. `plans` (default) stacks offers vertically; `horizontal` lays them out in a row; `subscription-options` applies a column flex layout with spacing. | `plans` | yes |
| `plan-type` | Plan type of the currently selected offer. Set automatically after offers initialize; also set on each selection. | — | yes |
| `stock` | Boolean attribute defined on the element. Not read by component logic. | `false` | yes |

## merch-offer attributes {#merch-offer-attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `text` | Label shown for `type="radio"` offers. | — | no |
| `type` | Render mode: `radio` (default) shows a radio control with `text`; `subscription-option` renders commitment/price/teaser/condition slots as a selectable card. | `radio` | yes |
| `badge-text` | Per-offer badge override for the container. Empty string removes the badge; omitting the attribute restores the container default. | — | no |
| `value` | Numeric threshold used when nested in `merch-quantity-select` to map quantity values to offers (see [Quantity mode](#quantity-mode)). | — | no |
| `plan-type` | Set automatically from the resolved WCS offer after the inline price settles. | — | yes |
| `aria-selected` | Reflects selection state (`selected` property). Managed by `merch-offer-select`. | `false` | yes |

## Slots {#slots}

### Container slots updated by merch-offer-select {#container-slots}

`merch-offer-select` clones content from the selected `merch-offer` into the nearest `container` element. Only direct container children are targeted — elements inside a `merch-offer` are excluded.

| Slot | Updated | Notes |
| --- | --- | --- |
| `price` | yes | Replaced with the selected offer's `inline-price` |
| `cta` | yes | Replaced with the selected offer's checkout link |
| `secondary-cta` | yes | Replaced when the offer provides one |
| `description` | yes | Skipped when inside `merch-quantity-select` |
| badge | via property | Container `badgeText` is set from offer `badge-text`, or restored from saved defaults |

### merch-offer child slots {#merch-offer-slots}

| Slot | Used when | Purpose |
| --- | --- | --- |
| `price` | always | Required. `inline-price` element; triggers offer initialization |
| `cta` | always | Primary checkout link copied to the container |
| `secondary-cta` | optional | Secondary checkout link (e.g. free trial) |
| `description` | optional | Per-offer description text |
| `commitment` | `type="subscription-option"` | Commitment label |
| `teaser` | `type="subscription-option"` | Promotional teaser line |
| `condition` | `type="subscription-option"` | Condition text with info tooltip |
| `condition-tooltip` | `type="subscription-option"` | Tooltip content for the condition info icon |

On connect, `merch-offer` assigns `slot="price"` to every `inline-price` descendant (except strikethrough templates) before waiting for price resolution.

## Events {#events}

Events fire in this order during initialization:

1. Each `merch-offer` dispatches `merch-offer:ready` after its inline price settles and `plan-type` is set.
2. When every child `merch-offer` has a `plan-type`, `merch-offer-select` performs the initial selection and dispatches `merch-offer-select:ready`.
3. On every subsequent selection change, `merch-offer-select` dispatches `merch-offer:selected`.

| Event | Target | Bubbles | `detail` | Description |
| --- | --- | --- | --- | --- |
| `merch-offer:ready` | `merch-offer` | yes | — | Inline price resolved; `plan-type` attribute set from WCS offer data. |
| `merch-offer-select:ready` | `merch-offer-select` | yes | — | All offers initialized; initial offer selected and container slots updated. |
| `merch-offer:selected` | `merch-offer-select` | yes | `merch-offer-select` element | Fired after each `selectOffer()` call, including the initial auto-selection. |

`merch-card` listens for `merch-offer-select:ready` to finalize footer layout (for example, stacking CTAs in the `product` variant).

## Selection behavior {#selection}

On `connectedCallback`, `merch-offer-select`:

1. Collects child `merch-offer` elements into its `offers` array.
2. Saves the container's default `description` and `badgeText` (unless in quantity mode).
3. Sets `selectedOffer` to the first offer.
4. Listens for `focusin` and `click` — when the target is a `merch-offer`, calls `selectOffer()` on that element.

`selectOffer()` marks the previous offer deselected, sets `aria-selected` on the new offer, copies slotted content into the container, and dispatches `merch-offer:selected`.

### Horizontal variant {#horizontal}

Set `variant="horizontal"` to lay out radio offers in a row. Supports multiple CTAs per offer (`cta` and `secondary-cta`), as used in storage-picker patterns on `mini-compare-chart` cards (`offers` slot).

### Subscription options variant {#subscription-options}

Set `variant="subscription-options"` on `merch-offer-select` and `type="subscription-option"` on each `merch-offer` to render card-style subscription choices with commitment, price, teaser, and condition slots instead of radio buttons.

## Quantity mode {#quantity-mode}

When `merch-offer-select` is a descendant of `merch-quantity-select`:

- Container default values are not saved.
- Description and badge are not updated on selection.
- The select listens for `merch-quantity-selector:change` instead of click/focus selection.
- `findAppropriateOffer()` maps the quantity to an offer by comparing the `value` attribute on each `merch-offer`. If no exact match exists, the nearest lower `value` is used.
- The container `cta` element receives `data-quantity` matching the selected quantity.

See [merch-quantity-select](merch-quantity-select.html) for the quantity-picker integration.

## Variant placement {#variant-placement}

| Card variant | Typical slot | `variant` attribute |
| --- | --- | --- |
| `plans` | `body-xs` or `quantity-select` | `plans` (default) or `horizontal` |
| `product` | `quantity-select` | `plans` (default) |
| `mini-compare-chart` | `offers` | `horizontal` |
| `mini-compare-chart-mweb` | `body-xs` or `offers` | `plans` (default) or `horizontal` |

AEM hydration creates the `quantity-select` slot wrapper for `plans` and `product` variants when the fragment field is present (`quantitySelect` in `PLANS_AEM_FRAGMENT_MAPPING` / `PRODUCT_AEM_FRAGMENT_MAPPING`). Offer markup inside that slot is authored in the card fragment.

## Bundle {#bundle}

Import both elements via [mas.js](mas.js.html) or the standalone bundle:

```html
<script type="module" src="../dist/merch-offer-select.js"></script>
```

The standalone bundle contains `merch-offer` and `merch-offer-select` only. Use `mas.js` when the container is a full `merch-card`.
