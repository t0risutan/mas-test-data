## Overview {#overview}

The `plans-v2` card variant is a redesigned plans layout registered in `web-components/src/variants/plans-v2.js`. Set `variant="plans-v2"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

Compared to the original `plans` variant ([Plans Gallery](plans.html)), plans-v2 adds a collapsible **short description** region, Spectrum-prefixed badge/border tokens (including red), a cloned **legal price** line under the main price, and collection height sync across card rows.

See [merch-card](merch-card.html) for shared attributes and events, [merch-quantity-select](merch-quantity-select.html) for quantity UI, and [merch-card-collection](merch-card-collection.html) for collection integration.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `PLANS_V2_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `plans-v2`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `h3` | Plan title. Slot config comes from mapping key `title`. |
| `subtitle` | `subtitle` | `p` | On `size="wide"`, rendered as large display type below the title row. |
| `prices` | `heading-m` | `p` | HTML with `inline-price` elements. Per-unit text is moved to a legal clone (see [Legal price](#legal-price)). |
| `shortDescription` | `short-description` | `p` | Expandable footer region; mobile accordion toggle (see [Short description](#short-description)). Sets `action-menu="true"` on the card during hydration. |
| `promoText` | `promo-text` | `p` | |
| `description` | `body-xs` | `div` | Checkout links in description HTML are converted to buttons. |
| `callout` | `callout-content` | `div` | Tooltip icons in callout HTML get touch/mouse handling in `adjustCallout()`. |
| `whatsIncluded` | `whats-included` | `div` | `merch-whats-included` markup. |
| `quantitySelect` | `quantity-select` | `div` | Serialized `merch-quantity-select` HTML. Rendered in the footer region. |
| `addon` | `addon` | — | Creates `merch-addon` from field HTML or `settings.addon`. Receives `custom-checkbox` after hydration; `planType` synced from main price. |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`; HTML passthrough when already tagged. Default background `spectrum-red-700-plans`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values in `allowedBorderColors`. Spectrum `*-plans` tokens enable variant-specific border styling and drop-shadow on red. |
| `size` | `size` attribute | — | `wide` or `super-wide`. Slot placement adjusts in collections (see [Responsive layout](#responsive-layout)). |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Parallel arrays; icon size `l`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons (`style: 'consonant'` sets the `consonant` attribute). CTA size `m`. |

### Allowed badge and border colors {#allowed-colors}

| Token | Used for |
| --- | --- |
| `spectrum-yellow-300-plans` | Badge and/or border |
| `spectrum-gray-300-plans` | Badge and/or border |
| `spectrum-gray-700-plans` | Badge only |
| `spectrum-green-900-plans` | Badge and/or border |
| `spectrum-red-700-plans` | Badge and/or border (default badge color; adds drop-shadow when used as border or badge) |
| `gradient-purple-blue` | Badge and/or border |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card when the mapping includes `secureLabel: true`. |
| `displayPlanType` | Passed to the legal price clone via `priceOptionsProvider()`; controls plan-type text in the legal line. |
| `addon` | Fallback HTML for `merch-addon` when `fields.addon` is absent. |
| `quantitySelect` | Fallback markup when `fields.quantitySelect` is absent. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

## Stock toggle {#stock-toggle}

When `checkbox-label` is present on `merch-card`, the layout renders a stock checkbox in the card body (`#stock-checkbox`). The checkbox label text comes from the attribute value.

`toggleStockOffer()` in `merch-card.js` runs on checkbox change. It requires:

| Attribute | Format | Effect |
| --- | --- | --- |
| `stock-offer-osis` | Comma-separated PUF, ABM, M2M offer IDs | Parsed into `{ PUF, ABM, M2M }`. The OSI matching the checkout link's `planType` is appended to or removed from each footer checkout link's `data-wcs-osi` when the checkbox is toggled. |

These attributes are **not** set by `hydrate.js`. Set them on the element in markup, or author `checkboxLabel` / `stockOfferOsis` fragment fields where your integration maps them to card attributes (as in Studio preview).

```html {.demo}
<merch-card
  variant="plans-v2"
  checkbox-label="Add a 30-day free trial of Adobe Stock.*"
  stock-offer-osis="stock-puf,stock-abm,stock-m2m"
>
  <!-- slotted content with checkout links -->
</merch-card>
```

## Short description {#short-description}

The `shortDescription` AEM field hydrates into the `short-description` slot. `PlansV2` renders it below the footer:

| Viewport | Behavior |
| --- | --- |
| Mobile (`Media.isMobile`) | Collapsed accordion. Toggle label is extracted from the first `<strong>`, `<b>`, heading, `<p>`, or first text line in the slot content. The matched first element is hidden in the expanded panel (shown only in the toggle label). Click toggles `.expanded` on the toggle and content panels. |
| Tablet and up | Always-visible `.short-description-content.desktop` panel with top border; no toggle. |

When short description content is present, the card sets `has-short-description` (used for collection grid height sync). Hydration also sets `action-menu="true"` and defaults `action-menu-label` to `More options` when `actionMenuLabel` is absent.

Toggle and panel colors use CSS custom properties (`--consonant-merch-card-plans-v2-toggle-*`, `--consonant-merch-card-plans-v2-divider-color`). In `.dark` context, short-description panels stay white with dark text.

## Legal price {#legal-price}

After hydration, `adjustLegal()` clones the main `inline-price` (`data-template="price"`) in `heading-m`, inserts it as a sibling with `data-template="legal"`, and disables per-unit, tax, and plan-type display on the main price. Per-unit and plan-type text appear on the legal clone instead, controlled by `settings.displayPlanType`.

## Responsive layout {#responsive-layout}

`renderLayout()` branches on `size`:

| Size | Body layout |
| --- | --- |
| Default | Icons + title/subtitle wrapper, `heading-m`, description, stock checkbox, addon, badge. |
| `wide` | Horizontal icon + title row, subtitle, description, stock checkbox, addon, badge, price divider, then `heading-m`. Max width 768px. Subtitle uses large display typography. |

Inside a collection (`merch-card-collection`, grid wrappers, etc.), `adaptForMedia()` relocates slots at desktop widths:

| Slot | Moves to footer when | Condition |
| --- | --- | --- |
| `heading-m` | `size="wide"` | Collection context + desktop |
| `addon` | `size="super-wide"` | Collection context + desktop |
| `callout-content` | `size="super-wide"` | Collection context + desktop |

At desktop widths (≥768px), visible cards in the same collection row sync `.body`, `footer`, and `[slot="short-description"]` heights via `syncHeights()`.

## Collection options {#collection-options}

`PlansV2.collectionOptions` (registered in `variants/variants.js`) customizes [merch-card-collection](merch-card-collection.html) behavior:

| Option | Value | Effect |
| --- | --- | --- |
| `headerVisibility.search` | `false` | Hides collection search in the header. |
| `headerVisibility.sort` | `false` | Hides sort menu. |
| `headerVisibility.result` | `['mobile', 'tablet']` | Shows result-count text on mobile/tablet. |
| `headerVisibility.custom` | `['desktop']` | Shows custom header area on desktop. |
| `customHeaderArea` | Renders `<slot name="resultsText">` | Only when a sidenav is attached; replaces default header content on desktop. |
| `onSidenavAttached` | `minifyOverflowingWideCards` | On desktop, wide cards spanning 2 columns and super-wide cards spanning 3 columns are tracked against a 3-column grid. A wide card at column index 2 is downgraded: `size` moves to `data-size` and is removed so the card reflows to one column. Runs on desktop media change and `merch-card-collection:literals-changed`. Restores `size` from `data-size` before recalculating. |

## Slots {#slots}

Layout from `PlansV2.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Body | Product mnemonics with horizontal fade mask (mask removed on `wide`). |
| `heading-xs` | Body | Plan title. |
| `subtitle` | Body | |
| `heading-m` | Body or footer | Main price; moves to footer on `wide` in collections at desktop. |
| `body-xs` | Body | Description. |
| — | Body | Stock checkbox when `checkbox-label` is set. |
| `addon` | Body or footer | Moves to footer on `super-wide` at desktop in collections. |
| `badge` | Body | |
| `promo-text` | — | In mapping; not placed by `renderLayout()` (hydrated slot exists if authored). |
| `whats-included` | — | In mapping; not placed by `renderLayout()` (hydrated slot exists if authored). |
| `callout-content` | — | In mapping; may move to footer on `super-wide` at desktop in collections. |
| `quantity-select` | Footer | Inside `secureLabelFooter`. |
| `footer` | Footer | CTAs; preceded by secure-transaction label when `secure-label` is set. |
| `short-description` | Below footer | Accordion on mobile; static panel on tablet+. |

<div class="commerce-gallery-content">
  <h1 id="plans-v2-gallery">Plans v2 Gallery</h1>
  <p>Examples from the <a href="commerce.html">Commerce Gallery</a> — cards use <code>spectrum="swc"</code> for Spectrum Web Component CTAs.</p>
  <div class="commerce-container">
    <h2 id="plans-v2-commerce">Commerce Plans v2 <a class="header-anchor" href="#plans-v2-commerce" title="Permalink to this heading">#</a></h2>
    <div class="four-merch-cards commerce-plans">
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="8bd9c722-8b3c-4c65-b135-7f6a1b84f800"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8bd9c722-8b3c-4c65-b135-7f6a1b84f800"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="8487f19d-b038-44fa-9db6-0dc55a85b326"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8487f19d-b038-44fa-9db6-0dc55a85b326"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="a7179d35-1dd2-4f9a-9223-2f8c7062acc7"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=a7179d35-1dd2-4f9a-9223-2f8c7062acc7"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="e243cb07-cb53-439d-bb62-d80f0fd719e5"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=e243cb07-cb53-439d-bb62-d80f0fd719e5"> Open in Studio</a>
      </div>
    </div>
  </div>
</div>
