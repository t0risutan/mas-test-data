## merch-card

### What it does

A Lit-based web component (`<merch-card>`) that renders merchandising cards for Adobe surfaces. It supports many visual variants (see Notes) and can be populated either from static HTML/slots or by hydrating content from an `<aem-fragment>` child.

On connect, the card registers price and checkout option providers with `mas-commerce-service` so nested `inline-price` and `checkout-link` / `checkout-button` elements inherit card-level promotion codes and default tax behavior.

The card waits for all commerce placeholders and fragment loading to complete, then dispatches `mas:ready`. Failures dispatch `mas:error`. Load timeout is `MERCH_CARD_LOAD_TIMEOUT` (20000 ms from `constants.js`).

CTA styling depends on the `consonant` and `spectrum` attributes during AEM hydration. Spectrum Web Components mode (`spectrum="swc"`) renders `sp-button` elements that proxy clicks to hidden checkout-button sources.

### Attributes / Props

Lit-reflected attributes (`MerchCard.static properties` in `merch-card.js`):

| Attribute | Property | Description |
|-----------|----------|-------------|
| `id` | `id` | Element id. |
| `name` | `name` | Card name. |
| `variant` | `variant` | Design variant key (see Notes). Not required when variant is inferred from AEM fragment. |
| `size` | `size` | Grid width: `wide`, `super-wide`, etc. |
| `badge-color` | `badgeColor` | Badge text color. |
| `badge-background-color` | `badgeBackgroundColor` | Badge background color. |
| `badge-text` | `badgeText` | Badge label text. |
| `border-color` | `borderColor` | Card border color. |
| `background-color` | `backgroundColor` | Card background color. |
| `background-image` | `backgroundImage` | Background image URL. |
| `action-menu` | `actionMenu` | Enable action menu. |
| `action-menu-label` | `actionMenuLabel` | Action menu accessible label. |
| `custom-hr` | `customHr` | Custom horizontal rule. |
| `consonant` | `consonant` | Use Consonant CTA styles when hydrating from fragment. |
| `spectrum` | `spectrum` | Spectrum CTA mode: `css` (default) or `swc`. |
| `failed` | `failed` | Reflects failure state. |
| `detail-bg` | `detailBg` | Detail section background. |
| `secure-label` | `secureLabel` | Secure transaction label text. |
| `checkbox-label` | `checkboxLabel` | Checkbox label text. |
| `addon-title` | `addonTitle` | Addon section title. |
| `addon-offers` | `addonOffers` | Addon offer configuration object. |
| `aria-selected` | `selected` | Selection state for selectable cards. |
| `storage` | `storageOption` | Storage option key. |
| `plan-type` | `planType` | Plan type filter. |
| `height-sync` | `heightSync` | Enable height synchronization (express variants). |
| `stock-offer-osis` | `stockOfferOsis` | Comma-separated PUF, ABM, M2M OSIs for stock display. |
| `filters` | `filters` | Collection filter string (`key:order:size,...`). |
| `types` | `types` | Type filter string. |
| `daa-lh` | `analyticsId` | Analytics section id (from PRODUCT_CODE tag in Studio). |
| `loading` | `loading` | Loading mode passthrough for nested fragment. |

Non-reflected / internal properties include `title`, `prices`, `promoPrice`, `regularPrice`, `annualPrice`, `ctas`, `primaryCta`, `secondaryCta`, and related commerce metadata populated after hydration.

### Events

| Event | When | Detail |
|-------|------|--------|
| `mas:ready` | All prices and checkout elements resolved and rendered. | (none) |
| `mas:error` | Fragment failure, unresolved offers, or load timeout. | Error message string |

Related events on child elements:

| Event | Source |
|-------|--------|
| `aem:load` | `aem-fragment` when fragment data is available. |
| `aem:error` | `aem-fragment` on fetch/transform failure. |
| `mas:failed` | Individual `inline-price` / `checkout-link` elements on WCS failure. |

Listen on a container before appending cards; some cards resolve before consumer listeners attach.

### Usage example

With AEM fragment (typical authoring path):

```html
<mas-commerce-service></mas-commerce-service>

<merch-card>
  <aem-fragment fragment="d8008cac-010f-4607-bacc-a7a327da1312"></aem-fragment>
</merch-card>
```

Static markup with dynamic pricing:

```html
<merch-card variant="plans" badge-text="Best value">
  <merch-icon slot="icons" src="/path/to/icon.svg" alt="Creative Cloud"></merch-icon>
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <h3 slot="heading-m">
    <span is="inline-price" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
  </h3>
  <div slot="footer">
    <a is="checkout-link" href="#" class="con-button blue active"
       data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8">
      Save now
    </a>
  </div>
</merch-card>
```

### Notes

**Registered variants** (`variants/variants.js` and `mas.js`):

`catalog`, `image`, `inline-heading`, `mini-compare-chart`, `mini-compare-chart-mweb`, `plans`, `plans-students`, `plans-education`, `plans-v2`, `product`, `segment`, `media`, `headless`, `special-offers`, `simplified-pricing-express`, `full-pricing-express`, `mini`, `fries`, `ccd-suggested`, `ccd-slice`, `ah-try-buy-widget`, `ah-promoted-plans`

**Common slots** (vary by variant; populated by `hydrate.js` from AEM fields or authored manually):

`icons`, `badge`, `heading-xs`, `heading-s`, `heading-m`, `body-xxs`, `body-xs`, `body-m`, `price`, `footer`, `ctas`, `cta`, `bg-image`, `callout-content`, `detail-m`, and the default slot for additional content.

**Error handling:** `aem:error` on the nested fragment propagates to `mas:error` on the card. Unresolved commerce placeholders after timeout produce `mas:error` with message containing the timeout duration.

**Refresh:** `mas-commerce-service.refreshFragments()` clears the AEM cache and re-fetches all `aem-fragment` elements.

Source: `web-components/src/merch-card.js`, `web-components/src/variants/`, `web-components/src/hydrate.js`, `web-components/src/mas.js`.
