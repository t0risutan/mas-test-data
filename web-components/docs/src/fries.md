## Overview {#overview}

The `fries` card variant is a compact horizontal plan card registered in `web-components/src/variants/fries.js`. Set `variant="fries"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

Fries cards show a header row (product icon, title, trial badge), an optional corner badge, description with inline app mnemonics, optional what's-included, and a footer row with CTA plus price. Default background is `--spectrum-gray-300`; max width is 620px.

See [merch-card](merch-card.html) for shared attributes and events, and [merch-whats-included](merch-whats-included.html) for the expandable feature list used in the `whatsIncluded` field.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `FRIES_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `fries`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xxs` | `h3` | Plan title. Slot config from mapping key `title`. Truncated to 250 characters; overflow gets a `title` tooltip when `withSuffix` applies. |
| `description` | `body-s` | `div` | Product description. Truncated to 2000 characters without suffix. Checkout links in description HTML are converted to buttons. `mas-mnemonic` elements in HTML trigger lazy load of `mas-mnemonic.js`. |
| `whatsIncluded` | `whats-included` | `div` | `merch-whats-included` markup. |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`; HTML passthrough when already tagged. Mapping default background token is `spectrum-yellow-300`. Badge is positioned at the top-right of the card. |
| `trialBadge` | `trial-badge` | `div` | Plain text is wrapped in `merch-badge` with border color from `trialBadgeBorderColor` or the global default. Rendered in the header row beside the title. |
| `prices` | `price` | `p` | HTML with `inline-price` elements. Right-aligned in the footer. |
| `addonConfirmation` | `addon-confirmation` | `div` | Confirmation text beside the CTA (green, bold). |
| `borderColor` | `border-color` attribute / CSS variable | — | See [Border colors](#border-colors). |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Parallel arrays; icon size `s` (26×25px in layout CSS). |
| `ctas` | `cta` | — | Checkout links hydrated as buttons in the `cta` slot. CTA size `M`. Placed beside `addon-confirmation` in the footer. |

Fields not listed in `FRIES_AEM_FRAGMENT_MAPPING` (for example `subtitle`, `promoText`, `shortDescription`, `callout`, `quantitySelect`, `addon`, and `size`) are not hydrated into this variant.

`backgroundColor` is not in the fries mapping, so the fragment `backgroundColor` field is not applied during hydration. Set the `background-color` attribute on `<merch-card>` directly to use a Spectrum token (see [Background color](#background-color)).

## Border colors {#border-colors}

`processBorderColor()` reads `borderColor` against the fries mapping `specialValues`:

| Author value | Effect |
| --- | --- |
| `gray` | Border color CSS variable `--spectrum-gray-300`. |
| `gradient-purple-blue` | Sets `gradient-border="true"` and `border-color="gradient-purple-blue"`. Uses `--gradient-purple-blue` for the gradient border. |
| `gradient-firefly-spectrum` | Sets `gradient-border="true"` and `border-color="gradient-firefly-spectrum"`. Uses `--gradient-firefly-spectrum`. |
| Other Spectrum tokens (for example `spectrum-gray-300`) | Applied via `--consonant-merch-card-border-color: var(--<token>)`. |
| `transparent` | Border color set to transparent. |

## Background color {#background-color}

The host uses `--merch-card-custom-background-color` when the `background-color` attribute is set on `<merch-card>`. The reflected attribute sets `var(--<token>)` on that custom property (see `merch-card.js`). Default host background when unset is `--spectrum-gray-300` from variant CSS.

```html {.demo}
<merch-card variant="fries" background-color="spectrum-seafoam-100">
  <merch-icon slot="icons" src="/icons/photoshop.svg" size="s"></merch-icon>
  <h3 slot="heading-xxs">Photoshop</h3>
  <div slot="body-s"><p>Test body</p></div>
  <div slot="cta">
    <button is="checkout-button" class="spectrum-Button spectrum-Button--primary spectrum-Button--sizeM">
      <span class="spectrum-Button-label">Buy now</span>
    </button>
  </div>
</merch-card>
<mas-commerce-service env="stage"></mas-commerce-service>
```

## Mnemonics in description {#description-mnemonics}

Description HTML may include inline app icons (`merch-icon` with class `mnemonic`) and a trailing `+ more apps` label (class `mnemonic-text`). Paragraphs containing `mas-mnemonic` use flex layout with wrapping.

`mas-mnemonic` elements inside a fries card automatically enable viewport-aware tooltip positioning (`smartPlacement`) so tooltips stay on screen in the compact card layout.

## Slots {#slots}

Layout from `FriesCard.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Header | Product mnemonic; hidden when no icons are hydrated. |
| `heading-xxs` | Header | Plan title (`h3`). |
| `trial-badge` | Header | Trial or promo badge beside the title. |
| `badge` | Content (absolute top-right) | Corner badge overlay. |
| `body-s` | Content | Description and inline mnemonics. |
| `whats-included` | Content | Below description when present. |
| `cta` | Footer | Primary checkout button(s). |
| `addon-confirmation` | Footer | Beside CTA inside `.cta` wrapper. |
| `price` | Footer | Main price; right-aligned opposite CTA. |
| (default) | Outside `.content` | Catch-all slot after the main content column. |

## Example {#example}

Manual markup showing the fries layout. In production, use `<aem-fragment>` and set `variant: "fries"` on the fragment.

```html {.demo}
<merch-card variant="fries" style="--consonant-merch-card-border-color: var(--spectrum-gray-300);">
  <merch-icon slot="icons" src="/icons/illustrator.svg" size="s"></merch-icon>
  <div slot="badge">
    <merch-badge background-color="spectrum-yellow-300" variant="fries"></merch-badge>
  </div>
  <div slot="trial-badge">
    <merch-badge border-color="spectrum-green-800" variant="fries">7-day trial</merch-badge>
  </div>
  <h3 slot="heading-xxs">Creative Cloud All Apps — with Acrobat Pro</h3>
  <div slot="body-s">
    <p>Save big when you bundle our favorite apps into the ultimate creative toolkit.</p>
    <p>
      <span class="mnemonic"><merch-icon src="/icons/photoshop.svg" size="xs" alt="Photoshop"></merch-icon></span>
      <span class="mnemonic-text">+ more apps</span>
    </p>
  </div>
  <p slot="price">
    <span is="inline-price" data-wcs-osi="example-osi"></span>
  </p>
  <div slot="cta">
    <button is="checkout-button" class="spectrum-Button spectrum-Button--primary spectrum-Button--sizeM">
      <span class="spectrum-Button-label">1-month free trial</span>
    </button>
  </div>
</merch-card>
<mas-commerce-service env="stage"></mas-commerce-service>
```

<div class="fries-gallery-content">
  <h1 id="fries-gallery">Fries Gallery</h1>
  <a class="fries-link" target="_blank" href="https://main--milo--adobecom.aem.page/merch/mas/fries">Test Fries collection page ↗</a>
  <h2 id="crd-mrch-fries">Fries Cards <a class="header-anchor" href="#crd-mrch-fries" title="Permalink to this heading">#</a></h2>
  <div class="fries-merch-cards">
    <merch-card><aem-fragment fragment="8bd9c722-8b3c-4c65-b135-7f6a1b84f800" title="Creative Cloud All Apps — with Acrobat Pro"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="06b88745-45eb-42a0-ab5d-f779b18525bf" title="Photography plan 1TB"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="a7179d35-1dd2-4f9a-9223-2f8c7062acc7" title="Adobe Stock — access 700M+ images, videos, and more, plus Gen AI all in one plan"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="e243cb07-cb53-439d-bb62-d80f0fd719e5" title="AI Assistant for Acrobat — try it for 7 days"></aem-fragment></merch-card>
  </div>
</div>
