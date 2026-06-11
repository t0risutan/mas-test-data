## Overview {#overview}

Adobe Express pricing cards are registered in `web-components/src/variants/simplified-pricing-express.js` and `web-components/src/variants/full-pricing-express.js`. Set `variant="simplified-pricing-express"` or `variant="full-pricing-express"` on `<merch-card>`, or let AEM hydration infer the variant from the fragment `variant` field.

Both variants share Express-specific typography, indigo accent CTAs, gradient border options, and collection grid CSS. **Simplified** is a compact card with price and CTA in the body; **full** adds a short-description region, a shaded price block, trial badge, header icons, and a feature list in `body-s`.

See [merch-card](merch-card.html) for shared attributes and events, [merch-card-collection](merch-card-collection.html) for collection wiring, and [inline-price](inline-price.html) for price markup in the `prices` field.

## Variants {#variants}

| Variant | Mapping constant | Card width (desktop) | Layout summary |
| --- | --- | --- | --- |
| `simplified-pricing-express` | `SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING` | 365px (`--merch-card-simplified-pricing-express-width`) | Badge, title, description, price + callout, CTA. Mobile accordion. |
| `full-pricing-express` | `FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING` | 437px (`--merch-card-full-pricing-express-width`) | Badge, title + icons, short description, shaded price block (trial badge, price, callout), CTA, feature list (`body-s`). |

## Collection setup {#collection-setup}

Express cards are designed to render inside `<merch-card-collection>` with a **variant-matching CSS class** on the collection element. Global layout CSS from each variant's `*.css.js` file targets these selectors:

| Variant | Collection class | Grid behavior |
| --- | --- | --- |
| `simplified-pricing-express` | `simplified-pricing-express` | 1 column (mobile/tablet); 3 columns at ≥1200px. Max width `calc(3 * var(--merch-card-simplified-pricing-express-width) + 32px)`. |
| `full-pricing-express` | `full-pricing-express` | 1 column (mobile); 2 columns at 768px–1399px; 3 columns at ≥1400px. |

```html {.demo}
<merch-card-collection class="merch-card-collection simplified-pricing-express" filter="all" filtered="all" page="1">
  <merch-card variant="simplified-pricing-express" data-default-card="true">
    <aem-fragment fragment="67c78f03-7d88-44c9-9a06-05443ec9265d"></aem-fragment>
  </merch-card>
  <merch-card variant="simplified-pricing-express">
    <aem-fragment fragment="b28957b9-2341-40f9-9004-24446f68e5e5"></aem-fragment>
  </merch-card>
</merch-card-collection>
<mas-commerce-service env="stage"></mas-commerce-service>
```

### Height sync {#height-sync}

When cards share a collection container (`merch-card-collection` or a parent with a `*-merch-cards` class), the variant layout measures sibling cards and sets shared min-height CSS variables on the container:

| Variant | Sync runs when | Synced regions |
| --- | --- | --- |
| `simplified-pricing-express` | Desktop (≥1200px) | `.header`, `.description` (`body-xs`), icon row (`body-xs p:has(mas-mnemonic)`), `.price-container`, `.cta` |
| `full-pricing-express` | Tablet and up (≥768px) | `.header`, `.short-description`, `.price-container`, `.cta` |

A `ResizeObserver` on each card re-syncs siblings when card width changes.

### Default card (simplified only) {#default-card}

`SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING` sets `supportsDefaultChild: true`. When a collection is hydrated from AEM hierarchy metadata, `merch-card-collection` sets `data-default-card="true"` on the default fragment's card.

On viewports below 768px, the default card starts with `data-expanded="true"`; other simplified cards start collapsed. This drives the mobile accordion (see [Simplified mobile accordion](#simplified-mobile-accordion)). Set `data-default-card="true"` manually on one card when authoring markup outside AEM hierarchy hydration.

## Simplified pricing express {#simplified-pricing-express}

### AEM fragment fields {#simplified-aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `simplified-pricing-express`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `h3` | Plan title. Truncated to 250 characters; overflow gets a `title` tooltip when `withSuffix` applies. Inline `mas-mnemonic` in title HTML triggers lazy load of `mas-mnemonic.js`. |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`; HTML passthrough when already tagged. Default background token is `spectrum-blue-400`. |
| `description` | `body-xs` | `div` | Truncated to 2000 characters without suffix. Inline `mas-mnemonic` elements in HTML are preserved. |
| `prices` | `price` | `div` | HTML with `inline-price` elements. |
| `callout` | `callout-content` | `div` | Editor label: "Price description". Rendered below price in `.price-container`. |
| `borderColor` | `border-color` attribute / CSS variable | — | See [Border colors](#border-colors). |
| `ctas` | `cta` | — | Checkout links hydrated as buttons. CTA size `XL`. Full-width pill buttons. |

Fields not listed in `SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING` (for example `subtitle`, `shortDescription`, `whatsIncluded`, `trialBadge`, `quantitySelect`, `addon`, and `mnemonicIcon`) are not hydrated into this variant.

`disabledAttributes` on the mapping prevents hydration from setting `badgeColor`, `badgeBorderColor`, `trialBadgeColor`, and `trialBadgeBorderColor` on the card host.

### Allowed badge colors {#simplified-badge-colors}

| Token |
| --- |
| `spectrum-blue-400` (default) |
| `spectrum-gray-300` |
| `spectrum-yellow-300` |
| `gradient-purple-blue` |
| `gradient-firefly-spectrum` |

When the badge default is in `allowedBadgeColors` and `borderColor` is absent, hydration copies the badge default to `borderColor`.

### Slots {#simplified-slots}

Layout from `SimplifiedPricingExpress.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `badge` | Above `.card-content` | Hidden placeholder when empty (`visibility: hidden` on wrapper). |
| `heading-xs` | Header | Title with chevron button (mobile). |
| `trial-badge` | Header | Slot exists in layout but **not** in AEM mapping — manual markup only. |
| `body-xs` | Description | Paragraphs with optional trailing `mas-mnemonic` row. |
| `price` | Price container | Above callout. |
| `callout-content` | Price container | Below price. |
| `cta` | Footer of card content | Full-width CTA. Long labels (>34 characters) get class `small-font-size-button` on desktop. |
| (default) | Outside `.card-content` | Catch-all slot after main column. |

### Simplified mobile accordion {#simplified-mobile-accordion}

Below 768px (`MOBILE_LANDSCAPE`), simplified cards collapse to a header-only strip:

| State | Behavior |
| --- | --- |
| Collapsed (`data-expanded="false"`) | `.card-content` max-height 50px; `body-xs`, `price`, `callout-content`, and `cta` slots hidden with opacity/max-height transitions. |
| Expanded (`data-expanded="true"`) | Full card content visible. |
| Default card | Starts expanded on mobile. |
| Interaction | Clicking `.card-content` or the chevron toggles expansion. Clicks on `.chevron-button`, `mas-mnemonic`, `button`, `a`, or `[role="button"]` do not toggle. |
| Desktop (≥768px) | Accordion disabled; `data-expanded` attribute removed. |

On tablet (768px–1199px) and mobile, the badge wrapper is hidden unless `gradient-border="true"`.

## Full pricing express {#full-pricing-express}

### AEM fragment fields {#full-aem-fields}

During hydration, each field below is mapped through `FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `full-pricing-express`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `h3` | Plan title. Truncated to 250 characters; overflow gets a `title` tooltip when `withSuffix` applies. |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`. Default background `spectrum-blue-400`. |
| `shortDescription` | `short-description` | `div` | Truncated to 3000 characters. When present, hydration also sets `action-menu="true"` and `action-menu-label="More options"` (generic `processDescription` behavior); this variant does not render an action menu. |
| `description` | `body-s` | `div` | Feature list and footer content. Truncated to 2000 characters. Inline `mas-mnemonic` preserved. |
| `prices` | `price` | `div` | HTML with `inline-price` elements. Centered in shaded price block. |
| `callout` | `callout-content` | `div` | Editor label: "Price description". Inside price block below price. |
| `trialBadge` | `trial-badge` | `div` | Plain text wrapped in `merch-badge`. Positioned at top-right of price block. |
| `borderColor` | `border-color` attribute / CSS variable | — | See [Border colors](#border-colors). |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Parallel arrays; icon size `xs` from `mapping.mnemonics`. Header row beside title. |
| `ctas` | `cta` | — | Checkout links hydrated as buttons. CTA size `XL`. Long labels (>49 characters) get class `small-font-size-button` on desktop. |

Fields not listed (for example `subtitle`, `whatsIncluded`, `promoText`, `quantitySelect`, and `addon`) are not hydrated into this variant. Feature content is authored in the `description` field as HTML in `body-s`.

`showAllSpectrumColors: true` in the mapping expands the Studio color picker; it does not change runtime hydration.

### Allowed badge colors {#full-badge-colors}

Same tokens as [simplified badge colors](#simplified-badge-colors).

### Slots {#full-slots}

Layout from `FullPricingExpress.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `badge` | Above `.card-content` | |
| `heading-xs` | Header | Title; may include inline `mas-mnemonic`. |
| `icons` | Header | `merch-icon` mnemonics from `mnemonicIcon` fields; hidden when empty. |
| `short-description` | Below header | Intro copy above price block. |
| `trial-badge` | Price container (absolute top-right) | |
| `price` | Price container | Shaded `#f8f8f8` block with border. |
| `callout-content` | Price container | Below price. |
| `cta` | Below price block | Full-width CTA above feature list. |
| `body-s` | Bottom of card | Feature list (`ul`/`li`), dividers (`hr`), and trailing link/button. |
| (default) | Outside `.card-content` | Catch-all slot. |

### Full mobile body-s {#full-mobile-body}

Below 768px, most `body-s` children are hidden. Only the last `hr` and the last `p` (typically a "see all features" link) remain visible. The full feature list appears at tablet and desktop widths.

## Border colors {#border-colors}

`processBorderColor()` reads `borderColor` against each variant's `borderColor.specialValues`:

| Author value | Effect |
| --- | --- |
| `gray` | Border color CSS variable `--spectrum-gray-300`. |
| `blue` | Border color CSS variable `--spectrum-blue-400`. |
| `gradient-purple-blue` | Sets `gradient-border="true"` and `border-color="gradient-purple-blue"`. Gradient applied to badge wrapper and card shell. |
| `gradient-firefly-spectrum` | Sets `gradient-border="true"` and `border-color="gradient-firefly-spectrum"`. |
| Other Spectrum tokens | Applied via `--consonant-merch-card-border-color: var(--<token>)`. |
| `transparent` | Border color set to transparent. |

With `gradient-border="true"`, badge text is forced to white and the inner card content uses a pseudo-element inset background.

## Example {#example}

Manual markup for a simplified card. In production, use `<aem-fragment>` and set `variant: "simplified-pricing-express"` on the fragment.

```html {.demo}
<merch-card variant="simplified-pricing-express" border-color="gradient-purple-blue" gradient-border="true">
  <div slot="badge">
    <merch-badge background-color="gradient-purple-blue">Best value</merch-badge>
  </div>
  <h3 slot="heading-xs">Adobe Express Premium</h3>
  <div slot="body-xs">
    <p>Create standout social posts, flyers, and videos.</p>
    <p><mas-mnemonic product="photoshop"></mas-mnemonic><mas-mnemonic product="premiere"></mas-mnemonic></p>
  </div>
  <div slot="price">
    <p><span is="inline-price" data-wcs-osi="example-osi" data-template="price"></span></p>
  </div>
  <div slot="callout-content"><p>Cancel anytime.</p></div>
  <div slot="cta">
    <button is="checkout-button" class="spectrum-Button spectrum-Button--accent spectrum-Button--sizeXL">
      <span class="spectrum-Button-label">Free trial</span>
    </button>
  </div>
</merch-card>
<mas-commerce-service env="stage"></mas-commerce-service>
```

<div class="gallery-content">
  <h1 id="express-gallery" tabindex="-1">Express Gallery <a class="header-anchor" href="#express-gallery" title="Permalink to this heading">#</a></h1>

  Switch Theme: <a class="theme-toggle spectrum-Link spectrum-Link--secondary" value="dark" href="#">Dark</a> OR <a class="theme-toggle spectrum-Link spectrum-Link--secondary" value="light" href="#">Light</a>

  Switch Locale: <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="en_US" href="?locale=en_US">en_US</a> OR <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="fr_FR" href="?locale=fr_FR">fr_FR</a>

  Switch country/language: <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="US,en" href="?country=US&language=en">Country: US, language: en</a> OR <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="FR,fr" href="?country=FR&language=fr">Country: FR, language: fr</a>

  <div class="express-container">
    <h2 id="express-card-simplified" tabindex="-1">Express Card (Simplified Pricing) <a class="header-anchor" href="#express-card-simplified" title="Permalink to this heading">#</a></h2>

    <merch-card-collection filter="all" class="merch-card-collection simplified-pricing-express" filtered="all" page="1">
      <merch-card variant="simplified-pricing-express" data-default-card="true">
        <aem-fragment fragment="67c78f03-7d88-44c9-9a06-05443ec9265d"></aem-fragment>
      </merch-card>
      <merch-card variant="simplified-pricing-express">
        <aem-fragment fragment="b28957b9-2341-40f9-9004-24446f68e5e5"></aem-fragment>
      </merch-card>
      <merch-card variant="simplified-pricing-express">
        <aem-fragment fragment="aaa728dc-2b44-495c-b9f0-bb82044db18a"></aem-fragment>
      </merch-card>
    </merch-card-collection>

    <h2 id="express-card-full" tabindex="-1">Express Card (Full Pricing) <a class="header-anchor" href="#express-card-full" title="Permalink to this heading">#</a></h2>

    <merch-card-collection filter="all" class="merch-card-collection full-pricing-express" filtered="all" page="1">
      <merch-card variant="full-pricing-express">
        <aem-fragment fragment="53fcf015-5c28-4214-bd2b-d4c22f1774b8"></aem-fragment>
      </merch-card>
      <merch-card variant="full-pricing-express">
        <aem-fragment fragment="025dfceb-c035-45b7-8ea1-8feed25c8009"></aem-fragment>
      </merch-card>
      <merch-card variant="full-pricing-express" gradient-border="true" border-color="gradient-firefly-spectrum">
        <aem-fragment fragment="9406f1ae-7bee-48c3-9892-49af6816033e"></aem-fragment>
      </merch-card>
    </merch-card-collection>
  </div>
</div>
