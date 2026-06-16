<script type="module" src="../dist/mas.js"></script>

# merch-quantity-select {#merch-quantity-select}

## Introduction {#introduction}

`merch-quantity-select` is a combobox-style quantity picker: a labeled text field, dropdown list, and optional light-DOM children (typically `merch-offer-select`). Shoppers pick a license count from preset steps between `min` and `max`, type a custom value, or open the menu with the picker button.

Used in `plans`, `plans-v2`, `product`, `mini-compare-chart`, and `mini-compare-chart-mweb` card variants inside the `quantity-select` slot (or `offers` on mini-compare). When nested `merch-offer-select` is present, quantity changes drive offer selection instead of radio clicks — see [merch-offer-select quantity mode](merch-offer-select.html#quantity-mode).

Requires an active [mas-commerce-service](mas-commerce-service.html) when paired with priced offers.

See also: [merch-card](merch-card.html), [merch-offer-select](merch-offer-select.html), [Plans Gallery](plans.html), [Product Gallery](product.html).

## Example {#example}

Standalone quantity picker on a `plans` card. `merch-card` copies the selected value onto checkout links when `merch-quantity-selector:change` fires.

```html {.demo .light}
<merch-card variant="plans" badge-text="Recommended">
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs">
    <p slot="description">Access advanced PDF.</p>
    <h4><span slot="price"></span></h4>
  </div>
  <div slot="quantity-select">
    <merch-quantity-select
      title="Select a quantity"
      min="1"
      max="10"
      step="1"
      default-value="2"
    ></merch-quantity-select>
  </div>
  <div slot="footer">
    <a
      slot="cta"
      is="checkout-link"
      href="#"
      class="con-button blue"
      data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
      data-quantity="2"
      >Buy now</a
    >
  </div>
</merch-card>
```

## With merch-offer-select {#with-offer-select}

Nest `merch-offer-select` as a child. Each `merch-offer` uses a `value` attribute as the quantity threshold. On quantity change, the select picks the matching offer (or the nearest lower threshold) and sets `data-quantity` on the active CTA.

```html {.demo .light}
<merch-card variant="plans" badge-text="Recommended">
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs">
    <p slot="description">Access advanced PDF.</p>
    <h4><span slot="price"></span></h4>
  </div>
  <div slot="quantity-select">
    <merch-quantity-select title="Select a quantity" min="1" max="3" step="1">
      <merch-offer-select container="merch-card">
        <merch-offer value="1">
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
            data-quantity="1"
            >Buy now</a
          >
        </merch-offer>
        <merch-offer value="3">
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
            data-quantity="3"
            >Buy now</a
          >
        </merch-offer>
      </merch-offer-select>
    </merch-quantity-select>
  </div>
  <div slot="footer">
    <a slot="cta"></a>
  </div>
</merch-card>
```

## Attributes {#attributes}

The element renders nothing until at least one of `title`, `min`, or `step` is set (`configured` getter).

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `title` | Label shown above the input. | `''` | no |
| `min` | Lowest quantity in the preset list. Also used as the floor when the shopper types a value. | `0` | no |
| `max` | Highest preset quantity. The list option for this value is labeled `max+` and focuses the text field so the shopper can type a higher count. | `0` | no |
| `step` | Increment between preset options. Must be `> 0` for options to be generated. | `0` | no |
| `default-value` | Initial selection. Must appear on the `min`–`max` step ladder; otherwise the first option (`min`) is used. | — | yes |
| `max-input` | Upper bound for typed quantities. Values above this are clamped on keyup (debounced 500 ms). | — | no |
| `closed` | Whether the dropdown is closed. Toggled by the picker button and keyboard interaction. | `true` | yes |

When `min`, `max`, `step`, or `default-value` change, the component rebuilds the options array (`min` to `max` by `step`) and re-applies the resolved default.

## Events {#events}

| Event | Target | Bubbles | `detail` | Description |
| --- | --- | --- | --- | --- |
| `merch-quantity-selector:change` | `merch-quantity-select` | yes | `{ option: number }` | Fired when the shopper selects a preset option, confirms with Enter/Tab/Space, or finishes typing (keyup debounced 500 ms). `option` is the numeric quantity. |

### Listeners on parent merch-card {#merch-card-listeners}

`merch-card` listens for `merch-quantity-selector:change` and sets `data-quantity` on every checkout link in the card (footer CTAs and active description links).

When `merch-offer-select` is nested inside `merch-quantity-select`, it also listens for this event to run quantity-based offer selection.

## merch-card-quantity:change sync {#card-quantity-sync}

`merch-quantity-select` listens for `merch-card-quantity:change` on itself (debounced 500 ms). When `detail.quantity` differs from the current value, it updates the input and re-dispatches `merch-quantity-selector:change`.

`merch-card` dispatches `merch-card-quantity:change` on its `merch-quantity-select` when it receives `merch-modal:addon-and-quantity-update` (`detail.id`, `detail.items`) and the main product quantity in the modal cart matches a checkout link on the card. This keeps the picker aligned when quantity is changed inside a checkout modal.

| Event | Direction | `detail` | Description |
| --- | --- | --- | --- |
| `merch-card-quantity:change` | `merch-card` → `merch-quantity-select` | `{ quantity: number }` | External quantity sync (modal cart). |
| `merch-quantity-selector:change` | `merch-quantity-select` → descendants / `merch-card` | `{ option: number }` | User-driven quantity change. |

## Keyboard and menu behavior {#keyboard}

- Arrow Down on the closed control opens the menu; Arrow Down/Up move the highlighted option while open.
- Enter, Space, or Tab confirm the highlighted option and close the menu.
- Escape closes the menu without changing the selection.
- Click outside closes the menu.
- The popover flips to `placement="top"` when it would overflow the viewport bottom.

Non-digit characters are stripped from typed input. Invalid or empty input reverts to the previous selection (or `min`, or `1`).

## Variant placement {#variant-placement}

| Card variant | Slot | Notes |
| --- | --- | --- |
| `plans`, `plans-v2` | `quantity-select` | Often wraps `merch-offer-select` for tiered pricing |
| `product` | `quantity-select` | License count above footer CTA |
| `mini-compare-chart`, `mini-compare-chart-mweb` | `offers` or `quantity-select` | Quantity above horizontal offer row |

AEM hydration appends the `quantity-select` slot wrapper when the fragment field `quantitySelect` is present (`PLANS_AEM_FRAGMENT_MAPPING`, `PLANS_V2_AEM_FRAGMENT_MAPPING`, `PRODUCT_AEM_FRAGMENT_MAPPING`). Fragment HTML is typically a serialized `<merch-quantity-select>` element with `min`, `max`, `step`, and `title`.

## Bundle {#bundle}

Import via [mas.js](mas.js.html) (recommended for `merch-card` pages) or the standalone bundle:

```html
<script type="module" src="../dist/merch-quantity-select.js"></script>
```

Standalone bundle includes `merch-quantity-select` only. Use `mas.js` when the picker is on a full card with checkout links and offer selection.
