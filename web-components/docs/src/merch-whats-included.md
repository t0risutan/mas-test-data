<script type="module" src="../dist/mas.js"></script>

# merch-whats-included {#merch-whats-included}

## Introduction {#introduction}

`merch-whats-included` is a compact feature list for plan and product cards. It groups one or more `merch-mnemonic-list` rows under an optional heading. On mobile viewports (max-width 767px), rows in the `content` slot can collapse behind a "+ See more" / "- See less" toggle.

Used inside `merch-card` variants in the `whats-included` slot (`plans`, `plans-v2`, `product`, `fries`, `headless`) or the `footer-rows` slot (`mini-compare-chart`, `mini-compare-chart-mweb`). AEM hydration injects markup from the fragment `whatsIncluded` field via `appendSlot('whatsIncluded', ...)`.

Registered when [mas.js](mas.js.html) or [merch-card](merch-card.html) loads.

See also: [merch-mnemonic-list](merch-mnemonic-list.html), [merch-icon](merch-icon.html), [Plans Gallery](plans.html), [Product Gallery](product.html), [Mini Compare Gallery](minicompare.html), [Plans v2 Gallery](plans-v2.html).

## Example {#example}

Two feature blocks: a heading plus horizontal mnemonic rows. Resize the viewport below 768px to see the mobile see-more control when more than `mobileRows` rows are present (default 5).

```html {.demo .light}
<merch-whats-included>
  <h4 slot="heading">Apps</h4>
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
    <merch-mnemonic-list>
      <merch-icon
        slot="icon"
        size="s"
        src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/premiere.svg"
        alt="Premiere Pro"
      ></merch-icon>
      <p slot="description"><strong>Premiere Pro</strong></p>
    </merch-mnemonic-list>
  </div>
</merch-whats-included>
```

## On merch-card {#on-merch-card}

On a `product` card, place the element in the `whats-included` slot. Each `merch-mnemonic-list` is one feature row (icon + description).

```html {.demo .light}
<merch-card variant="product">
  <h3 slot="title">Photography plan</h3>
  <div slot="body-m">
    <p slot="description">Everything you need for photo editing.</p>
  </div>
  <merch-whats-included slot="whats-included">
    <div slot="heading">What's included:</div>
    <div slot="contentBullets"></div>
    <div slot="content">
      <merch-mnemonic-list>
        <merch-icon
          slot="icon"
          size="s"
          src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/lightroom.svg"
          alt="Lightroom"
        ></merch-icon>
        <p slot="description"><strong>Lightroom</strong></p>
      </merch-mnemonic-list>
      <merch-mnemonic-list>
        <merch-icon
          slot="icon"
          size="s"
          src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
          alt="Photoshop"
        ></merch-icon>
        <p slot="description"><strong>Photoshop</strong></p>
      </merch-mnemonic-list>
    </div>
  </merch-whats-included>
</merch-card>
```

## Slots {#slots}

| Slot | Purpose |
| --- | --- |
| `heading` | Section label (for example "Apps" or "What's included:"). Empty assigned nodes are hidden via `::slotted([slot='heading']:empty) { display: none }`. |
| `content` | Primary row container. Wrap `merch-mnemonic-list` elements in a single assigned element (typically `<div slot="content">`). Slotted content uses `display: contents`, so rows participate in the host flex layout. |
| `contentBullets` | Optional bullet-style rows, also using `merch-mnemonic-list`. Used with the `has-bullets` attribute for mini-compare layouts that split bullet icons from application icons. Slotted wrapper uses a vertical flex column with 10px gap. |

### Row structure {#row-structure}

Each feature is a `merch-mnemonic-list` with:

| Child slot | Purpose |
| --- | --- |
| `icon` | Product icon (`merch-icon`, `img`, or `.sp-icon`). |
| `description` | Feature label copy (typically `<p slot="description">`). |

On `merch-card`, `global.css.js` hides empty `icon` slots when no row in the block uses an icon, and applies extra spacing for `contentBullets` icons.

## has-bullets mode {#has-bullets}

Set the boolean `has-bullets` attribute when bullet rows live in `contentBullets` and application rows live in `content` (common in `mini-compare-chart`).

| Behavior | Without `has-bullets` | With `has-bullets` |
| --- | --- | --- |
| Host layout | Horizontal flex, wrap | Column flex, align start |
| `content` on mobile | Rendered; see-more may appear | Not rendered when `contentBullets` contains a `merch-mnemonic-list` |
| See-more toggle | Available on mobile when `content` row count exceeds `mobileRows` | Disabled (`bulletsAdded` is true) |
| `content` on desktop | Horizontal mnemonic rows | Flex wrap via `merch-card` global styles |

```html {.demo .light}
<merch-whats-included has-bullets>
  <div slot="contentBullets">
    <merch-mnemonic-list>
      <img
        slot="icon"
        src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg"
        alt=""
      />
      <p slot="description">Bullet feature</p>
    </merch-mnemonic-list>
  </div>
  <div slot="content">
    <merch-mnemonic-list>
      <p slot="description">Application row (no icon)</p>
    </merch-mnemonic-list>
  </div>
</merch-whats-included>
```

## Attributes {#attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `mobileRows` | On mobile, show the see-more control when the number of `merch-mnemonic-list` elements in `[slot="content"]` exceeds this value. | `5` | yes |
| `has-bullets` | Enables bullet + application row split layout. Presence-only boolean. | — | — |

`hideSeeMoreEls()` toggles `display` on `content` rows at index `>= 5` (0-based). With the default `mobileRows` of `5`, the first five rows stay visible and the toggle appears when a sixth row exists.

## Events {#events}

| Event | Target | Bubbles | Composed | `detail` | Description |
| --- | --- | --- | --- | --- | --- |
| `hide-see-more-elements` | `merch-whats-included` | yes | yes | — | Fired when the shopper clicks the see-more / see-less control (`toggle()`). No listeners ship in M@S; parent pages or analytics scripts can use it to react to expand/collapse. |

The see-more label reads "+ See more" when collapsed and "- See less" when expanded. Clicking toggles internal `showAll` and re-renders.

## Mobile see-more {#mobile-see-more}

See-more is shown only when all of the following are true:

1. `window.matchMedia('(max-width: 767px)')` matches
2. `[slot="content"] merch-mnemonic-list` count is greater than `mobileRows`
3. `contentBullets` does not contain a `merch-mnemonic-list` (`bulletsAdded` is false)

`updated()` calls `hideSeeMoreEls()` to sync row visibility after each render.

## Variant placement {#variant-placement}

| Card variant | Parent slot | Notes |
| --- | --- | --- |
| `plans`, `plans-education`, `plans-students` | `whats-included` | Education/students omit `whatsIncluded` from AEM mapping |
| `plans-v2` | `whats-included` | Hydrated slot; not placed by `renderLayout()` |
| `product` | `whats-included` | Body area below description |
| `fries` | `whats-included` | Fries-specific typography and spacing |
| `headless` | `whats-included` | Label "What's included" in variant slot map |
| `mini-compare-chart`, `mini-compare-chart-mweb` | `footer-rows` | Compare-column footer rows; variant calls `removeEmptyRows()`, `padFooterRows()`, and `adjustMiniCompareFooterRows()` on `content` mnemonic lists. Divider color is applied to `merch-card` via `whatsIncludedDividerColor` / `whats-included-divider-color` (see [Mini Compare Gallery](minicompare.html)). |

## AEM hydration {#aem-hydration}

The fragment field `whatsIncluded` is appended to the slot named in the variant mapping (`whats-included` or `footer-rows`). Typical authored markup includes all three slots:

```html
<merch-whats-included>
  <div slot="heading">What's included :</div>
  <div slot="contentBullets"></div>
  <div slot="content">
    <merch-mnemonic-list>...</merch-mnemonic-list>
  </div>
</merch-whats-included>
```

An empty `contentBullets` wrapper is common in product fragments so authors can add bullet rows later without restructuring.

For `mini-compare-chart`, optional `whatsIncludedDividerColor` on the fragment (or `whats-included-divider-color` on the element) is read during hydration and copied to the parent `merch-card`.

## Bundle {#bundle}

Import via [mas.js](mas.js.html). `merch-whats-included` is also registered when `merch-card` loads (`merch-card.js` imports it). `merch-mnemonic-list` and `merch-icon` are separate registrations — include them in markup or rely on `mas.js` for the full bundle.
