## Overview {#overview}

Special-offers cards use `variant="special-offers"`. Mapping: `SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/special-offer.js`.

Gallery examples set `variant="special-offers"` explicitly; the same mapping applies when the variant is inferred from an AEM fragment.

See [merch-card](merch-card.html) for shared attributes (`detail-bg`, `intro-pricing`) and [merch-badge](merch-badge.html) for badge authoring.

## AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `special-offers`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title. |
| `prices` | `heading-xs-price` | `p` | Price HTML with `inline-price` elements. Separate slot from title (unlike the image variant). |
| `subtitle` | `detail-m` | `p` | Eyebrow above the title; used as `headingSelector` for card height sync. |
| `description` | `body-xs` | `div` | Checkout links in description HTML are converted to buttons. |
| `backgroundImage` | `bg-image` | `div` | Hero image in the `.image` region via `cardImage`. `backgroundImageAltText` sets `alt`, otherwise `role="none"`. |
| `badge` | `badge` | `div` | Wrapped in `merch-badge` when plain text. Default `spectrum-yellow-300-special-offers`. Rendered in the body, not overlaid on the image. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`: `spectrum-yellow-300-special-offers`, `spectrum-gray-300-special-offers`, `spectrum-green-900-special-offers`. Spectrum tokens also have dedicated CSS selectors in `special-offer.js`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons (`size: 'l'` in mapping). |

`badgeIcon` is declared in the mapping for Studio authoring but is not processed by `hydrate.js`.

The mapping does not include `secureLabel: true`, so `settings.secureLabel` is not applied during hydration. The footer still renders a secure-transaction label when `secure-label` is set manually on the element.

## Layout classes {#layout-classes}

| Class on `<merch-card>` | Effect |
| --- | --- |
| `intro-pricing` | Replaces `<hr />` + footer with a `detail-bg` region (see [detail-bg](merch-card.html#detail-bg)). |
| `center` | `text-align: center` on the card host. |

## Price styling {#price-styling}

`special-offer.css.js` applies variant-specific typography to `inline-price` templates in the price slot:

| `data-template` | Style |
| --- | --- |
| `promo-strikethrough`, `strikethrough` | `body-xs` font size, weight 400. |
| `price` | Weight 700. |

## Slots {#slots}

Layout from `SpecialOffer.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `bg-image` | Image header | Hero image via `cardImage`. |
| `detail-m` | Body | Subtitle/eyebrow. |
| `heading-xs` | Body | Title. |
| `heading-xs-price` | Body | Prices. |
| `body-xs` | Body | Description. |
| `badge` | Body | In-card badge strip. |
| `detail-bg` | Detail region | Only when `intro-pricing` class is present; background from `detail-bg` attribute. |
| `footer` | Footer | CTAs and optional secure-transaction label. `<hr />` above footer when `intro-pricing` is absent. |
| *(default)* | After layout | Unnamed default slot at the end of `renderLayout()`. |

Card dimensions: `min-height: 439px`, width `var(--consonant-merch-card-special-offers-width)` (302px). Grid column breakpoints are defined in `special-offer.css.js`.

<div class="specialoffers-gallery-content">
  <h1 id="specialoffers-gallery">Special Offer Gallery</h1>
  <div class="three-merch-cards">
    <merch-card variant="special-offers"><aem-fragment fragment="0381d43f-2e1d-4074-a7a6-4a748bd81be7"></aem-fragment></merch-card>
    <merch-card variant="special-offers"><aem-fragment fragment="c7113007-10c7-4874-bad0-ba0f0a3d40f0"></aem-fragment></merch-card>
    <merch-card variant="special-offers"><aem-fragment fragment="5f4d3231-4db7-4d9e-a483-454393de812f"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=0381d43f-2e1d-4074-a7a6-4a748bd81be7"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=c7113007-10c7-4874-bad0-ba0f0a3d40f0"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=5f4d3231-4db7-4d9e-a483-454393de812f"> Open in Studio</a>          
  </div>
</div>
