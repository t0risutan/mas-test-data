# URL hash deeplink {#deeplink}

## Introduction {#introduction}

Collection filtering, sidenav navigation, and search share a single URL hash contract. User interactions write `key=value` pairs into `window.location.hash`; `merch-card-collection` reads the same keys to filter, sort, and paginate cards.

The contract is implemented in `web-components/src/deeplink.js` and used by:

- [merch-card-collection](merch-card-collection.html) — reads all supported keys
- [merch-sidenav-list](merch-sidenav.html#sidenav-list) — writes `filter` (via `deeplink="filter"`)
- [merch-sidenav-checkbox-group](merch-sidenav.html#checkbox-group) — writes `types` (via `deeplink="types"`)
- [merch-search](merch-sidenav.html#merch-search) — writes `search` (via `deeplink="search"`)

See also: [merch-card-collection filtering](merch-card-collection.html#filtering), [merch-sidenav](merch-sidenav.html), [Catalog Gallery](catalog.html), [Plans Collection Gallery](plans-collection.html).

## Hash format {#format}

Hashes use ampersand-separated `key=value` pairs, similar to a query string:

```
#filter=photo&types=web,desktop&search=acrobat&sort=alphabetical&page=2
```

- Values are URL-encoded. `pushState()` and `parseState()` decode `+` as space and apply `decodeURIComponent`.
- `pushState()` merges partial updates into the existing hash, sorts keys alphabetically, and skips the write when the result is unchanged.
- Empty or falsy values remove a key from the hash.
- Hash updates preserve scroll position (`window.scrollY` is restored after `location.hash` changes).

The `deeplink()` listener ignores hashes that do not contain `=` (plain fragment anchors like `#section` are not treated as collection state).

## Supported hash keys {#hash-keys}

| Hash key | Written by | Read by collection as | Effect |
| --- | --- | --- | --- |
| `filter` | `merch-sidenav-list` (`deeplink="filter"`) | `filter` | Category filter. Cards must define the key on their `filters` object. Changing `filter` resets `page` to `1`. |
| `category` | Legacy / external links | `filter` | Alias for `filter`. The collection resolves `filter = filter \|\| category`. |
| `types` | `merch-sidenav-checkbox-group` (`deeplink="types"`) | `types` | Comma-separated checkbox `name` values. Cards must list matching values in their `types` attribute. |
| `search` | `merch-search` (`deeplink="search"`) or collection header search | `search` | Case-insensitive substring match against each card's `title`. |
| `sort` | Collection header sort menu (`merch-card-collection-header`) | `sort` | `alphabetical` sorts by card title. Any other value (including absent) uses authored order from `card.filters[filter].order`. Selecting authored order removes the `sort` key from the hash. |
| `single_app` | External links, or migrated from query params | `single-app` | When set, the matching card (`card.name === single_app`) is promoted to second position via `card.updateFilters(true)`. |
| `page` | Collection "Show more" (`showMore()`) | `page` | Pagination multiplier: visible cards = first `page × limit` results. Filter changes reset `page` to `1`. |

### Valid `sort` values {#sort-values}

| Hash value | Collection `sort` attribute | Sorter |
| --- | --- | --- |
| *(absent)* or `authored` | `authored` (default) | Authored order from `card.filters[filter].order` |
| `alphabetical` | `alphabetical` | Locale-aware title sort (`en`, `sensitivity: 'base'`) |

## Component `deeplink` attribute {#deeplink-attribute}

Interactive components accept a `deeplink` property that names their hash key. On user interaction they call `pushStateFromComponent(this, value)`, which writes `state[component.deeplink] = value`.

| Component | Typical `deeplink` value | Value written |
| --- | --- | --- |
| `merch-sidenav-list` | `filter` | Selected `sp-sidenav-item` `value` |
| `merch-sidenav-checkbox-group` | `types` | Comma-separated checked checkbox `name` values |
| `merch-search` | `search` | `sp-search` input value |

`merch-search` restores and listens for the `search` hash key specifically in `startDeeplink()` — use `deeplink="search"` so writes and reads stay in sync.

### Example markup {#example-markup}

```html
<merch-sidenav sidenavTitle="REFINE YOUR RESULTS">
  <merch-search deeplink="search">
    <sp-search placeholder="Search all products"></sp-search>
  </merch-search>
  <merch-sidenav-list deeplink="filter" label="category">
    <sp-sidenav variant="multilevel">
      <sp-sidenav-item value="all">All</sp-sidenav-item>
      <sp-sidenav-item value="photo">Photo</sp-sidenav-item>
    </sp-sidenav>
  </merch-sidenav-list>
  <merch-sidenav-checkbox-group deeplink="types" label="types">
    <sp-checkbox name="desktop">Desktop</sp-checkbox>
    <sp-checkbox name="mobile">Mobile</sp-checkbox>
  </merch-sidenav-checkbox-group>
</merch-sidenav>
```

A shareable filtered view might produce:

```
#filter=photo&search=lightroom&types=desktop,mobile&sort=alphabetical&page=1
```

## Query param migration {#query-migration}

On connect, `merch-sidenav-list` calls `paramsToHash(['filter', 'single_app'])` before starting its deeplink listener. Matching query-string values are moved into the hash and removed from `window.location.search`:

```
?filter=photo&single_app=illustrator  →  #filter=photo&single_app=illustrator
```

If a key already exists in the hash, `updateHash()` overwrites it with the query param value.

## Filtered (frozen) collections {#filtered-mode}

When `merch-card-collection` has a `filtered` attribute (set from AEM when the collection has no hierarchy, or authored explicitly), `startDeeplink()` is not called. The collection freezes `filter` to the `filtered` value and ignores hash-driven filter changes. Pagination footer is also hidden.

## Sidenav edge cases {#edge-cases}

**Invalid filter value.** If the hash `filter` (or `category`) does not match any `sp-sidenav-item`, `merch-sidenav-list` selects the first item and rewrites the hash to that item's `value`.

**Legacy `category` hash.** When the hash contains `category=` (without `filter=`), `merch-sidenav-list` applies the selection without rewriting the hash on the initial sync.

## `deeplink.js` API {#api}

| Function | Purpose |
| --- | --- |
| `parseState(hash?)` | Parse a hash string (default: `window.location.hash`) into a plain object of decoded key/value pairs. |
| `pushState(state)` | Merge `state` into the current hash. Truthy values are set; falsy values delete the key. Preserves scroll. |
| `pushStateFromComponent(component, value)` | `pushState({ [component.deeplink]: value })` when `component.deeplink` is set. |
| `deeplink(callback)` | Invoke `callback(state)` immediately and on every `hashchange`. Returns a disposer that removes the listener. |
