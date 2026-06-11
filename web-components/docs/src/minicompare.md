## Overview {#overview}

The `mini-compare-chart` card variant is a side-by-side plan comparison layout registered in `web-components/src/variants/mini-compare-chart.js`. Set `variant="mini-compare-chart"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

Cards are designed to sit in a row inside a grid wrapper (for example `.three-merch-cards.mini-compare-chart`). On desktop, the variant synchronizes slot and footer-row heights across all cards in the same container so compare columns line up.

See [merch-card](merch-card.html) for shared attributes and events, [merch-whats-included](merch-whats-included.html) for the feature list in compare rows, [merch-offer-select](merch-offer-select.html) and [merch-quantity-select](merch-quantity-select.html) for offer/quantity UI in the `offers` slot, and [merch-addon](merch-addon.html) for optional add-on checkboxes.

For the mobile-web layout, see [Mini Compare MWeb Gallery](minicomparemweb.html).

## Layout modes {#layout-modes}

`MiniCompareChart` chooses between two render paths based on whether the card contains a `merch-whats-included` element (`isNewVariant`):

| Mode | Detection | Compare rows |
| --- | --- | --- |
| **New** | `merch-whats-included` present (hydrated from `whatsIncluded` into `footer-rows`) | `merch-mnemonic-list` rows inside `merch-whats-included` `[slot="content"]` |
| **Legacy** | No `merch-whats-included` | `ul` > `li.footer-row-cell` markup in `footer-rows`, or content in the default `body-s` fallback |

The new layout adds `heading-xs`, `subtitle`, `quantity-select`, and `badge` slots, clones a legal price line, merges `shortDescription` into the legal plan-type text, and runs callout tooltip setup. The legacy layout reorders body slots when the host has class `bullet-list` (see [bullet-list class](#bullet-list)).

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `MINI_COMPARE_CHART_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `mini-compare-chart`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `h3` | Plan title. Mapping key `title`. |
| `subtitle` | `subtitle` | `p` | New layout only. |
| `prices` | `heading-m-price` | `p` | HTML with `inline-price` elements. Per-unit display is disabled on the main price; see [Legal price](#legal-price). |
| `promoText` | `promo-text` | `div` | |
| `shortDescription` | `body-xxs` | `div` | New layout: removed from the slot and appended to the legal price plan-type line after prices resolve. |
| `description` | `body-m` | `div` | Checkout links in description HTML are converted to buttons. |
| `mnemonics` | `icons` | `merch-icon` | Parallel arrays; icon size `l`. |
| `quantitySelect` | `quantity-select` | `div` | Serialized `merch-quantity-select` HTML. Rendered in the new layout only. |
| `callout` | `callout-content` | `div` | Tooltip icons get touch/mouse/focus handling in `adjustCallout()` (new layout). |
| `addon` | `addon` | — | Creates `merch-addon` from field HTML or `settings.addon`. `planType` synced from main price in `adjustAddon()`. |
| `whatsIncluded` | `footer-rows` | `div` | `merch-whats-included` markup. Enables the new layout when present. |
| `badge` | `badge` | `div` | Plain text wrapped in `merch-badge`; HTML passthrough when already tagged. Default background `spectrum-yellow-300-plans`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`. |
| `whatsIncludedDividerColor` | `whats-included-divider-color` attribute / CSS variable | — | Divider color for `merch-whats-included` rows. Allowed values in `allowedWhatsIncludedDividerColors`. Processed by `processWhatsIncludedDividerColor()`. |
| `size` | `size` attribute | — | `wide` or `super-wide`. Adjusts max card width (484px default host max-width). |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Same as `mnemonics`; parallel arrays. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons (`style: 'consonant'`). CTA size `l`. |

The `offers` slot is not in the AEM mapping. Author `merch-offer-select` or `merch-quantity-select` markup inside an `offers` slot in fragment HTML or page markup (see [Offers and quantity](#offers-quantity)).

### Allowed badge, border, and divider colors {#allowed-colors}

| Token | Badge | Border | What's-included divider |
| --- | --- | --- | --- |
| `spectrum-yellow-300-plans` | Yes (default badge) | Yes | Yes |
| `spectrum-gray-300-plans` | Yes | Yes | Yes |
| `spectrum-gray-700-plans` | Yes | — | — |
| `spectrum-green-900-plans` | Yes | Yes | Yes |
| `spectrum-red-700-plans` | Yes | Yes (drop-shadow on border/badge) | Yes |
| `gradient-purple-blue` | Yes | Yes | Yes |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card when the mapping includes `secureLabel: true`. |
| `displayPlanType` | Passed to the legal price clone via `priceOptionsProvider()`; controls plan-type text in the legal line (new layout). |
| `planType` | Mapping includes `planType: true`; used with addon price sync. |
| `addon` | Fallback HTML for `merch-addon` when `fields.addon` is absent. |
| `quantitySelect` | Fallback markup when `fields.quantitySelect` is absent. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

Legacy badge attributes (`badge-text`, `badge-background-color`, `badge-color`) on `<merch-card>` still render the corner badge via `VariantLayout.badge` when all three are set.

## Legal price {#legal-price}

In the new layout, `adjustLegal()` clones the main `inline-price` (`data-template="price"`) in `heading-m-price`, inserts it as a sibling with `data-template="legal"`, and disables per-unit, tax, and plan-type display on the main price.strikethrough and price templates. `priceOptionsProvider()` sets `displayPerUnit = false` on strikethrough/price templates and passes `displayPlanType` from card settings to the legal clone only.

After the legal price resolves (`EVENT_TYPE_RESOLVED`), `adjustShortDescription()` moves `[slot="body-xxs"]` content into an `<em>` appended to the legal `.price-plan-type` element.

## Addon {#addon}

When `merch-addon` is present, `adjustAddon()` reads `planType` from the main price (after `onceSettled()`) and assigns it to the addon. Unlike `plans` and `plans-v2`, this variant does **not** set `custom-checkbox` on the addon.

`toggleAddon()` (called from `merch-card` on addon `change`) swaps the `heading-m-price` slot between the main price and addon inline prices when no main `inline-price[data-template="price"]` exists — showing addon price when checked or a `Free` heading when unchecked.

See [merch-addon](merch-addon.html) for checkbox behavior and checkout OSI mutation.

## Callout tooltip {#callout}

In the new layout, `adjustCallout()` finds `[slot="callout-content"] .icon-button`, moves tooltip text from `title` to `data-tooltip`, wraps the icon in a `.callout-row` structure, and wires document-level touch/mouse listeners plus focus and Escape key handling. The icon gets `role="button"`, `tabindex="0"`, and `aria-expanded`.

## Offers and quantity {#offers-quantity}

| Slot | Typical content | Events |
| --- | --- | --- |
| `offers` | `merch-offer-select` (with nested `merch-offer`) or `merch-quantity-select` | Offer selection updates prices via `merch-offer:selected`; quantity changes fire `merch-quantity-selector:change`, which `updatePriceQuantity()` listens for to set `data-quantity` on the main price. |
| `quantity-select` | `merch-quantity-select` (new layout, from AEM `quantitySelect` field) | Same quantity event chain. |

See [merch-offer-select](merch-offer-select.html) and [merch-quantity-select](merch-quantity-select.html).

## Height sync and collection grid {#height-sync}

Cards in the same container (`merch-card-collection` or any element with a `*-merch-cards` class) share CSS custom properties on that container:

- Per-slot min-heights: `--consonant-merch-card-mini-compare-chart-<slot>-height`
- Per compare-row min-heights: `--consonant-merch-card-footer-row-<n>-min-height`

On desktop (`!Media.isMobile`), `postCardUpdateHook()` calls `padFooterRows()` to insert placeholder rows so every card has the same number of compare rows, then `syncHeights()` to align slot and row heights. An `IntersectionObserver` triggers an initial sync when cards scroll into view.

Set `height-sync="false"` on a card to opt out of container height synchronization.

### Grid wrapper classes {#grid-wrapper}

Add the `mini-compare-chart` class to the grid wrapper (or rely on `:has(merch-card[variant="mini-compare-chart"])`) so collection CSS applies:

| Wrapper class | Tablet | Desktop | Large desktop |
| --- | --- | --- | --- |
| `.one-merch-cards` | — | 1 × wide (484px) | — |
| `.two-merch-cards` | 2 columns | 2 × wide | — |
| `.three-merch-cards` | 2 columns | 3 × standard (378px) | — |
| `.four-merch-cards` | 2 columns | 3 columns | 4 columns |

```html {.demo}
<div class="three-merch-cards mini-compare-chart">
  <merch-card variant="mini-compare-chart">
    <aem-fragment fragment="example-fragment-id"></aem-fragment>
  </merch-card>
  <merch-card variant="mini-compare-chart">
    <aem-fragment fragment="example-fragment-id-2"></aem-fragment>
  </merch-card>
  <merch-card variant="mini-compare-chart">
    <aem-fragment fragment="example-fragment-id-3"></aem-fragment>
  </merch-card>
</div>
<mas-commerce-service env="stage"></mas-commerce-service>
```

## bullet-list class {#bullet-list}

When `<merch-card class="bullet-list">` is set (typically by the hosting Milo block, not hydration), the **legacy** layout reorders slots: price and promo move above description, and footer-row padding/typography change. The class is not set automatically from AEM fragment fields.

## Slots {#slots}

### New layout (`merch-whats-included` present) {#slots-new}

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Top section | Product mnemonics. |
| `badge` | Top section | Hydrated badge (`merch-badge` or slotted div). |
| — | Top section | Legacy corner badge from `badge-text` / color attributes when set. |
| `heading-m` | Body | Present in layout; not populated by AEM mapping. |
| `heading-xs` | Body | Plan title from `cardTitle`. |
| `body-m` | Body | Description. |
| `subtitle` | Body | |
| `heading-m-price` | Body | Main + legal prices. |
| `body-xxs` | Body | Short description (merged into legal price on resolve). |
| `price-commitment` | Body | |
| `offers` | Body | Offer select or quantity UI. |
| `quantity-select` | Body | From AEM `quantitySelect` when authored. |
| `promo-text` | Body | |
| `callout-content` | Body | Callout with optional tooltip icon. |
| `addon` | Body | `merch-addon`. |
| `secure-transaction-label` | Footer | From `secure-label` attribute. |
| `footer` | Footer | CTAs inside `.action-area`. |
| `footer-rows` | Footer rows | `merch-whats-included` with `merch-mnemonic-list` compare rows. |

Empty mnemonic rows (no icon and no description text) are removed. Placeholder `merch-mnemonic-list[data-placeholder]` rows pad shorter cards on desktop.

### Legacy layout (no `merch-whats-included`) {#slots-legacy}

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Top section | |
| — | Top section | Corner badge when badge attributes set. |
| `heading-m` | Body | Plan title (manual or legacy markup). |
| `body-m` | Body | Description. Slot order swaps when `.bullet-list` is set. |
| `heading-m-price` | Body | |
| `body-xxs` | Body | |
| `price-commitment` | Body | |
| `offers` | Body | |
| `promo-text` | Body | |
| `callout-content` | Body | |
| `addon` | Body | |
| `secure-transaction-label` | Footer | |
| `footer` | Footer | CTAs. |
| `footer-rows` | Compare rows | `ul` > `li.footer-row-cell` or falls back to `body-s`. Empty `.footer-row-cell-description` rows removed on mobile. |

<div class="mini-compare-chart-gallery-content">
  <h1 id="mini-compare-chart-gallery">Mini Compare Chart Gallery</h1>
  <div class="three-merch-cards">
    <merch-card variant="mini-compare-chart"><aem-fragment fragment="8c404496-6d60-42d0-975c-a4ec0b0314e1"></aem-fragment></merch-card>
    <merch-card variant="mini-compare-chart"><aem-fragment fragment="85a4cc5e-fdef-4146-93ea-0f1c565c4a61"></aem-fragment></merch-card>
    <merch-card variant="mini-compare-chart"><aem-fragment fragment="ce03bb09-75b1-45b9-8ff7-fcd42d33c765"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8c404496-6d60-42d0-975c-a4ec0b0314e1"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=85a4cc5e-fdef-4146-93ea-0f1c565c4a61"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=ce03bb09-75b1-45b9-8ff7-fcd42d33c765"> Open in Studio</a>          
  </div>
</div>
