## Overview {#overview}

Segment cards use `variant="segment"`. Mapping: `SEGMENT_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/segment.js`.

Segment cards do not render product mnemonics — the mapping has no `mnemonics` entry.

## AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `segment`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title; shares slot with prices. |
| `prices` | `heading-xs` | `p` | Price HTML with `inline-price` elements. |
| `promoText` | `promo-text` | `p` | |
| `description` | `body-xs` | `div` | |
| `callout` | `callout-content` | `div` | |
| `badge` | `badge` | `div` | Wrapped in `merch-badge` when plain text. Default `color-red-700-variation`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons. |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card. |
| `displayPlanType` | Controls plan-type text in legal price clones. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

## Slots {#slots}

Layout from `Segment.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `heading-xs` | Body | Title and/or prices. |
| `body-xxs` | Body | Optional authored slot. |
| `promo-text`, `callout-content` | Body | Order depends on `promo-bottom` class. |
| `body-xs` | Body | Description. |
| `badge` | Body | In-card badge strip. |
| `footer` | Footer | CTAs and secure-transaction label. `<hr />` above footer when card has an `id`. |

<div class="segment-gallery-content">
  <h1 id="segment-gallery">Segment Gallery</h1>
  <div class="three-merch-cards segment">
    <merch-card variant="segment"><aem-fragment fragment="5bf2044e-773c-458e-9b5f-efdb238cdcf1"></aem-fragment></merch-card>
    <merch-card variant="segment"><aem-fragment fragment="87088898-81df-4fb0-9b51-0d7ff8938467"></aem-fragment></merch-card>
    <merch-card variant="segment"><aem-fragment fragment="5bf2044e-773c-458e-9b5f-efdb238cdcf1"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=5bf2044e-773c-458e-9b5f-efdb238cdcf1"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=87088898-81df-4fb0-9b51-0d7ff8938467"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=5bf2044e-773c-458e-9b5f-efdb238cdcf1"> Open in Studio</a>
  </div>
</div>
