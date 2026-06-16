<script type="module" src="../dist/mas.js"></script>

# merch-stock {#merch-stock}

## Introduction {#introduction}

`merch-stock` is a Spectrum checkbox for optional Adobe Stock trial offers. The default slot holds label copy; slotted `<div data-plan-type>` blocks carry plan-specific pricing via `inline-price`. Only the block matching the host `plan-type` (`PUF`, `ABM`, or `M2M`) is visible.

The element is built and exported as a standalone bundle, but **no `merch-card` variant uses it today**. `plans` and `plans-v2` render stock UI from `merch-card` attributes `checkbox-label` and `stock-offer-osis` instead — a native checkbox in `#stock-checkbox` wired to `toggleStockOffer()`. See [Stock toggle on merch-card](merch-card.html#stock-toggle).

Use `merch-stock` when you need a Spectrum checkbox with plan-filtered slot content **outside** the built-in plans card stock row. Use the `merch-card` attributes when authoring standard plans or plans-v2 cards.

Requires an active [mas-commerce-service](mas-commerce-service.html) when slotted prices use `inline-price`.

See also: [merch-card — Stock toggle](merch-card.html#stock-toggle), [Plans v2 — Stock toggle](plans-v2.html#stock-toggle), [merch-addon](merch-addon.html) (similar plan-type slot filtering).

## Example {#example}

Standalone stock checkbox with plan-specific pricing. Set `plan-type` to switch which `<div data-plan-type>` block is shown.

```html {.demo .light}
<mas-commerce-service env="stage"></mas-commerce-service>
<merch-stock plan-type="PUF">
  Add a 30-day free trial of Adobe Stock for
  <div data-plan-type="">
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="stock-puf-osi"
    ></span>
  </div>
  <div data-plan-type="">
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="stock-abm-osi"
    ></span>
  </div>
  <div data-plan-type="">
    <span
      is="inline-price"
      data-template="price"
      data-wcs-osi="stock-m2m-osi"
    ></span>
  </div>
</merch-stock>
```

## On merch-card {#on-merch-card}

Stock trial UI on `plans` and `plans-v2` cards does **not** use `merch-stock`. When `checkbox-label` is set on `merch-card`, the variant layout renders `#stock-checkbox` in the card body and calls `toggleStockOffer()` to append or remove OSIs from footer checkout links via `stock-offer-osis`.

```html {.demo .light}
<mas-commerce-service env="stage"></mas-commerce-service>
<merch-card
  variant="plans-v2"
  checkbox-label="Add a 30-day free trial of Adobe Stock.*"
  stock-offer-osis="stock-puf,stock-abm,stock-m2m"
>
  <h4 slot="heading-xs">Creative Cloud Pro</h4>
  <div slot="body-xs">
    <p slot="description">Apps for photography, design, and video.</p>
    <h4>
      <span
        slot="price"
        is="inline-price"
        data-display-recurrence="true"
        data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
      ></span>
    </h4>
  </div>
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

`toggleStockOffer()` does not listen for `merch-stock:change`. Integrations that place `merch-stock` in custom markup must wire checkout OSI updates themselves (for example by reading the `osi` getter on toggle).

## Slot content {#slot-content}

| Content | Purpose |
| --- | --- |
| Default slot | Checkbox label text and elements outside plan-specific blocks. |
| `<div data-plan-type>` | Plan-specific copy and pricing. Hidden by default; shown when host `plan-type` matches `PUF`, `ABM`, or `M2M`. |
| `span[is="inline-price"]` inside `<div data-plan-type>` | Stock offer price for that plan. Used by the `osi` getter and by `connectedCallback` to set `data-plan-type` on the parent `<div>`. |

On connect, after `updateComplete`, the component finds each slotted `inline-price`, awaits `onceSettled()`, and copies `value[0].planType` onto the parent element's `data-plan-type` attribute.

## Attributes {#attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `plan-type` | Active billing plan (`PUF`, `ABM`, or `M2M`). Required — the host is `display: none` without it, and only the matching slotted `<div data-plan-type>` is shown. | — | yes |
| `checked` | Whether the stock trial is selected. | `false` | yes |

## Events {#events}

| Event | Target | Bubbles | `detail` | Description |
| --- | --- | --- | --- | --- |
| `merch-stock:change` | `merch-stock` | yes | `{ checked: boolean, planType: string }` | Fired when the shopper toggles the Spectrum checkbox (`sp-checkbox` `@change`). |

No `merch-card` listener handles this event in the current codebase.

## osi getter {#osi-getter}

When `checked` is `true`, returns the first `offerSelectorIds[0]` from the slotted `inline-price` inside `div[data-plan-type="${planType}"]` matching the host `plan-type`. Returns `undefined` when unchecked or when no matching price is found.

Unlike `merch-card.toggleStockOffer()`, this getter does not mutate checkout link `data-wcs-osi` attributes.

## Visibility {#visibility}

| Condition | Behavior |
| --- | --- |
| `plan-type` not set | Host hidden (`display: none`). |
| Viewport `max-width: 767px` (`MOBILE_LANDSCAPE`) | `render()` returns nothing — no checkbox is shown. |
| `plan-type` set, desktop viewport | Renders `sp-checkbox` (size `s`) with default slot content. |

## Bundle {#bundle}

`merch-stock` is **not** registered by [mas.js](mas.js.html). Load the standalone bundle:

```html
<script type="module" src="../dist/merch-stock.js"></script>
```

Import `mas.js` (or `inline-price` dependencies) when slotted prices need WCS resolution.
