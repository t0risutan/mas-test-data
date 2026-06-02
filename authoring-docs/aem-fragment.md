## aem-fragment

### What it does

The `aem-fragment` custom element loads merchandising content from the MAS IO fragment API (`{masIOUrl}/fragment?id=...`). It is **headless**: it does not render visible UI. Consumers (typically `merch-card`) read `data` after load and hydrate slots.

Features implemented in `web-components/src/aem-fragment.js`:

- Shared in-memory cache (`AemFragment.cache`) with reference expansion for nested content fragments.
- `loading="cache"` waits for collection cache population before fetching.
- Stale fallback: if a refresh fails but prior data exists, cached data is served and `fetchInfo.stale` is set.
- Retries via `masFetch()` (network layer).
- On success, prefills WCS cache from embedded `wcs` payload when present.
- Author vs publish data transforms (`author` attribute).

### Attributes / Props

Observed attributes (`AemFragment.observedAttributes`):

| Attribute | Description | Default | Required |
|-----------|-------------|---------|----------|
| `fragment` | Fragment UUID. | (none) | **Yes** |
| `loading` | `eager` or `cache`. `cache` waits for cache entry up to `timeout`, then falls back to fetch. | `eager` | No |
| `timeout` | Milliseconds to wait when `loading="cache"`. | `5000` | No |
| `author` | Author-mode data transform. Enabled when attribute is present and empty or `true`. | `false` | No |
| `preview` | Preview mode attribute (also inherits service preview setting). | from service | No |

Non-observed attribute used in docs/examples:

| Attribute | Description |
|-----------|-------------|
| `title` | Informative title (JSDoc `@attr`; not in `observedAttributes`). |

Properties:

| Property | Description |
|----------|-------------|
| `data` | Transformed fragment fields, tags, settings, dictionary, placeholders, `variationId`. |
| `rawData` | Untransformed API response. |
| `updateComplete` | Promise resolving when fetch completes; rejects if fragment cannot load. |
| `fetchInfo` | Fetch metadata (`url`, `status`, `retryCount`, `stale`, `measure`, etc.) prefixed as `aem-fragment:*` keys. |

Static:

| Member | Description |
|--------|-------------|
| `AemFragment.cache` | Module-level fragment cache (also exposed as instance `.cache`, marked for deprecation). |

Methods:

| Method | Description |
|--------|-------------|
| `refresh(flushCache = true)` | Re-fetch fragment. `flushCache: false` skips cache removal. |
| `getFragmentClientUrl()` | Returns URL for `fragment-client.js` based on `maslibs` query param. |

### Events

| Event | When | Detail |
|-------|------|--------|
| `aem:load` | Fragment fetched and transformed successfully. | Fragment `data`, references, placeholders, and fetch info. |
| `aem:error` | Missing id, network failure, non-OK response, or preview error. | Fetch info object including `message`. |

Error CSS class `error` is added to the element on failure.

Known error messages from source:

- `Missing fragment id` — `fragment` attribute empty or `#`.
- `Unexpected fragment response` — HTTP not OK.
- `Failed to fetch fragment: ...` — network or parse failure without stale cache.
- `Failed to generate preview: ...` — preview generation failed.
- `AEM fragment cannot be loaded` — returned by `updateComplete` when no fetch is in progress.

### Usage example

Inside a merch card:

```html
<mas-commerce-service></mas-commerce-service>

<merch-card>
  <aem-fragment fragment="d8008cac-010f-4607-bacc-a7a327da1312"></aem-fragment>
</merch-card>
```

Listen for load and errors:

```javascript
const fragment = document.querySelector('aem-fragment');

fragment.addEventListener('aem:load', (e) => {
  console.log('Loaded', e.detail);
});

fragment.addEventListener('aem:error', (e) => {
  console.error('Fragment error', e.detail);
});
```

Collection cache loading:

```html
<aem-fragment
  fragment="fragment-uuid"
  loading="cache"
  timeout="5000"
></aem-fragment>
```

Refresh from service:

```javascript
document.querySelector('mas-commerce-service').refreshFragments();
```

### Notes

- Requires `mas-commerce-service`; `getService()` supplies `masIOUrl`, `wcsApiKey`, `locale`, and `country` for the fetch URL.
- Fragment endpoint pattern: `{masIOUrl}/fragment?id={fragment}&api_key={wcsApiKey}&locale={locale}` with optional `&country=` when locale country differs.
- WCS cache prefill is skipped when URL contains `mas.disableWcsCache` parameter.
- The element has **no slots**; it does not project content.
- Source: `web-components/src/aem-fragment.js`, `web-components/src/utils/mas-fetch.js`.
