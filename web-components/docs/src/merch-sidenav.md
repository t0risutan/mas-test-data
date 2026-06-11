<script type="module" src="../dist/merch-sidenav.js"></script>

# merch-sidenav {#merch-sidenav}

## Introduction {#introduction}

`merch-sidenav` is the filter sidebar for [merch-card-collection](merch-card-collection.html). It wraps Spectrum navigation (`sp-sidenav`), optional search (`merch-search`), and optional type tag checkboxes (`merch-sidenav-checkbox-group`). Selections update the URL hash; the collection reads the same hash keys to filter cards.

On desktop, the sidenav renders as a static aside. On tablet and mobile (`TABLET_DOWN` media query), it switches to a modal dialog opened from the collection header filter button.

See also: [merch-card-collection](merch-card-collection.html), [Catalog Gallery](catalog.html), [Plans Collection Gallery](plans-collection.html).

## Example {#example}

Catalog-style sidenav with category list, type checkboxes, and in-sidenav search (desktop only — search is hidden inside the modal and rendered in the collection header instead).

```html {.demo .light}
<div class="collection-container catalog" style="display:flex;gap:30px;">
  <merch-sidenav sidenavTitle="REFINE YOUR RESULTS">
    <merch-search deeplink="search">
      <sp-search placeholder="Search all products"></sp-search>
    </merch-search>
    <merch-sidenav-list deeplink="filter" label="category">
      <sp-sidenav variant="multilevel" manageTabIndex="true">
        <sp-sidenav-item value="all" label="All" selected></sp-sidenav-item>
        <sp-sidenav-item label="Photo" value="photo"></sp-sidenav-item>
        <sp-sidenav-item label="Video" value="video"></sp-sidenav-item>
      </sp-sidenav>
    </merch-sidenav-list>
    <merch-sidenav-checkbox-group
      sidenavCheckboxTitle="Types"
      label="types"
      deeplink="types"
    >
      <sp-checkbox emphasized name="desktop">Desktop</sp-checkbox>
      <sp-checkbox emphasized name="mobile">Mobile</sp-checkbox>
      <sp-checkbox emphasized name="web">Web</sp-checkbox>
    </merch-sidenav-checkbox-group>
  </merch-sidenav>
</div>
```

## merch-sidenav attributes {#sidenav-attributes}

| Attribute / property | Description | Default | Reflects |
| --- | --- | --- | --- |
| `sidenavTitle` | Heading shown above slotted content (desktop aside and modal). | — | no |
| `close-text` | Label for the modal close link. Only shown when `autoclose` is not set. | `Close` | no |
| `modal` | Set automatically on tablet/mobile. When true, renders as `sp-overlay` dialog instead of aside; slotted `merch-search` is hidden. | `false` | yes |
| `open` | Whether the modal is visible. Set by `showModal()` / `closeModal()`. | `false` | yes |
| `autoclose` | When set, the modal closes automatically after a sidenav selection (`merch-sidenav:select`). No close link is shown. Set automatically for the `plans` variant by `attachSidenav()`. | `false` | yes |

### Methods {#sidenav-methods}

| Method | Description |
| --- | --- |
| `showModal()` | Opens the modal, sets `open`, adds `merch-modal` class to `<body>`. |
| `closeModal()` | Closes the modal, removes `open`, removes `merch-modal` from `<body>`. |

### Variant styling {#variant-styling}

When wired through `merch-card-collection.attachSidenav()`, the collection sets `sidenav.variant` and adds a CSS class matching the collection variant (e.g. `catalog`, `plans`). Variant-specific tokens live in `variants/catalog.css.js` and `variants/plans.css.js`. The `catalog` variant enlarges search (`size="l"`) and checkboxes (`size="xl"`) in `firstUpdated()`.

## merch-sidenav-list {#sidenav-list}

Wraps an `sp-sidenav` tree. Handles item selection, multilevel expand/collapse, icon swapping, and hash sync.

### Attributes {#list-attributes}

| Attribute / property | Description | Default | Reflects |
| --- | --- | --- | --- |
| `deeplink` | Hash key written on selection (typically `filter`). Required for hash sync. | — | no |
| `sidenavListTitle` | Optional uppercase section heading above the list. | — | no |
| `label` | `aria-label` for the list container. | — | no |
| `selected-text` | Display text for the current selection. Populated from the selected item's `.selection` element `data-selected-text` or the item `label`. | — | yes |
| `selected-value` | `value` of the currently selected `sp-sidenav-item`. | — | yes |
| `toggle-icon-color` | When set, swaps the item icon `src` between `data-light` and `data-dark` on the nested `.selection` element when selected. | `false` | no |

### Selection markup {#selection-markup}

For custom selected text and icon toggling, nest a `<var class="selection">` inside `sp-sidenav-item`:

```html
<sp-sidenav-item label="Creativity And Design" value="creativitydesign">
  <var
    class="selection"
    data-selected-text="CREATE!"
    data-light="https://example.com/icon-light.svg"
    data-dark="https://example.com/icon-dark.svg"
  ></var>
  <img src="https://example.com/icon-dark.svg" slot="icon" />
</sp-sidenav-item>
```

On connect, if `deeplink` is set, the list calls `paramsToHash(['filter', 'single_app'])` to migrate matching query params into the hash, then starts listening for hash changes. Invalid hash values fall back to the first item and rewrite the hash.

## merch-sidenav-checkbox-group {#checkbox-group}

Multi-select checkbox filter. Checked values are stored as a comma-separated list in the URL hash.

### Attributes {#checkbox-attributes}

| Attribute / property | Description | Default | Reflects |
| --- | --- | --- | --- |
| `deeplink` | Hash key written on change. Must be `types` — the deeplink listener reads the `types` hash param. | — | no |
| `sidenavCheckboxTitle` | Group heading injected as an `<h3>` on connect. | — | no |
| `label` | `aria-label` for the group container. | — | no |
| `selectedValues` | Array of checked checkbox `name` values. Synced from hash on load. | `[]` | yes |

Each `sp-checkbox` must have a `name` attribute matching a card `types` value (see [merch-card-collection filtering](merch-card-collection.html#filtering)).

## merch-search {#merch-search}

Light-DOM wrapper around `sp-search` that syncs input to the URL hash and notifies the collection.

### Attributes {#search-attributes}

| Attribute | Description | Default | Reflects |
| --- | --- | --- | --- |
| `deeplink` | Hash key for the search term. Use `search` to drive `merch-card-collection` filtering. | — | no |

### Events {#search-events}

| Event | Bubbles | `detail` | Description |
| --- | --- | --- | --- |
| `merch-search:change` | yes | `{ type: 'search', value }` | Dispatched on debounced input when the search value is non-empty. |

On connect, restores the input from the hash (`deeplink` key) and listens for subsequent hash changes. Form submit is prevented.

Search can appear in two places:

- **Inside `merch-sidenav`** — visible on desktop; hidden when the sidenav is in modal mode.
- **Inside `merch-card-collection-header`** — rendered by the collection header on mobile/tablet when the variant's `headerVisibility.search` allows it. Uses the same `deeplink="search"` contract.

## Collection integration {#collection-integration}

`merch-card-collection` discovers a sibling `merch-sidenav` on its parent during `init()`. Call `attachSidenav(sidenav, append?)` to:

1. Optionally prepend the sidenav to the parent container.
2. Set `sidenav.variant` and apply the variant CSS class.
3. Set `autoclose` for the `plans` variant (`SIDENAV_AUTOCLOSE`).
4. Create and insert a `merch-card-collection-header`.
5. Run the variant's `onSidenavAttached` hook from `collectionOptions`.

The header filter button calls `collection.openFilters()` → `sidenav.showModal()`.

After filtering, the collection listens for `merch-sidenav:select` on the sidenav to refresh result-count placeholders via `merch-card-collection:literals-changed`. The `filter` detail value comes from `sidenav.filters.selectedText` (the first `merch-sidenav-list`).

## URL hash deeplink {#deeplink}

Sidenav children and the collection share the same hash contract. Components call `pushStateFromComponent()` (from `deeplink.js`) on interaction; the collection's `startDeeplink()` reads the hash and updates its attributes.

| Hash key | Set by | Maps to collection attribute | Notes |
| --- | --- | --- | --- |
| `filter` | `merch-sidenav-list` (`deeplink="filter"`) | `filter` | Also accepts legacy `category` key |
| `types` | `merch-sidenav-checkbox-group` (`deeplink="types"`) | `types` | Comma-separated checkbox `name` values |
| `search` | `merch-search` (`deeplink="search"`) | `search` | Also used by collection header search |
| `sort` | Collection header sort menu | `sort` | — |
| `single_app` | External / query-param migration | `single-app` | Migrated from query string by sidenav list on connect |
| `page` | Collection "Show more" | `page` | Filter changes reset `page` to `1` |

Hash updates preserve scroll position. Empty values remove the key from the hash.

## Events {#events}

| Event | Bubbles | `detail` | Description |
| --- | --- | --- | --- |
| `merch-sidenav:select` | yes | `{ type: 'sidenav', value, elt }` | Dispatched by `merch-sidenav-list` when an item is selected. Closes the modal when `autoclose` is set. |

## AEM fragment fields {#aem-fields}

During collection hydration, `prepareSideNavSettings()` parses sidenav-related AEM fields into `collection.data.sidenavSettings`:

| AEM field | Purpose |
| --- | --- |
| `searchText` | Search placeholder. Applied to the `searchText` collection placeholder when not authored separately. |
| `tagFilters` + `tagFiltersTitle` | Parsed into a checkbox group descriptor (see below). |
| `checkboxGroups` | Used directly as checkbox group descriptors when present (takes precedence over `tagFilters`). |
| `linksTitle`, `link`, `linkText`, `linkIcon` | Stored in `sidenavSettings` for resource-link sidenav sections. |

The sidenav DOM is not auto-generated by `merch-card-collection`. Author or block-code must build `merch-sidenav` markup (typically from the collection hierarchy and `sidenavSettings`) and call `attachSidenav()`.

### tagFilters → checkbox group {#tag-filters}

When `checkboxGroups` is absent and `tagFilters` is present, hydration builds one checkbox group:

```javascript
{
  title: fragment.fields.tagFiltersTitle,
  label: 'types',
  deeplink: 'types',
  checkboxes: fragment.fields.tagFilters.map((tag) => {
    const parsedTag = tag.split('/').pop();           // "mas:types/desktop" → "desktop"
    let tagLabel = fragment.settings?.tagLabels?.[parsedTag] || parsedTag;
    if (tagLabel.startsWith('coll-tag-filter')) {
      tagLabel = parsedTag.charAt(0).toUpperCase() + parsedTag.slice(1);
    }
    return { name: parsedTag, label: tagLabel };
  }),
}
```

Card `types` attributes are populated from `mas:types/*` tags on each card fragment during hydration. Checkbox `name` values must match those suffixes for type filtering to work.

### checkboxGroups format {#checkbox-groups}

When `checkboxGroups` is authored on the collection fragment, it is passed through unchanged as `sidenavSettings.tagFilters`. Each group object supports:

| Property | Description |
| --- | --- |
| `title` | Checkbox group heading (`sidenavCheckboxTitle`). |
| `label` | `aria-label` for the group. |
| `deeplink` | Hash key (use `types`). |
| `checkboxes` | Array of `{ name, label }` objects mapping to `sp-checkbox` elements. |
