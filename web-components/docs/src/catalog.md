<script type="module" src="../dist/merch-card-collection.js"></script>

## Overview {#overview}

Catalog cards use `variant="catalog"` (explicit in this gallery or inferred from the fragment `variant` field). Mapping: `CATALOG_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/catalog.js`.

Catalog uses attribute-based badges (`badge: true` without a slot config) rather than the slotted `merch-badge` pattern used on plans cards.

Production catalog pages (for example [adobe.com/products/catalog.html](https://www.adobe.com/products/catalog.html)) render cards inside `<merch-card-collection>` with a sibling `<merch-sidenav>` for category navigation, search, and type-tag filtering.

See [merch-card-collection](merch-card-collection.html) for collection API details, [merch-sidenav](merch-sidenav.html) for filter sidebar wiring, and [URL hash deeplink](deeplink.html) for hash-driven filter state.

## Collection setup {#collection-setup}

Wrap the collection and sidenav in a `.collection-container.catalog` element. Hydrate from a single collection `aem-fragment`; `merch-card-collection` creates one `merch-card` per referenced card fragment on `aem:load`.

| Concern | Catalog behavior |
| --- | --- |
| Grid class | `four-merch-cards catalog` (from `VARIANT_CLASSES` in `merch-card-collection.js`) |
| Card width | `var(--consonant-merch-card-catalog-width)` — 302px by default, 300px at desktop (`catalog.css.js`) |
| Card min-height | 330px inside `.collection-container.catalog` |
| Wide cards | `size="wide"` and `size="super-wide"` cards use `width: auto` in collections |
| `collectionOptions` | Not registered for the catalog variant (unlike `plans` and `plans-v2`) |
| Sidenav `autoclose` | Not set for catalog (`SIDENAV_AUTOCLOSE` only includes `plans`) |
| Search size | `l` on `sp-search` inside `merch-sidenav` and the collection header |
| Type checkboxes | `xl` on `sp-checkbox` elements in `merch-sidenav-checkbox-group` |
| Type filtering | Card `types` attributes are populated from `mas:types/*` tags on each card fragment; checkbox `name` values must match those suffixes |
| Pagination | `limit` is set to `27` during hydration; footer "Show more" increments `page` |
| Hash deeplink | Enabled when the collection has a hierarchy and `filtered` is not set |

```html {.demo .light}
<div class="collection-container catalog">
  <merch-sidenav sidenavTitle="REFINE YOUR RESULTS">
    <!-- Category tree, search, and type checkboxes — see merch-sidenav -->
  </merch-sidenav>
  <merch-card-collection>
    <aem-fragment fragment="1f0d1698-bfe6-4806-9fae-91e193950bc6"></aem-fragment>
  </merch-card-collection>
</div>
```

The sidenav DOM is not auto-generated. Author `merch-sidenav` markup from the collection hierarchy and `sidenavSettings`, then call `attachSidenav()` (or rely on a sibling sidenav discovered during `init()`). See [merch-sidenav collection integration](merch-sidenav.html#collection-integration).

## Collection AEM fragment fields {#collection-fields}

During collection hydration (`merch-card-collection.js` → `normalizePayload()`), hierarchy nodes and sidenav settings are parsed from the collection fragment:

| AEM field | Purpose |
| --- | --- |
| `label` | Display name for a hierarchy node |
| `queryLabel` | Filter key written to card `filters` objects (falls back to lowercased `label`) |
| `cards` | Card fragment IDs referenced at this hierarchy level |
| `collections` | Nested hierarchy nodes for category navigation |
| `defaultchild` | Default card fragment ID at the root when no nested hierarchy exists |
| `searchText` | Search field placeholder; also applied to the `searchText` collection placeholder when not authored separately |
| `tagFilters` + `tagFiltersTitle` | Parsed into a type checkbox group (`label: 'types'`, `deeplink: 'types'`) when `checkboxGroups` is absent |
| `checkboxGroups` | Used directly as checkbox group descriptors (takes precedence over `tagFilters`) |
| `linksTitle`, `link`, `linkText`, `linkIcon` | Resource link section in the sidenav (`sidenavSettings`) |

Fragment `placeholders` (for example `searchText`, `filtersText`, `sortText`, `catalogSidenavTitle`) are injected as slotted elements on the collection and header. See [merch-card-collection placeholder slots](merch-card-collection.html#placeholder-slots).

## Card AEM fragment fields {#aem-fields}

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Must be `catalog`. |
| `cardName` | `name` attribute | — | |
| `cardTitle` | `heading-xs` | `h3` | Title; shares slot with prices. |
| `prices` | `heading-xs` | `h3` | Price HTML with `inline-price` elements. |
| `description` | `body-xs` | `div` | |
| `shortDescription` | `action-menu-content` | `div` | When present, sets `action-menu="true"` and default `action-menu-label="More options"`. |
| `actionMenuLabel` | `action-menu-label` attribute | — | Overrides default action-menu label. |
| `badge` | Badge attributes | — | Sets `badge-text`, `badge-color`, and `badge-background-color` (not a slotted badge). |
| `borderColor` | Card border styling | — | Via `processBorderColor` when authored. |
| `size` | `size` attribute | — | `wide` or `super-wide`. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Icon size `l`. |
| `ctas` | `footer` | `div` | Footer CTA links. |

## Slots {#slots}

Layout from `Catalog.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Body top | Mnemonics beside badge. |
| `action-menu-content` | Body | Expandable menu content; toggled by the action-menu control. |
| `heading-xs` | Body | Title and/or prices. |
| `heading-m`, `body-xxs` | Body | Optional authored slots (not in AEM mapping). |
| `promo-text`, `callout-content` | Body | Order depends on `promo-bottom` class on the card. |
| `body-xs` | Body | Description. |
| `footer` | Footer | CTAs. |

<div class="catalog-gallery-content">
  <h1 id="catalog-gallery">Catalog Gallery</h1>

  <h2 id="catalog-individual-cards">Individual Catalog Cards <a class="header-anchor" href="#catalog-individual-cards" title="Permalink to this heading">#</a></h2>
  <div class="three-merch-cards catalog">
    <merch-card variant="catalog"><aem-fragment fragment="60d6f47c-8fd7-485d-a4ac-2b7baa492ab1"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="c44bcc8c-4cfc-4514-96eb-2ccfaf15ebe8"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="7286e63a-253e-42e3-86a8-a29f9bc72fb9"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="d8f4315b-ecf5-47c9-a416-adf3390a4ec6"></aem-fragment></merch-card>
    <merch-card variant="catalog"><aem-fragment fragment="9a1fd4db-54c2-47d0-9ddc-06cc6725b7bf"></aem-fragment></merch-card>
  </div>

  <h2 id="catalog-collection">Catalog Collection <a class="header-anchor" href="#catalog-collection" title="Permalink to this heading">#</a></h2>
  <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=acom&query=1f0d1698-bfe6-4806-9fae-91e193950bc6"> Open in Studio</a>
  <a class="plans-link" target="_blank" href="https://www.adobe.com/products/catalog.html"> Live catalog page ↗</a>
  <div class="collection-container catalog">
    <merch-card-collection><aem-fragment fragment="1f0d1698-bfe6-4806-9fae-91e193950bc6"></aem-fragment></merch-card-collection>
  </div>
</div>
