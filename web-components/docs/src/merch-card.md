<script type="module" src="../../spectrum-web-components/dist/button.js"></script>

# merch-card

## merch-card

### What it does

Lit-based custom element (`<merch-card>`) that renders commerce card layouts for Adobe.com surfaces. It can hydrate from static markup or from an `aem-fragment` child, applies a **variant** layout class from `variants/variants.js`, registers price/checkout option providers on `mas-commerce-service`, and dispatches `mas:ready` when nested prices and checkout elements settle.

Variant-specific slots, styling, and AEM fragment field mappings live under `web-components/src/variants/`. Gallery pages document visual examples per variant.

### Attributes / Props

Lit reflected attributes (`merch-card.js` `static properties`):

| Attribute | Description |
| --- | --- |
| `variant` | Layout variant name (see list below). Often inferred from AEM fragment when omitted. |
| `size` | Grid width: `wide`, `super-wide`, etc. |
| `consonant` | Use Consonant footer CTA styles when hydrating from AEM. |
| `spectrum` | CTA technology: `css` (default) or `swc` (Spectrum Web Components buttons; checkout via `e.target.source`). |
| `badge-color`, `badge-background-color`, `badge-text` | Badge styling / copy. |
| `border-color`, `background-color`, `background-image` | Card chrome. |
| `action-menu`, `action-menu-label` | Action menu UI. |
| `custom-hr` | Custom horizontal rule. |
| `detail-bg`, `secure-label`, `checkbox-label` | Variant-specific UI copy/styling hooks. |
| `addon-title`, `addon-offers` | Addon block configuration. |
| `aria-selected` (`selected`) | Selection state for collections. |
| `storage`, `plan-type` | Storage/plan selectors (variant-dependent). |
| `height-sync` | Height synchronization for express pricing variants. |
| `stock-offer-osis` | Comma-separated PUF, ABM, M2M OSIs for stock UI. |
| `filters` | Collection filter encoding `key:order:size,...`. |
| `types` | Card types filter string. |
| `daa-lh` (`ANALYTICS_SECTION_ATTR`) | Analytics section id. |
| `loading` | Default `lazy` for intersection-driven updates. |
| `failed` | Set when card enters error state. |

**Registered variants** (`variants/variants.js` + `mas.js`):

| Variant | Registered in |
| --- | --- |
| `catalog` | variants.js |
| `image` | variants.js |
| `inline-heading` | variants.js |
| `mini-compare-chart` | variants.js |
| `mini-compare-chart-mweb` | variants.js |
| `plans`, `plans-students`, `plans-education` | variants.js |
| `plans-v2` | variants.js |
| `product` | variants.js |
| `segment` | variants.js |
| `media` | variants.js |
| `headless` | variants.js |
| `special-offers` | variants.js |
| `simplified-pricing-express`, `full-pricing-express` | variants.js |
| `mini` | variants.js (headless data for custom frameworks) |
| `fries` | variants.js |
| `ccd-suggested`, `ccd-slice` | mas.js |
| `ah-try-buy-widget`, `ah-promoted-plans` | mas.js |

**Common read-only properties** (populated after hydration): `title`, `prices`, `promoPrice`, `regularPrice`, `annualPrice`, `planTypeText`, `promoText`, `taxText`, `recurrenceText`, `unitText`, `seeTermsInfo`, `renewalText`, `promoDurationText`, `ctas`, `primaryCta`, `secondaryCta`, `promotionCode`, `variantLayout`, `compatVersion`.

Default slot: card body content (`aem-fragment`, icons, prices, footer CTAs). Named slots are variant-specific (e.g. `icons`, `heading-m`, `footer`, `price` — see variant CSS/JS and gallery pages).

### Events

| Event | When | `detail` |
| --- | --- | --- |
| `mas:ready` | Prices and checkout elements resolved | Optional timing metadata from internal marks |
| `mas:error` | Fragment failure, unresolved offers within `MERCH_CARD_LOAD_TIMEOUT` (20s), or other hydration errors | Error message string |
| `merch-card-quantity:change` | Quantity selector changes | From quantity UI |
| `merch-card:action-menu-toggle` | Action menu toggled | (see constants) |

Bubbling events from children (listen on card or document):

| Event | Source |
| --- | --- |
| `aem:load` / `aem:error` | `aem-fragment` |
| `mas:resolved` / `mas:failed` | `inline-price`, `checkout-link`, `checkout-button` |
| `merch-offer-select:ready`, `merch-quantity-selector:change`, `merch-modal:addon-and-quantity-update` | Child merch components |

### Usage example

AEM-driven card:

```html {.demo .light}
<merch-card id="card1">
    <aem-fragment fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"></aem-fragment>
</merch-card>
<script type="module">
    document.getElementById('card1').addEventListener('mas:ready', (e) => {
        console.log('ready', e.target.variant);
    });
    document.getElementById('card1').addEventListener('mas:error', (e) => {
        console.error(e.detail);
    });
</script>
```

Static markup with dynamic price and checkout:

```html {.demo .light}
<merch-card variant="plans" badge-text="Best value">
  <merch-icon slot="icons" size="l" src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg" alt="Creative Cloud"></merch-icon>
  <h3 slot="heading-m">
      <span is="inline-price" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
  </h3>
  <div slot="footer">
      <a is="checkout-link" href="#" class="con-button blue" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8">Save now</a>
  </div>
</merch-card>
```

### Notes

- Requires `mas-commerce-service` and Spectrum/Consonant styles on the consumer page for CTAs.
- `MERCH_CARD_LOAD_TIMEOUT` is 20000 ms (`constants.js`).
- AEM fragments on cards enable `mas-ff-defaults` for nested inline-price via `priceOptionsProvider`.
- `spectrum="swc"`: click `sp-button` and use `event.target.source` for the underlying `checkout-button`.
- Variant galleries: [CCD](ccd.html), [Plans](plans.html), [Catalog](catalog.html), etc.
- Child elements used by variants but not separately documented: `merch-offer`, `merch-offer-select`, `merch-quantity-select`, `merch-badge`, `merch-icon`, `merch-addon`, `merch-whats-included`, `merch-card-collection`, `plans-modal` — see `web-components/src/`.
