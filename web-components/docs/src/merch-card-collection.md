<script type="module" src="../dist/merch-card-collection.js"></script>

# merch-card-collection {#merch-card-collection}

## Introduction {#introduction}

The `merch-card-collection` custom element loads a collection fragment from MAS/Odin, hydrates child `merch-card` elements, and orchestrates filtering, sorting, search, and pagination across them.

It is typically used with a sibling `merch-sidenav` for category navigation and a `merch-card-collection-header` (created automatically when a sidenav is attached) for search, filter, sort, and result-count UI.

Requires an active [mas-commerce-service](mas-commerce-service.html).

See also: [Plans Collection Gallery](plans-collection.html), [merch-card](merch-card.html).

## Example {#example}

```html {.demo .light}
<div class="collection-container plans">
  <merch-card-collection>
    <aem-fragment fragment="4a466a3c-efa2-4406-ae47-93abd2167e27"></aem-fragment>
  </merch-card-collection>
</div>
```

On `aem:load`, the collection removes the nested `aem-fragment`, creates one `merch-card` per referenced card fragment, and applies grid column classes based on the card variant and count.

## Attributes {#attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `id` | Collection fragment ID. Set from the nested `aem-fragment` during hydration. | — | yes |
| `filter` | Active category filter key. Cards expose matching keys on their `filters` object (populated from the collection hierarchy). | `all` | yes |
| `filtered` | When set, freezes `filter` to this value and disables deeplink-driven filter changes. Also hides the "Show more" footer. | — | yes |
| `types` | Comma-separated type tags. Only cards whose `types` include at least one listed type remain visible. | — | yes |
| `search` | Search term matched against each card's `title` (case-insensitive substring). | — | yes |
| `sort` | Sort order: `authored` (fragment hierarchy order) or `alphabetical` (by card title). | `authored` | yes |
| `page` | Current page number for pagination. Combined with `limit` to determine how many cards are shown. | `1` | yes |
| `limit` | Maximum cards per page. Set to `27` automatically during AEM hydration. | — | no |
| `single-app` | When set, calls `updateFilters()` on each card where `card.name === single-app`. | — | yes |
| `overrides` | Comma-separated `fragmentId:overrideFragmentId` pairs. Replaces card or hierarchy node references at hydration time. | — | no |
| `display-result` | Internal flag set to `true` after hydration completes. | `false` | no |

### Sort order constants {#sort-order}

```javascript
MerchCardCollection.SortOrder.authored      // 'authored'
MerchCardCollection.SortOrder.alphabetical  // 'alphabetical'
```

## AEM hydration {#aem-hydration}

Place a single `aem-fragment` inside the collection. On `aem:load`:

1. Card references are resolved from the fragment's `referencesTree` and `references`.
2. A `merch-card` is created for each card, with `consonant` set and an nested `aem-fragment` for the card content.
3. Each card receives a `filters` map: hierarchy nodes contribute `{ order, size }` keyed by `queryLabel` or lowercased `label`; cards with no hierarchy membership get `{ all: { order, size } }`.
4. Cards tagged with `mas:types/*` receive a `types` attribute (comma-separated suffix values).
5. Variants that support default-child selection (`supportsDefaultChild` in the variant's fragment mapping) may receive `data-default-card="true"`.
6. The collection `variant` and grid classes are derived from the first card's variant and total card count (see [Grid layout](#grid-layout)).
7. Fragment `placeholders` are injected as slotted `<p>` or `<div>` elements inside the collection.
8. `sidenavSettings` are prepared from `checkboxGroups`, or parsed from `tagFilters` + `tagFiltersTitle`.

### Overrides {#overrides}

The `overrides` attribute accepts tokens like `cardId1:replacementId1,cardId2:replacementId2`. During hydration, matching card IDs and hierarchy `defaultchild` references are swapped. Override fragments must already be present in the DOM as `aem-fragment[fragment="…"]` elements with loaded `rawData`.

### Hierarchy and default filter {#hierarchy}

When the collection fragment has no nested `collections` hierarchy, `filtered` is set to `all` automatically, which freezes the filter and hides pagination controls.

## Filtering, sorting, and pagination {#filtering}

On each attribute change, the collection:

1. Filters by `filter` (cards must have the key on their `filters` object).
2. Filters by `types` when set.
3. Filters by `search` against card `title`.
4. Sorts by authored order or alphabetically.
5. Applies pagination: visible cards = first `page × limit` results; sets `hasMore` when additional cards exist.
6. Reorders visible cards in the DOM and sets `display: none` on hidden cards.
7. Applies per-filter `size` from `card.filters[filter].size`.

When `filtered` is set at init (from AEM or markup), `page` resets to `1` and deeplink filter changes are ignored.

## URL hash deeplink {#deeplink}

Unless `filtered` is set, the collection listens to `hashchange` and reads these hash parameters:

| Hash key | Maps to attribute | Notes |
| --- | --- | --- |
| `filter` or `category` | `filter` | Changing filter resets `page` to `1` |
| `types` | `types` | |
| `search` | `search` | Also driven by `merch-search` with `deeplink="search"` |
| `sort` | `sort` | `authored` clears the hash key |
| `single_app` | `single-app` | |
| `page` | `page` | Incremented by "Show more" |

Hash updates preserve scroll position. Sort and pagination changes call `pushState()` from `deeplink.js`.

## Events {#events}

| Event | Bubbles | `detail` | Description |
| --- | --- | --- | --- |
| `merch-card-collection:sort` | yes | `{ value }` | Dispatched when the header sort menu changes. |
| `merch-card-collection:showmore` | yes | — | Dispatched before incrementing `page`. |
| `merch-card-collection:literals-changed` | no | `{ resultCount, searchTerm, filter }` | Dispatched after filter/sort/search updates; `filter` is the sidenav selected text. |
| `merch-card-collection:sidenav-attached` | no | — | Dispatched after `attachSidenav()` completes. |
| `mas:error` | yes | `{ message, … }` | Dispatched when AEM hydration fails. |

Child `merch-card` elements also emit `mas:ready` and `mas:error` per [merch-card](merch-card.html).

## Placeholder slots {#placeholder-slots}

Fragment `placeholders` and header UI text use named slots. Placeholders authored in the collection fragment are auto-created; header-related placeholders can also be provided as child elements with a `placeholder` attribute.

### Collection slots

| Slot | Purpose |
| --- | --- |
| `showMoreText` | Label for the pagination "Show more" button (rendered in the collection footer). |

### Header slots (`merch-card-collection-header`)

Created by `attachSidenav()` or manually. Transferred from collection children when the slot name is in `placeholderKeys`:

| Slot | Purpose |
| --- | --- |
| `searchText` | Search field placeholder |
| `filtersText` | Mobile/tablet filter button label |
| `sortText` | Sort menu prefix label |
| `popularityText` | "Authored" sort option label |
| `alphabeticallyText` | Alphabetical sort option label |
| `noResultText` | Zero results (filter, desktop) |
| `resultText` | Single result (filter, desktop) |
| `resultsText` | Multiple results (filter, desktop) |
| `resultMobileText` | Single result (filter, mobile/tablet) |
| `resultsMobileText` | Multiple results (filter, mobile/tablet) |
| `noSearchResultsText` | Zero search results (desktop) |
| `searchResultText` | Single search result (desktop) |
| `searchResultsText` | Multiple search results (desktop) |
| `noSearchResultsMobileText` | Zero search results (mobile/tablet) |
| `searchResultMobileText` | Single search result (mobile/tablet) |
| `searchResultsMobileText` | Multiple search results (mobile/tablet) |

Result slots support `data-placeholder` attributes (`resultCount`, `searchTerm`, `filter`) that the header updates from `merch-card-collection:literals-changed`.

## Sidenav integration {#sidenav}

On `connectedCallback`, the collection looks for a sibling `merch-sidenav` on its parent element. Call `attachSidenav(sidenav, append)` to:

1. Optionally prepend the sidenav to the parent.
2. Set `sidenav.variant` and apply the variant CSS class.
3. Set `autoclose` on the sidenav for the `plans` variant.
4. Create and insert a `merch-card-collection-header` before the collection.
5. Run the variant's `onSidenavAttached` hook (if defined in `collectionOptions`).

The `plans` and `plans-v2` variants define custom `headerVisibility` and `customHeaderArea` in their `collectionOptions` — for example, plans hides search/sort on desktop and shows a custom results area.

## Grid layout {#grid-layout}

After hydration, CSS grid classes are applied based on variant and card count:

| Variant | Condition | Class |
| --- | --- | --- |
| `catalog`, `plans`, `product`, `segment` | default | `four-merch-cards` |
| `plans` | 3 cards, none wide | `three-merch-cards` |
| `product`, `segment` | 2 or 3 cards | `two-merch-cards` or `three-merch-cards` |
| `special-offers`, `image`, `mini-compare-chart`, `mini-compare-chart-mweb` | default | `three-merch-cards` |
| `mini-compare-chart`, `mini-compare-chart-mweb` | ≤2 cards | `two-merch-cards` |

Wrap the collection in a `.collection-container` element for correct grid and header spacing.

## Methods {#methods}

| Method | Description |
| --- | --- |
| `attachSidenav(sidenav, append?)` | Wire sidenav, create header, dispatch `merch-card-collection:sidenav-attached`. `append` defaults to `true`. |
| `checkReady()` | Returns a promise resolving `true` when hydration completes, or `false` after a 30s timeout. |
| `showMore()` | Increments `page`, updates the URL hash, and dispatches `merch-card-collection:showmore`. |
| `sortChanged(event)` | Called by the header sort menu; updates hash and dispatches `merch-card-collection:sort`. |
| `openFilters(event)` | Opens the sidenav modal (mobile/tablet filter button). |

## Error handling {#error-handling}

If the nested `aem-fragment` dispatches `aem:error`, the collection logs the error, sets `failed = true`, removes the fragment, and dispatches `mas:error` with the error detail.
