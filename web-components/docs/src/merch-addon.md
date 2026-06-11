<script type="module" src="../dist/mas.js"></script>

# merch-addon {#merch-addon}

## Introduction {#introduction}

`merch-addon` is a checkbox control for optional add-on offers. The default slot holds label copy and one or more `inline-price` elements — typically one `<p data-plan-type>` block per billing plan (PUF, ABM, M2M). Only the paragraph matching the active `plan-type` is visible.

Used in `plans`, `plans-v2`, `product`, `mini-compare-chart`, and `mini-compare-chart-mweb` card variants in the `addon` slot. When the shopper toggles the checkbox, `merch-card` mutates checkout link OSIs via `getOsi()`.

Requires an active [mas-commerce-service](mas-commerce-service.html) when slotted prices use `inline-price`.

See also: [merch-card](merch-card.html#addon-checkout), [Plans Gallery](plans.html), [Product Gallery](product.html), [Mini Compare Gallery](minicompare.html).

## Example {#example}

Standalone add-on with plan-specific pricing. Set `plan-type` to switch which price paragraph is shown.

```html {.demo .light}
<mas-commerce-service env="stage"></mas-commerce-service>
<merch-addon plan-type="PUF" custom-checkbox checked>
  <p><strong>Acrobat AI Assistant</strong></p>
  <p data-plan-type="">
    Add AI Assistant to your free Reader app for
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="puf-team"
    ></span>
  </p>
  <p data-plan-type="">
    Add AI Assistant to your free Reader app for
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="abm"
    ></span>
  </p>
  <p data-plan-type="">
    Add AI Assistant to your free Reader app for
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="m2m"
    ></span>
  </p>
</merch-addon>
```

## On merch-card {#on-merch-card}

On a `plans` card, the add-on sits in the `addon` slot. After hydration, the variant layout calls `adjustAddon()` to set `custom-checkbox` and copy the main price's resolved `planType` onto the element. Toggling the checkbox fires `change`; `merch-card` adds or removes the add-on OSI from every checkout link.

```html {.demo .light}
<mas-commerce-service env="stage"></mas-commerce-service>
<merch-card variant="plans" badge-text="Recommended">
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs">
    <p slot="description">Access advanced PDF tools.</p>
    <h4>
      <span
        slot="price"
        is="inline-price"
        data-display-recurrence="true"
        data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
      ></span>
    </h4>
  </div>
  <merch-addon slot="addon">
    <p><strong>Acrobat AI Assistant</strong></p>
    <p data-plan-type="">
      Add AI Assistant for
      <span
        is="inline-price"
        data-template="price"
        data-wcs-osi="addon-abm-osi"
      ></span>
    </p>
  </merch-addon>
  <div slot="footer">
    <a
      slot="cta"
      is="checkout-link"
      href="#"
      class="con-button blue"
      data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
      >Buy now</a
    >
  </div>
</merch-card>
```

## Slot content {#slot-content}

| Content | Purpose |
| --- | --- |
| Default slot | Checkbox label. Any element; `<p>` nodes receive label styling via CSS custom properties. |
| `<p data-plan-type>` | Plan-specific copy and pricing. Hidden by default; shown when `plan-type` on the host matches `PUF`, `ABM`, or `M2M`. |
| `span[is="inline-price"]` inside `<p data-plan-type>` | Add-on price for that plan. Used by `getOsi()` and by `updatePlanType()` when prices settle. |

During AEM hydration (`processAddon()` in `hydrate.js`), each `inline-price` inside the add-on field is wrapped in a `<p data-plan-type="">`. When the price resolves, `updatePlanType()` sets `data-offer-type` on the span and `data-plan-type` on the parent `<p>` from the settled offer.

`span[data-offer-type="TRIAL"]` prices are hidden globally (`global.css.js`).

## Attributes {#attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `plan-type` | Active billing plan (`PUF`, `ABM`, or `M2M`). Controls which `<p data-plan-type>` paragraph is visible. Set by variant `adjustAddon()` from the main card price, or authored directly. | — | yes |
| `custom-checkbox` | When present, hides the native checkbox and shows a styled span (keyboard-accessible via Space). Set automatically by `plans`, `plans-v2`, and `plans-education` layouts after hydration. | — | yes |
| `checked` | Whether the add-on is selected. | `false` | yes |

## Events {#events}

| Event | Target | Bubbles | `detail` | Description |
| --- | --- | --- | --- | --- |
| `change` | `merch-addon` | yes | `{ checked: boolean }` | Fired when the shopper toggles the checkbox (native `change` or custom checkbox click/Space). |

### Listeners on parent merch-card {#merch-card-listeners}

`merch-card` listens for bubbling `change` events from slotted `merch-addon` and calls `toggleAddon()`. That method:

1. Invokes the variant layout's `toggleAddon()` hook when defined (`product` and `mini-compare-chart` swap heading price between free and add-on pricing when no main price is present).
2. Reads `planType` and `offerType` from each settled checkout link, calls `merchAddon.getOsi(planType, offerType)`, and adds or removes that OSI from `data-wcs-osi` based on `checked`.

See [merch-card — Addon checkout mutation](merch-card.html#addon-checkout).

`handleAddonAndQuantityUpdate()` can sync `checked` when a modal checkout returns updated line items (`merch-modal:addon-and-quantity-update`).

## getOsi(planType, offerType) {#get-osi}

Public method used by `merch-card.toggleAddon()` to find the add-on WCS OSI for the shopper's current offer.

Given `planType` and `offerType` from a checkout link's settled value, the method queries slotted `inline-price` elements inside `<p data-plan-type="${planType}">` and returns the first matching `data-wcs-osi`.

Offer-type lookup uses a priority fallback:

| `offerType` argument | Search order |
| --- | --- |
| `TRIAL` | `TRIAL` |
| `BASE` | `BASE`, then `PROMOTION`, then `TRIAL` |
| `PROMOTION` | `PROMOTION`, then `BASE`, then `TRIAL` |
| Other | `[offerType]` only |

Each candidate selector is `p[data-plan-type="${planType}"] span[is="inline-price"][data-offer-type="${type}"]`. Returns `undefined` when no match is found.

## Plan type sync {#plan-type-sync}

On `mas:resolved` (from child `inline-price` elements), `updatePlanType()` runs when the event target is a `SPAN`. It copies `offer.offerType` onto the price span's `data-offer-type` and `offer.planType` onto the parent `<p>`'s `data-plan-type`.

After card hydration, variant layouts call `adjustAddon()`:

| Variant | Behavior |
| --- | --- |
| `plans`, `plans-v2`, `plans-education` | Sets `custom-checkbox`; copies `planType` from settled main price. |
| `product`, `mini-compare-chart`, `mini-compare-chart-mweb` | Copies `planType` from settled main price, or falls back to `merch-card` `plan-type` when the price has not settled. |

## CSS custom properties {#css-custom-properties}

Variant styles set these on `merch-addon` (defaults shown from the component stylesheet):

| Property | Default | Purpose |
| --- | --- | --- |
| `--merch-addon-gap` | `9px` | Flex gap between checkbox and label |
| `--merch-addon-align` | `start` | Flex cross-axis alignment |
| `--merch-addon-checkbox-size` | `unset` | Custom checkbox dimensions |
| `--merch-addon-checkbox-border` | `unset` | Custom checkbox border |
| `--merch-addon-checkbox-radius` | `unset` | Custom checkbox border radius |
| `--merch-addon-checkbox-checked-bg` | `unset` | Checked-state background (often a checkmark icon) |
| `--merch-addon-checkbox-checked-color` | `unset` | Checked-state border/background color |
| `--merch-addon-label-size` | `unset` | Slotted `<p>` font size |
| `--merch-addon-label-color` | `unset` | Slotted `<p>` text color |
| `--merch-addon-label-line-height` | `unset` | Slotted `<p>` line height |

## Variant placement {#variant-placement}

| Card variant | Slot | Notes |
| --- | --- | --- |
| `plans`, `plans-education`, `plans-students` | `addon` | Moves to footer on `super-wide` cards at desktop widths |
| `plans-v2` | `addon` | Rendered in body or footer depending on layout branch |
| `product` | `addon` | Above footer; `toggleAddon()` can swap heading price |
| `mini-compare-chart`, `mini-compare-chart-mweb` | `addon` | Below offer row; `toggleAddon()` can swap `heading-m-price` |

AEM hydration creates the element from the fragment `addon` field (or `settings.addon` fallback) via `processAddon()`. The field value `"disabled"` skips add-on creation.

## Bundle {#bundle}

Import via [mas.js](mas.js.html) (recommended for `merch-card` pages). `merch-addon` is registered when `merch-card` or `mas.js` loads; there is no separate bundle entry.
