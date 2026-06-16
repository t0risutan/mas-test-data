<script type="module" src="../dist/mas.js"></script>

# Headless variant {#headless}

## Overview {#overview}

The `headless` card variant is registered in `web-components/src/variants/headless.js`. Set `variant="headless"` on `<merch-card>` or let AEM hydration infer it from the fragment `variant` field.

This variant renders fragment content as a vertical stack of **label + value** rows with no card chrome — border, background, and box-shadow are removed on `:host([variant='headless'])`. Row labels match the merch-card editor (`merch-card-editor.js`) and define render order.

Use it to preview or debug all authorable fields from a merch-card AEM fragment without the visual layout of plans, product, or other surface variants.

See [merch-card](merch-card.html) for shared attributes and events.

**Not to be confused with** the `mini` variant, which is also described as a headless data source for custom rendering in React, Vue, or vanilla JS. The `mini` variant does not render label/value rows.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `HEADLESS_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. Must be `headless`. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` | `p` | Title row. Slot config from mapping key `title`. |
| `subtitle` | `body-xxs` | `p` | |
| `description` | `body-xs` | `div` | Product description. Checkout links in description HTML are converted to buttons. |
| `promoText` | `promo-text` | `p` | |
| `shortDescription` | `short-description` | `p` | Sets `action-menu="true"` on the card during hydration when present; rendered as a label/value row only (no action-menu UI in this variant). |
| `callout` | `callout-content` | `div` | |
| `quantitySelect` | `quantity-select` | `div` | Serialized `merch-quantity-select` HTML. |
| `whatsIncluded` | `whats-included` | `div` | `merch-whats-included` markup. |
| `addonConfirmation` | `addon-confirmation` | `div` | |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`; HTML passthrough when already tagged. |
| `trialBadge` | `trial-badge` | `div` | Plain text is wrapped in `merch-badge`. |
| `prices` | `prices` | `p` | HTML with `inline-price` elements. |
| `backgroundImage` | `bg-image` | `div` | Wraps an `<img>` with `src` from the field. |
| `addon` | `addon` | — | Creates `merch-addon` from field HTML or `settings.addon`. |
| `borderColor` | `border-color` attribute | — | Hydrated onto the host; no visible border in this variant. |
| `backgroundColor` | `background-color` attribute | — | Hydrated onto the host; host background is transparent. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Parallel arrays; icon size `m`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Spectrum or Consonant buttons. CTA size `m`. |

`size` is listed in the mapping as an empty array (`size: []`), so `processSize()` does not set a `size` attribute on headless cards.

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card when the mapping includes `secureLabel: true`. Rendered as a separate "Secure label" row (not inside the `footer` slot). |
| `addon` | Fallback HTML for `merch-addon` when `fields.addon` is absent. |
| `quantitySelect` | Fallback markup when `fields.quantitySelect` is absent. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

## Label/value rows {#label-value-rows}

`Headless.renderLayout()` outputs one row per entry in `HEADLESS_FIELDS`. Each row has a fixed label (left) and a value column (right) with the named slot. Slotted children render inline in the value column (`::slotted(*) { display: inline; }`).

| Label (editor) | Slot | Notes |
| --- | --- | --- |
| Background Image | `bg-image` | |
| Badge | `badge` | |
| Mnemonic icon | `icons` | Populated from `mnemonicIcon` / `mnemonicAlt` / `mnemonicLink` during hydration. |
| Title | `heading-xs` | |
| Subtitle | `body-xxs` | |
| Product description | `body-xs` | |
| Promo Text | `promo-text` | |
| Callout text | `callout-content` | |
| Short Description | `short-description` | |
| Trial Badge | `trial-badge` | |
| Product price | `prices` | |
| Quantity select | `quantity-select` | |
| Addon | `addon` | `merch-addon` element. |
| What's included | `whats-included` | |
| Addon confirmation | `addon-confirmation` | |
| CTAs | `footer` | |

When `secure-label` is set on the card (from `settings.secureLabel` during hydration), an additional row is appended after the table above:

| Label | Source | Notes |
| --- | --- | --- |
| Secure label | `secure-label` attribute | Rendered via `secureLabel` getter as `<span class="secure-transaction-label">`; not a named slot. |

Empty slots still render their label row; the value column is blank when no content is hydrated or authored.

## Example {#example}

Manual markup showing the label/value layout. In production, use `<aem-fragment>` and set `variant: "headless"` on the fragment.

```html {.demo .light}
<merch-card variant="headless" secure-label="Secure transaction">
  <merch-icon slot="icons" src="/icons/acrobat.svg" alt="Acrobat" size="m"></merch-icon>
  <p slot="heading-xs">Acrobat Pro</p>
  <p slot="body-xxs">PDF and e-sign tools</p>
  <div slot="body-xs"><p>Access advanced PDF tools on desktop and mobile.</p></div>
  <p slot="prices">
    <span is="inline-price" data-wcs-osi="example-osi"></span>
  </p>
  <div slot="footer">
    <a href="#" class="accent">Buy now</a>
  </div>
</merch-card>
<mas-commerce-service env="stage"></mas-commerce-service>
```
