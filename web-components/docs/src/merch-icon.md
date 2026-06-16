<script type="module" src="../dist/mas.js"></script>

# merch-icon {#merch-icon}

## Introduction {#introduction}

`merch-icon` renders a product or app icon from an image URL. It supports preset sizes, optional link wrapping, lazy loading, and a light-DOM tooltip fallback when Spectrum Web Components are not on the page.

Primary placements:

1. **`slot="icons"` on [merch-card](merch-card.html)** — product mnemonics in the card header (plans, product, catalog, and related variants). AEM hydration creates these from parallel `mnemonicIcon`, `mnemonicAlt`, and `mnemonicLink` fragment fields.
2. **`slot="icon"` inside [merch-mnemonic-list](merch-whats-included.html)** — row icons in [merch-whats-included](merch-whats-included.html) feature lists.
3. **Child of [mas-mnemonic](mas-mnemonic.html)** — inline info icons in body copy (Express variants, fries, and similar).

Registered when [mas.js](mas.js.html) or [merch-card](merch-card.html) loads.

See also: [merch-card](merch-card.html), [merch-whats-included](merch-whats-included.html), [merch-badge](merch-badge.html), [Plans Gallery](plans.html), [Product Gallery](product.html).

## Example {#example}

Product icon on a `plans` card. Variant layouts target the `icons` slot in the card body.

```html {.demo .light}
<merch-card variant="plans" badge-text="Recommended">
  <merch-icon
    slot="icons"
    size="l"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg"
    alt="Creative Cloud All Apps"
  ></merch-icon>
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <div slot="body-xs"><p>Get 20+ Creative Cloud apps.</p></div>
  <div slot="footer">
    <a href="#" class="con-button blue">Buy now</a>
  </div>
</merch-card>
```

Linked icon. When `href` is set, the image is wrapped in an anchor.

```html {.demo .light}
<merch-icon
  size="l"
  href="https://www.adobe.com/creativecloud.html"
  src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg"
  alt="Creative Cloud"
></merch-icon>
```

Size comparison. Default size is `m` (30×30 px).

```html {.demo .light}
<div style="display: flex; gap: 16px; align-items: center;">
  <merch-icon
    size="xxs"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="xxs"
  ></merch-icon>
  <merch-icon
    size="xs"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="xs"
  ></merch-icon>
  <merch-icon
    size="s"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="s"
  ></merch-icon>
  <merch-icon
    size="m"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="m"
  ></merch-icon>
  <merch-icon
    size="l"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="l"
  ></merch-icon>
</div>
```

## Attributes {#attributes}

| Attribute | Property | Description | Default | Reflects |
| --- | --- | --- | --- | --- |
| `src` | `src` | Image URL rendered as `<img src="…">`. | `''` | yes |
| `alt` | `alt` | `alt` text on the image. | `''` | yes |
| `size` | `size` | Preset dimensions via host attribute selectors (see [Sizes](#sizes)). | `m` | yes |
| `href` | `href` | When set, wraps the image in `<a href="…">`. | `''` | yes |
| `loading` | `loading` | Native `loading` attribute on the `<img>` (`lazy`, `eager`, etc.). | `lazy` | yes |

## Sizes {#sizes}

Host `size` sets `--img-width` and `--img-height` on the component. Override with `--mod-img-width` / `--mod-img-height` on the host.

| `size` | Dimensions |
| --- | --- |
| `xxs` | 13×13 px |
| `xs` | 20×20 px |
| `s` | 24×24 px |
| `m` | 30×30 px (default) |
| `l` | 40×40 px |

Variant AEM mappings set a default mnemonic size in `mapping.mnemonics.size` during hydration. When absent, hydration falls back to `l`.

| Card variant | Hydrated mnemonic `size` |
| --- | --- |
| `plans`, `plans-v2`, `product`, `catalog`, `image`, `mini-compare-chart`, `mini-compare-chart-mweb`, `ccd-suggested` | `l` |
| `headless`, `ccd-slice` | `m` |
| `fries`, `ah-try-buy-widget`, `ah-promoted-plans` | `s` |
| `full-pricing-express`, `simplified-pricing-express` | `xs` |

## On merch-card {#on-merch-card}

### icons slot {#icons-slot}

Place one or more `merch-icon` elements in `slot="icons"`. Plans-style layouts render this slot in the card body beside the title. When no icons are present after AEM hydration, the icons slot is hidden (`display: none`).

Direct children of `merch-card` (outside named slots) are counted by [merch-badge](merch-badge.html) to set `--merch-badge-offset` for badge width on plans cards.

### whats-included rows {#whats-included-rows}

Inside [merch-whats-included](merch-whats-included.html), nest `merch-icon` in `merch-mnemonic-list` with `slot="icon"`. Fries and mini-compare variants typically use `size="s"`.

## Tooltip fallback {#tooltip-fallback}

On connect, `handleTooltips()` runs after a `setTimeout(0)` tick.

**Spectrum detection:** If `sp-tooltip` is registered as a custom element **or** an `sp-theme` element exists on the page, the fallback is skipped and light-DOM tooltip markup is left unchanged.

**Fallback path:** When Spectrum is not detected, the component scans its light DOM for `sp-tooltip` or `overlay-trigger` children:

| Child element | Content source | Placement source |
| --- | --- | --- |
| `sp-tooltip` | `textContent` | `placement` attribute (default `top`) |
| `overlay-trigger` | Nested `sp-tooltip` `textContent` | Nested `sp-tooltip` `placement`, then `overlay-trigger` `placement`, then `top` |

When tooltip content is found, the component:

1. Creates `<mas-mnemonic>` with `content` and `placement` attributes.
2. Moves a light-DOM `<a>` (when it wraps an `<img>`) or a light-DOM `<img>` into the mnemonic.
3. Clears remaining light-DOM children, appends the mnemonic, and dynamically imports `mas-mnemonic.js`.

For new authoring, prefer wrapping `merch-icon` in `mas-mnemonic` directly (see Express variant tests) rather than nesting Spectrum tooltip elements inside `merch-icon`.

```html
<mas-mnemonic content="Including Photoshop, Illustrator, and more" placement="right">
  <merch-icon src="./img/info-icon.svg" size="xs"></merch-icon>
</mas-mnemonic>
```

## AEM hydration {#aem-hydration}

`processMnemonics()` in `hydrate.js` maps fragment fields to slotted icons:

| Fragment field | Attribute on `merch-icon` |
| --- | --- |
| `mnemonicIcon[]` | `src` (empty strings filtered out) |
| `mnemonicAlt[]` | `alt` (parallel index) |
| `mnemonicLink[]` | `href` (parallel index; non-`http(s)` values prefixed with `https://`) |

Each icon is appended with `slot="icons"`, `loading` copied from the parent `merch-card`, and `size` from `mapping.mnemonics.size` (default `l`).

Pre-authored `<merch-icon>` markup inside fragment HTML (for example in `whatsIncluded`) is passed through unchanged.

## CSS custom properties {#css-custom-properties}

| Property | Source | Purpose |
| --- | --- | --- |
| `--img-width` / `--img-height` | `size` attribute selectors | Host and image dimensions |
| `--mod-img-width` / `--mod-img-height` | Author override on `:host` | Overrides preset size |

## Bundle {#bundle}

Import via [mas.js](mas.js.html). `merch-icon` is also registered when [merch-card](merch-card.html) loads (`merch-card.js` imports it). There is no separate bundle entry.
