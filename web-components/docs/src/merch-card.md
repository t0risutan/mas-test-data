# merch-card

## merch-card

### What it does

`<merch-card>` is a Lit-based web component that renders merchandising card layouts for acom, CCD, Adobe Home, and Express surfaces.

Cards can be authored two ways:

1. **Fragment-driven** — nest an `<aem-fragment>`; the card hydrates markup from fragment data and resolves nested `inline-price` / checkout elements.
2. **Static markup** — set `variant` and provide slotted content directly.

The component registers price and checkout option providers so fragment-level promotion codes and tax defaults propagate to child placeholders. CTAs require Spectrum or Consonant CSS from the consumer.

Design references: [ACOM Figma](https://www.figma.com/design/tiEUQLJ1hVlosqwzAATVXZ/Cards-(Merch)?node-id=1086-17994), [M@S Frameworks](https://www.figma.com/design/7tUtNgFelfMjgPoJ5QcE1k/Merch%40Scale-Frameworks?node-id=2081-22654).

### Attributes / Props

| Attribute / property | Description | Default | Required |
| --- | --- | --- | --- |
| `variant` | Layout variant name. Optional when using `aem-fragment` (inferred from fragment). | — | no |
| `size` | Grid width: `wide`, `super-wide`. | — | no |
| `consonant` | Use Consonant CTA styles during fragment hydration. | `false` | no |
| `spectrum` | Spectrum CTA technology: `css` or `swc`. | `css` | no |
| `daa-lh` | Card analytics id (for example product code). | — | no |
| `badge-text` | Badge label text. | — | no |
| `badge-color` | Badge text color. | — | no |
| `badge-background-color` | Badge background color. | — | no |
| `border-color` | Card border color. | — | no |
| `background-color` | Card background color. | — | no |
| `background-image` | Card background image URL. | — | no |
| `action-menu` | Enable action menu UI. | `false` | no |
| `action-menu-label` | Accessible label for action menu. | — | no |
| `custom-hr` | Render custom horizontal rule. | `false` | no |
| `detail-bg` | Detail section background token/color. | — | no |
| `secure-label` | Secure transaction label text. | — | no |
| `checkbox-label` | Checkbox label (plans variants). | — | no |
| `addon-title` | Addon section title. | — | no |
| `addon-offers` | Addon offer configuration object. | — | no |
| `aria-selected` / `selected` | Selection state for selectable cards. | `false` | no |
| `storage` | Storage option filter value. | — | no |
| `plan-type` | Plan type filter value. | — | no |
| `height-sync` | Enable height synchronization (express variants). | — | no |
| `stock-offer-osis` | Comma-separated PUF,ABM,M2M OSIs for stock display. | — | no |
| `filters` | Collection filter metadata (`key:order:size,...`). | — | no |
| `types` | Card type tags for collection filtering. | — | no |
| `failed` | Read-only failure state (reflected). | `false` | — |
| `title`, `prices`, `ctas`, … (properties) | Populated after hydration with resolved price/CTA references. See existing card runtime API below. | — | — |

**Registered variants** (`variants/variants.js` + `mas.js`):

| Variant | Source file |
| --- | --- |
| `catalog` | `variants/catalog.js` |
| `image` | `variants/image.js` |
| `inline-heading` | `variants/inline-heading.js` |
| `mini-compare-chart` | `variants/mini-compare-chart.js` |
| `mini-compare-chart-mweb` | `variants/mini-compare-chart-mweb.js` |
| `plans`, `plans-students`, `plans-education` | `variants/plans.js` |
| `plans-v2` | `variants/plans-v2.js` |
| `product` | `variants/product.js` |
| `segment` | `variants/segment.js` |
| `media` | `variants/media.js` |
| `special-offers` | `variants/special-offer.js` |
| `headless` | `variants/headless.js` |
| `mini` | `variants/mini.js` |
| `fries` | `variants/fries.js` |
| `simplified-pricing-express` | `variants/simplified-pricing-express.js` |
| `full-pricing-express` | `variants/full-pricing-express.js` |
| `ccd-slice` | `variants/ccd-slice.js` (via `mas.js`) |
| `ccd-suggested` | `variants/ccd-suggested.js` |
| `ah-try-buy-widget` | `variants/ah-try-buy-widget.js` |
| `ah-promoted-plans` | `variants/ah-promoted-plans.js` |

Gallery pages: [CCD](ccd.html), [Adobe Home](adobe-home.html), [Express](express.html), [Plans](plans.html).

**Runtime properties** (populated after `mas:ready`):

`title`, `prices`, `promoPrice`, `regularPrice`, `annualPrice`, `planTypeText`, `promotionCode`, `promoText`, `taxText`, `recurrenceText`, `unitText`, `seeTermsInfo`, `renewalText`, `promoDurationText`, `ctas`, `primaryCta`, `secondaryCta`.

### Events

Listen on a container **before** cards are appended — resolution can finish quickly.

| Event | Description |
| --- | --- |
| `mas:ready` | All prices and checkout elements resolved and rendered. `detail` includes fragment fetch info and timing. |
| `mas:error` | Fragment failure, unresolved offers, or load timeout (`MERCH_CARD_LOAD_TIMEOUT` = 20s). `detail` is an error message string. |
| `aem:load` | From nested `aem-fragment` when fragment data arrives. |
| `aem:error` | From nested `aem-fragment` on fetch/transform failure. |
| `mas:failed` | From child `inline-price` / checkout placeholders when WCS resolution fails. |

On `mas:ready` the card is fully interactive; on `mas:error` the `failed` attribute is set.

### Usage example

Fragment-driven card:

```html {.demo .light}
<merch-card id="card1">
    <aem-fragment
        id="fragment1"
        fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"
        title="CCD Slice Creative Cloud Photography"
    ></aem-fragment>
</merch-card>

<script type="module">
    const target = document.getElementById('log1');
    document.getElementById('card1').addEventListener('mas:ready', (e) => {
        log(target, 'merch-card ready:', e.target.variant);
    });
</script>
```

#### Logs

```html {#log1}

```

Static markup with dynamic pricing:

```html {.demo .light}
<merch-card variant="plans" badge-text="Best value">
  <merch-icon slot="icons" size="l" src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg" alt="Creative Cloud All Apps"></merch-icon>
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <h3 slot="heading-m">
      <span is="inline-price"
          data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
  </h3>
  <div slot="footer">
      <a is="checkout-link" href="#" class="con-button blue active"
          data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8">Save now</a>
  </div>
</merch-card>
```

Spectrum SWC buttons (`spectrum="swc"`):

```html {.demo .light}
<merch-card spectrum="swc">
    <aem-fragment fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"></aem-fragment>
</merch-card>
```

When using `swc`, checkout clicks on `sp-button` expose the underlying checkout element at `event.target.source`.

### Notes

- **Checkout click interception on the card** requires `{ capture: true }` when using `checkout-button` descendants (same as standalone checkout-button).
- Fragment-hosted cards automatically enable `mas-ff-defaults` behavior for child inline-prices via the registered price provider.
- Error flow: `aem:error` on fragment → card `#fail()` → `mas:error` on card. WCS failures on placeholders emit `mas:failed`.
- Common `mas:error` causes: missing fragment id, fetch failure, offers not resolved within 20s, unresolved offers after render.
- Extend the default slot with additional UI; the fragment remains headless.
- Refresh all cards: `document.querySelector('mas-commerce-service').refreshFragments()`.
- Related undocumented components used inside variants: `merch-icon`, `merch-badge`, `merch-addon`, `merch-offer-select`, `merch-quantity-select`, `merch-stock`, `merch-card-collection`.
