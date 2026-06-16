## Overview {#overview}

Product cards use `variant="product"`. Mapping: `PRODUCT_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/product.js`.

Gallery examples set `variant="product"` explicitly; the same mapping applies when the variant is inferred from an AEM fragment.

## AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `product`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title; shares slot with prices. |
| `prices` | `heading-xs` | `p` | Price HTML with `inline-price` elements. |
| `promoText` | `promo-text` | `p` | |
| `description` | `body-xs` | `div` | Checkout links in description are converted to buttons. |
| `callout` | `callout-content` | `div` | |
| `whatsIncluded` | `whats-included` | `div` | `merch-whats-included` markup. |
| `quantitySelect` | `quantity-select` | `div` | Serialized `merch-quantity-select` HTML. |
| `addon` | `addon` | — | Creates `merch-addon` from field HTML or `settings.addon`. |
| `badge` | `badge` | `div` | Wrapped in `merch-badge` when plain text. Default `color-yellow-300-variation`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Icon size `l`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons. |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card. |
| `displayPlanType` | Controls plan-type text in legal price clones. |
| `addon` | Fallback HTML for `merch-addon` when `fields.addon` is absent. |
| `quantitySelect` | Fallback markup when `fields.quantitySelect` is absent. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

## Slots {#slots}

Layout from `Product.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Body | |
| `heading-xs` | Body | Title and/or prices. |
| `body-xxs` | Body | Optional authored slot. |
| `promo-text` | Body | Order depends on `promo-bottom` class. |
| `body-xs` | Body | Description. |
| `whats-included` | Body | |
| `callout-content` | Body | |
| `quantity-select` | Body | Quantity changes update price `data-quantity`. |
| `addon` | Body | Plan type synced from main price after hydration. |
| `body-lower`, `badge` | Body | Optional authored slots. |
| `footer` | Footer | CTAs and secure-transaction label. `<hr />` above footer when card has an `id`. |

<div class="product-gallery-content">
  <h1 id="product-gallery">Product Gallery</h1>
  <div class="three-merch-cards product">
    <merch-card variant="product"><aem-fragment fragment="8018a162-6c15-48b4-b44b-504c640e66d2"></aem-fragment></merch-card>
    <merch-card variant="product"><aem-fragment fragment="bdf14ab4-b467-45c5-9d27-e561c6bccb48"></aem-fragment></merch-card>
    <merch-card variant="product"><aem-fragment fragment="8018a162-6c15-48b4-b44b-504c640e66d2"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8018a162-6c15-48b4-b44b-504c640e66d2"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=bdf14ab4-b467-45c5-9d27-e561c6bccb48"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8018a162-6c15-48b4-b44b-504c640e66d2"> Open in Studio</a>
  </div>
</div>
