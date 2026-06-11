<script type="module" src="../dist/mas.js"></script>

# merch-mnemonic-list {#merch-mnemonic-list}

## Introduction {#introduction}

`merch-mnemonic-list` is a single feature row: an icon plus a short description. One or more rows compose the feature list inside [merch-whats-included](merch-whats-included.html).

Primary placements:

1. **`[slot="content"]` on `merch-whats-included`** — horizontal feature rows on plans, product, fries, and headless cards. On mobile, row count drives the see-more toggle in the parent.
2. **`[slot="contentBullets"]` on `merch-whats-included`** — bullet-style rows used with the `has-bullets` attribute in [mini-compare-chart](minicompare.html) layouts.
3. **`footer-rows` on mini-compare cards** — compare-column footer rows; the variant pads empty rows with `data-placeholder` lists and removes rows with no icon and no description text.

Registered when [mas.js](mas.js.html) or [merch-card](merch-card.html) loads (`merch-card.js` imports `merch-mnemonic-list.js`).

See also: [merch-whats-included](merch-whats-included.html), [merch-icon](merch-icon.html), [Plans Gallery](plans.html), [Product Gallery](product.html), [Mini Compare Gallery](minicompare.html), [Fries Gallery](fries.html).

## Example {#example}

Standalone row with a product icon and label.

```html {.demo .light}
<merch-mnemonic-list>
  <merch-icon
    slot="icon"
    size="s"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    alt="Photoshop"
  ></merch-icon>
  <p slot="description"><strong>Photoshop</strong></p>
</merch-mnemonic-list>
```

Row using the `description` attribute instead of a slotted paragraph.

```html {.demo .light}
<merch-mnemonic-list description="100GB cloud storage">
  <merch-icon
    slot="icon"
    size="s"
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg"
    alt="Cloud storage"
  ></merch-icon>
</merch-mnemonic-list>
```

Inside `merch-whats-included` on a product card.

```html {.demo .light}
<merch-card variant="product">
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <div slot="body-xs"><p>Get 20+ apps and services.</p></div>
  <merch-whats-included slot="whats-included">
    <h4 slot="heading">What's included:</h4>
    <div slot="content">
      <merch-mnemonic-list>
        <merch-icon
          slot="icon"
          size="s"
          src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
          alt="Photoshop"
        ></merch-icon>
        <p slot="description"><strong>Photoshop</strong></p>
      </merch-mnemonic-list>
      <merch-mnemonic-list>
        <merch-icon
          slot="icon"
          size="s"
          src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/illustrator.svg"
          alt="Illustrator"
        ></merch-icon>
        <p slot="description"><strong>Illustrator</strong></p>
      </merch-mnemonic-list>
    </div>
  </merch-whats-included>
  <div slot="footer">
    <a href="#" class="con-button blue">Buy now</a>
  </div>
</merch-card>
```

## Slots {#slots}

| Slot | Purpose |
| --- | --- |
| `icon` | Product or feature icon. Typically a `merch-icon`; may also be an `img` or `.sp-icon` element. Centered in a flex container (`height: max-content`). |
| `description` | Feature label copy. Typically a `<p slot="description">` element. Falls back to the `description` attribute when the slot is empty. Styled at 14px / 21px line-height with zero margin. |

## Attributes {#attributes}

| Attribute | Property | Description | Default | Reflects |
| --- | --- | --- | --- | --- |
| `description` | `description` | Plain-text fallback for the `description` slot. Rendered as default slot content when no `description` slot node is assigned. | `''` | yes |

## Layout {#layout}

The host is a horizontal flex row:

| Style | Value |
| --- | --- |
| `display` | `flex` |
| `flex-wrap` | `nowrap` |
| `gap` | `8px` |
| `margin-right` | `16px` |
| `align-items` | `center` |

Inside [merch-whats-included](merch-whats-included.html), the parent `[slot="content"]` wrapper uses `display: contents`, so rows participate directly in the host flex layout. On `merch-card`, `global.css.js` hides empty `icon` slots when no row in the block uses an icon.

## On merch-card {#on-merch-card}

| Card variant | Parent slot | Row context |
| --- | --- | --- |
| `plans`, `plans-v2`, `product`, `fries`, `headless` | `whats-included` | Feature list rows inside `merch-whats-included` `[slot="content"]` or `[slot="contentBullets"]`. |
| `mini-compare-chart`, `mini-compare-chart-mweb` | `footer-rows` | Compare-column footer rows. Variant JS calls `removeEmptyRows()`, `padFooterRows()`, and `adjustMiniCompareFooterRows()` on `content` mnemonic lists. |

### Mini compare placeholders {#mini-compare-placeholders}

On `mini-compare-chart`, shorter cards are padded with empty `merch-mnemonic-list[data-placeholder]` rows so footer rows align across columns. Rows with no icon and no description text are removed at runtime.

### Description-only rows {#description-only-rows}

Plans and plans-v2 CSS hide `merch-mnemonic-list` elements in `merch-whats-included` when the `description` slot contains an empty `<span>` (no text content). This suppresses blank rows after hydration.

## AEM hydration {#aem-hydration}

The fragment `whatsIncluded` field is injected into the card via `appendSlot('whatsIncluded', ...)`. Pre-authored markup typically follows this structure:

```html
<merch-whats-included>
  <div slot="heading">What's included :</div>
  <div slot="content">
    <merch-mnemonic-list>
      <div slot="icon"><merch-icon size="s" src="…" alt="…"></merch-icon></div>
      <p slot="description"><strong>App name</strong></p>
    </merch-mnemonic-list>
  </div>
</merch-whats-included>
```

`hydrate.js` does not rewrite individual `merch-mnemonic-list` elements — the HTML is inserted as authored.

## Bundle {#bundle}

Import via [mas.js](mas.js.html). `merch-mnemonic-list` is also registered when [merch-card](merch-card.html) loads. Built as a standalone Lit bundle entry (`build.mjs` → `dist/merch-mnemonic-list.js`).
