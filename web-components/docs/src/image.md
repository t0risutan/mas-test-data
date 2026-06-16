## Overview {#overview}

Image cards use `variant="image"`. Mapping: `IMAGE_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/image.js`.

Gallery examples set `variant="image"` explicitly; the same mapping applies when the variant is inferred from an AEM fragment.

See [merch-card](merch-card.html) for shared attributes (`detail-bg`, `intro-pricing`, `promo-bottom`) and [merch-badge](merch-badge.html) for badge authoring.

## AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `image`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title; shares slot with prices. |
| `prices` | `heading-xs` | `h3` | Price HTML with `inline-price` elements. |
| `subtitle` | `body-xxs` | `p` | |
| `promoText` | `promo-text` | `p` | |
| `description` | `body-xs` | `div` | Checkout links in description HTML are converted to buttons. |
| `backgroundImage` | `bg-image` | `div` | Wraps an `<img>`; `backgroundImageAltText` sets `alt`, otherwise `role="none"`. |
| `badge` | `badge` | `div` | Wrapped in `merch-badge` when plain text. Default `spectrum-yellow-300-plans`. When the default badge color is used and `borderColor` is absent, the badge color is also applied as the card border. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`: `spectrum-yellow-300-plans`, `spectrum-gray-300-plans`, `spectrum-green-900-plans`, `spectrum-red-700-plans`, `gradient-purple-blue`. |
| `size` | `size` attribute | — | `wide` or `super-wide`. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Icon size `l`. The icons slot is hidden when no mnemonics are authored. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons (`size: 'm'` in mapping). |

`badgeIcon` is declared in the mapping for Studio authoring but is not processed by `hydrate.js`.

The mapping does not include `secureLabel: true`, so `settings.secureLabel` is not applied during hydration. The footer still renders a secure-transaction label when `secure-label` is set manually on the element.

## Layout classes {#layout-classes}

| Class on `<merch-card>` | Effect |
| --- | --- |
| `intro-pricing` | Replaces `<hr />` + footer with a `detail-bg` region (see [detail-bg](merch-card.html#detail-bg)). |
| `promo-bottom` | Swaps `promo-text` and `body-xs` order in the body. |

## Slots {#slots}

Layout from `Image.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `bg-image` | Image header | Hero/background image. |
| `badge` | Image header | Absolutely positioned over the image area (top-right in LTR). |
| `icons` | Body | Product mnemonics. |
| `heading-xs` | Body | Title and/or prices. |
| `body-xxs` | Body | Subtitle. |
| `promo-text`, `body-xs` | Body | Order depends on `promo-bottom` class. |
| `detail-bg` | Detail region | Only when `intro-pricing` class is present; background from `detail-bg` attribute. |
| `footer` | Footer | CTAs and optional secure-transaction label. `<hr />` above footer when `intro-pricing` is absent. |

Card dimensions: `min-height: 330px`, width `var(--consonant-merch-card-image-width)` (300px by default, 378px at desktop). Grid column breakpoints are defined in `image.css.js`.

<div class="image-gallery-content">
  <h1 id="image-gallery">Image Gallery</h1>
  <div class="three-merch-cards">
    <merch-card variant="image"><aem-fragment fragment="f7fdf15d-bcb0-40c4-9a8f-fa103fc640e7"></aem-fragment></merch-card>
    <merch-card variant="image"><aem-fragment fragment="f554b816-9c27-4d03-b5d4-0a827d04ced0"></aem-fragment></merch-card>
    <merch-card variant="image"><aem-fragment fragment="7ba7862f-9aad-443c-ada9-e8a39dc7b6c2"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=f7fdf15d-bcb0-40c4-9a8f-fa103fc640e7"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=f554b816-9c27-4d03-b5d4-0a827d04ced0"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=7ba7862f-9aad-443c-ada9-e8a39dc7b6c2"> Open in Studio</a>          
  </div>
 </div>
