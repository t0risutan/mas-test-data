## Overview {#overview}

Catalog cards use `variant="catalog"` (explicit in this gallery or inferred from the fragment `variant` field). Mapping: `CATALOG_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/catalog.js`.

Catalog uses attribute-based badges (`badge: true` without a slot config) rather than the slotted `merch-badge` pattern used on plans cards.

## AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `catalog`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title; shares slot with prices. |
| `prices` | `heading-xs` | `h3` | Price HTML with `inline-price` elements. |
| `description` | `body-xs` | `div` | |
| `shortDescription` | `action-menu-content` | `div` | When present, sets `action-menu="true"` and default `action-menu-label="More options"`. |
| `actionMenuLabel` | `action-menu-label` attribute | — | Overrides default action-menu label. |
| `badge` | Badge attributes | — | Sets `badge-text`, `badge-color`, and `badge-background-color` (not a slotted badge). |
| `borderColor` | Card border styling | — | Via `processBorderColor` when authored. |
| `size` | `size` attribute | — | `wide` or `super-wide`. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Icon size `l`. |
| `ctas` | `footer` | `div` | Footer CTA links. |

## Slots {#slots}

Layout from `Catalog.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Body top | Mnemonics beside badge. |
| `action-menu-content` | Body | Expandable menu content; toggled by the action-menu control. |
| `heading-xs` | Body | Title and/or prices. |
| `heading-m`, `body-xxs` | Body | Optional authored slots (not in AEM mapping). |
| `promo-text`, `callout-content` | Body | Order depends on `promo-bottom` class on the card. |
| `body-xs` | Body | Description. |
| `footer` | Footer | CTAs. |

<div class="catalog-gallery-content">
  <h1 id="catalog-gallery">Catalog Gallery</h1>
  <div class="three-merch-cards catalog">
    <merch-card variant="catalog"><aem-fragment fragment="60d6f47c-8fd7-485d-a4ac-2b7baa492ab1"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="c44bcc8c-4cfc-4514-96eb-2ccfaf15ebe8"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="7286e63a-253e-42e3-86a8-a29f9bc72fb9"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="d8f4315b-ecf5-47c9-a416-adf3390a4ec6"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="9a1fd4db-54c2-47d0-9ddc-06cc6725b7bf"></aem-fragment></merch-card>
  </div>
</div>
