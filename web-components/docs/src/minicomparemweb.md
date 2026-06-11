## Overview {#overview}

The `mini-compare-chart-mweb` card variant is the mobile-web compare layout registered in `web-components/src/variants/mini-compare-chart-mweb.js`. Set `variant="mini-compare-chart-mweb"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

Compared to [Mini Compare Chart](minicompare.html), the mweb variant uses a compact body/footer split, a collapsible feature list in `body-xs` on mobile, and static `footer-rows` compare cells on desktop — without `merch-whats-included`, addon, offer select, quantity select, or callout slots in the AEM mapping.

See [merch-card](merch-card.html) for shared attributes and events.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `MINI_COMPARE_CHART_MWEB_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `mini-compare-chart-mweb`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `h3` | Plan title. Mapping key `title`. |
| `subtitle` | `subtitle` | `p` | |
| `prices` | `heading-m-price` | `p` | HTML with `inline-price` elements. Per-unit display disabled on main price; legal clone added in `adjustLegal()`. |
| `promoText` | `promo-text` | `div` | |
| `shortDescription` | `body-m` | `div` | Primary description text in the card body. |
| `description` | `body-xs` | `div` | Feature list region below the body; see [Mobile feature toggle](#mobile-toggle). |
| `mnemonics` | `icons` | `merch-icon` | Parallel arrays; icon size `l`. Icons render only when `[slot="icons"]` or card `id` is present. |
| `badge` | `badge` | `div` | Default background `spectrum-yellow-300-plans`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`. |
| `size` | `size` attribute | — | `wide` or `super-wide`. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Same as `mnemonics`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons. CTA size `l`. |

Fields **not** in the mweb mapping (present on desktop mini-compare only): `whatsIncluded`, `whatsIncludedDividerColor`, `addon`, `quantitySelect`, `callout`.

Compare-column rows in `footer-rows` are authored as HTML (`ul` > `li.footer-row-cell`) in the fragment or page markup, not via the `whatsIncluded` AEM field.

### Allowed badge and border colors {#allowed-colors}

| Token | Badge | Border |
| --- | --- | --- |
| `spectrum-yellow-300-plans` | Yes (default badge) | Yes |
| `spectrum-gray-300-plans` | Yes | Yes |
| `spectrum-gray-700-plans` | Yes | — |
| `spectrum-green-900-plans` | Yes | Yes |
| `spectrum-red-700-plans` | Yes | Yes (drop-shadow) |
| `gradient-purple-blue` | Yes | Yes |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` when the mapping includes `secureLabel: true`. Rendered in `secure-transaction-label` slot. |
| `displayPlanType` | Passed to the legal price clone via `priceOptionsProvider()`. |
| `planType` | Mapping includes `planType: true`. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

## Legal price {#legal-price}

`adjustLegal()` clones the main `inline-price` in `heading-m-price`, inserts it with `data-template="legal"`, and disables per-unit, tax, and plan-type display on the main price. `priceOptionsProvider()` disables `displayPerUnit` on strikethrough/price templates. Unlike desktop mini-compare, mweb does not merge short description into the legal line.

## Mobile feature toggle {#mobile-toggle}

`setupToggle()` transforms `[slot="body-xs"]` when it contains a leading `<p>` title and a `<ul>` list:

| Viewport | Behavior |
| --- | --- |
| Mobile (`Media.isMobile`) | Title becomes `.footer-rows-title` with a `.toggle-icon` button. Click toggles `.open` on the list (`.checkmark-copy-container`). Button gets `aria-expanded` and `aria-controls` pointing at the list `id` (derived from the card heading `id` or a generated id). |
| Tablet and up | List receives class `open` immediately; no toggle button. |

If Milo has already transformed the markup (`.footer-rows-title` present), `setupToggle()` skips.

## Height sync and collection grid {#height-sync}

On desktop, cards in the same container sync slot min-heights via `--consonant-merch-card-mini-compare-chart-mweb-<slot>-height` and footer-row heights via `--consonant-merch-card-footer-row-<n>-min-height`. `adjustMiniCompareBodySlots()` uses a `ResizeObserver` when the card width is zero at first layout (for example inside Milo tab grids).

On mobile, empty `.footer-row-cell-description` rows are removed instead of padded.

Add `mini-compare-chart-mweb` to the grid wrapper (or use `:has(merch-card[variant="mini-compare-chart-mweb"])`) for collection CSS. Mweb grids use two columns at tablet+ regardless of three/four-card wrappers.

```html {.demo}
<div class="three-merch-cards mini-compare-chart-mweb">
  <merch-card variant="mini-compare-chart-mweb">
    <aem-fragment fragment="example-fragment-id"></aem-fragment>
  </merch-card>
  <merch-card variant="mini-compare-chart-mweb">
    <aem-fragment fragment="example-fragment-id-2"></aem-fragment>
  </merch-card>
</div>
<mas-commerce-service env="stage"></mas-commerce-service>
```

## Slots {#slots}

Layout from `MiniCompareChartMweb.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| — | Above body | Corner badge from `badge-text` / color attributes when set. |
| `icons` | Body | Product mnemonics; omitted when no icons and no card `id`. |
| `badge` | Body | Hydrated badge. |
| `heading-xs` | Body | Plan title. |
| `subtitle` | Body | |
| `heading-m-price` | Body | Main + legal prices. |
| `body-m` | Body | Short description from AEM `shortDescription`. |
| `promo-text` | Body | |
| `secure-transaction-label` | Footer | From `secure-label` attribute. |
| `footer` | Footer | CTAs inside `.action-area`. |
| `body-xs` | Footer rows container | Feature list title + `ul`; mobile accordion source. |
| `footer-rows` | Footer rows container | `ul` > `li.footer-row-cell` compare cells for desktop column alignment. Gray background via `.footer-rows-container`. |

<div class="mini-compare-chart-mweb-gallery-content">
  <h1 id="mini-compare-mweb-chart-gallery">Mini Compare Chart Gallery</h1>
  <div class="three-merch-cards">
    <merch-card variant="mini-compare-chart-mweb"><aem-fragment fragment="3783cddb-fc42-4e37-a7e0-d6f306430ee8"></aem-fragment></merch-card>
    <merch-card variant="mini-compare-chart-mweb"><aem-fragment fragment="67300358-d6a5-4650-b9a1-7e97f91ad5bb"></aem-fragment></merch-card>
    <merch-card variant="mini-compare-chart-mweb"><aem-fragment fragment="127a74ee-bd16-4de2-a7a1-ad6a1ef39455"></aem-fragment></merch-card>
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=3783cddb-fc42-4e37-a7e0-d6f306430ee8"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=67300358-d6a5-4650-b9a1-7e97f91ad5bb"> Open in Studio</a>    
    <a class="image-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=127a74ee-bd16-4de2-a7a1-ad6a1ef39455"> Open in Studio</a>          
  </div>
</div>
