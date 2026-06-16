## Overview {#overview}

The `mini` card variant is registered in `web-components/src/variants/mini.js`. Set `variant="mini"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

Mini cards are a **headless data source** for Creative Cloud Desktop (CCD) and other surfaces that render commerce data with a custom UI stack (React, Vue, or vanilla JS). The variant still hydrates AEM fragment fields into named slots and exposes parsed values through `merch-card` getters, but the default layout is a minimal reference card (title, price, legal line, description, CTAs) — not a production CCD surface.

See [merch-card](merch-card.html) for shared attributes and events, [inline-price](inline-price.html) for price markup in the `prices` field, and [Headless variant](headless.html) for the label/value debug layout. The `headless` variant lists all authorable fields; `mini` maps only the subset below.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `MINI_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `mini`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `title` | `p` | Plan title. Slot config from mapping key `title`. `mas-mnemonic` elements in title HTML trigger lazy load of `mas-mnemonic.js`. |
| `prices` | `prices` | `p` | HTML with `inline-price` elements (`data-template="price"`). |
| `description` | `description` | `p` | Terms, renewal copy, promo duration, and `upt-link` elements. Checkout links in description HTML are converted to buttons. |
| `ctas` | `ctas` | `div` | Checkout links hydrated as Spectrum or Consonant buttons. CTA size `S`. |

`planType: true` is set on the mapping (shared with `plans`, `product`, and compare variants) but is not read by hydration or the mini layout. Plan-type copy is rendered on the cloned legal `inline-price` when `settings.displayPlanType` is enabled (see [Legal price clone](#legal-price-clone)).

### Badge and border (not in mapping slots) {#badge-border}

`MINI_AEM_FRAGMENT_MAPPING` has no `badge` slot entry. When `fields.badge` is plain text, hydration sets `badge-text`, `badge-color`, `badge-background-color`, and `border-color` on the host; `Mini.renderLayout()` renders the badge via the shared `badge` getter as an absolutely positioned `#badge` div. `trialBadge`, `mnemonics`, `subtitle`, `promoText`, `shortDescription`, `callout`, `whatsIncluded`, `quantitySelect`, `addon`, `backgroundImage`, `backgroundColor`, `borderColor`, and `size` are not hydrated into named slots for this variant.

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `displayPlanType` | Controls plan-type text on the cloned legal `inline-price`. Defaults to `true` when unset (`mini.js` `adjustLegal()`). |
| `displayAnnual` | Passed to `inline-price` via `priceOptionsProvider()`; defaults to `false` when unset. |
| `hideTrialCTAs` | Removes trial CTAs from the `ctas` slot during hydration. |

## Price options {#price-options}

`Mini.priceOptionsProvider()` runs for each `inline-price` on the card:

- Clears `strikethroughAriaLabel` and `alternativePriceAriaLabel` literals (accessibility text is omitted from visible price strings).
- Sets `options.space = true`.
- Sets `options.displayAnnual` from `settings.displayAnnual` (default `false`).

## Legal price clone {#legal-price-clone}

After hydration and price settlement, `postCardUpdateHook()` calls `adjustLegal()` once per card:

1. Finds the main price: `inline-price[data-template="price"]`.
2. Clones it, sets `data-template="legal"`, `slot="legal"`, and appends it to the card.
3. On the original price, sets `data-display-tax="false"` and `data-display-per-unit="false"`.
4. On the legal clone, sets `data-display-plan-type` from `settings.displayPlanType` (default `true`).

Plan-type text is read by the `planTypeText` getter from `[is="inline-price"][data-template="legal"] span.price-plan-type`.

## Slots {#slots}

Layout from `Mini.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| (badge) | Overlay | Rendered from host `badge-text` / `badge-color` / `badge-background-color` when hydrated; not a named slot. |
| `title` | Body | Plan title (`p`). `headingSelector` for the `title` getter. |
| `prices` | Body | Main price `inline-price`. |
| `legal` | Body | Injected at runtime by `adjustLegal()`; not authored directly. |
| `description` | Body | Terms, `renewal-text`, `promo-duration-text`, and `upt-link`. |
| `ctas` | Body | Checkout buttons; flex row, end-aligned. Size `S`. |

Host CSS (`mini.css.js`) sets card width 400px and height 250px; `span.promo-duration-text` and `span.renewal-text` render as block elements.

## Consumer getters {#consumer-getters}

CCD and other headless consumers typically call `await card.checkReady()` then read these `merch-card` getters (see `web-components/test/merch-card.mini.test.html.js`):

| Getter | Source | Notes |
| --- | --- | --- |
| `title` | `[slot="title"]` via `headingSelector` | |
| `regularPrice` | `inline-price[data-template="price"]` inner text | |
| `promoPrice` | Strikethrough price text when `data-display-old-price` is set | |
| `promotionCode` | First `data-promotion-code` on price or checkout elements, else `contextPromotionCode` from fragment `promoCode` | |
| `annualPrice` | `.price-annual` inside main price | |
| `taxText` | `.price-tax-inclusivity` on legal or main price | |
| `recurrenceText` | `.price-recurrence` on main price | |
| `unitText` | `.price-unit-type` on legal, main price, or card | |
| `planTypeText` | Legal clone `.price-plan-type` | |
| `renewalText` | `span.renewal-text` in description | |
| `promoDurationText` | `span.promo-duration-text` in description | |
| `seeTermsInfo` | `a[is="upt-link"]` | `{ text, analyticsId, href }` |
| `ctas`, `primaryCta`, `secondaryCta` | `[slot="ctas"]` checkout links/buttons | Primary = accent / blue Consonant button |

The built-in `description` getter queries `[slot="body-xs"]` and does **not** return mini description content. Read `[slot="description"]` directly when needed.

## Example {#example}

Manual markup showing the mini slot layout. In production, use `<aem-fragment>` and set `variant: "mini"` on the fragment.

```html {.demo}
<merch-card variant="mini">
  <p slot="title">CCD Apps: Photography</p>
  <p slot="prices">
    <span is="inline-price" data-template="price" data-wcs-osi="example-osi"></span>
  </p>
  <p slot="description">
    <a is="upt-link" href="#" data-analytics-id="see-terms">see terms</a>
  </p>
  <div slot="ctas">
    <button is="checkout-button" class="spectrum-Button spectrum-Button--accent spectrum-Button--sizeS">
      <span class="spectrum-Button-label">Buy now</span>
    </button>
  </div>
</merch-card>
<mas-commerce-service env="stage"></mas-commerce-service>
```

<aem-fragment fragment="3413c156-219f-43e6-89f6-3a65cae9fca3" title="Mini Cards collection to prewarm the cache"></aem-fragment>

<div class="gallery-content">
  <h1 id="ccd-gallery" tabindex="-1">CCD Mini cards</h1>
  Switch Theme: <a class="theme-toggle spectrum-Link spectrum-Link--secondary" value="darkest" href="#">Darkest</a> OR <a class="theme-toggle spectrum-Link spectrum-Link--secondary" value="light" href="#">Light</a>
  <p class="locales">Select country/language:
    <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="US,en" href="?country=US&language=en" title="en_US">🇺🇸</a>
    <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="AU,en" href="?country=AU&language=en" title="en_AU">🇦🇺</a>
    <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="CA,en" href="?country=CA&language=en" title="en_CA">🇨🇦</a>
    <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="CA,fr" href="?country=CA&language=fr" title="fr_CA">🇨🇦<span>fr</span></a>
    <a class="locale-toggle spectrum-Link spectrum-Link--secondary" value="FR,fr" href="?country=FR&language=fr" title="fr_FR">🇫🇷</a>
  </p>
  <h2 id="ccd-mini-card" tabindex="-1">CCD Mini Cards</h2>
  <div class="cards">
    <merch-card><aem-fragment fragment="03a36f0f-3e5d-4881-ae6b-273c517c9d38" loading="cache"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="df357350-95b2-47f2-844f-df2e491eecef" loading="cache"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="77e049ee-c611-437b-bbeb-c54cf72605b1"></aem-fragment></merch-card>
    <merch-card><aem-fragment fragment="52b30904-c8b1-44d2-ada4-cbbdf87b7603"></aem-fragment></merch-card>
  </div>
</div>
