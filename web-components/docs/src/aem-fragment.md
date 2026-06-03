# aem-fragment

## aem-fragment

### What it does

Headless custom element (`<aem-fragment>`) that loads MAS/Odin content fragments over the network, caches them in a module-level `FragmentCache`, and exposes transformed data on the `data` property. It does not render DOM; consumers (typically `merch-card`) listen for `aem:load` and hydrate UI.

Supports eager load, collection cache wait (`loading="cache"`), stale fallback on fetch failure, preview generation, and WCS cache prefill from fragment payload when `wcs` is present.

### Attributes / Props

Observed attributes (`aem-fragment.js`):

| Attribute | Description | Default |
| --- | --- | --- |
| `fragment` | Fragment UUID. Required; missing or `#` triggers `aem:error`. | — |
| `loading` | `eager` or `cache`. `cache` waits up to `timeout` for collection cache before fetching. | `eager` |
| `timeout` | Milliseconds to wait when `loading="cache"`. | `5000` |
| `author` | Author mode (`true` or empty string enables). Affects data transformation. | off |
| `preview` | Preview mode on element; service `preview` setting also applies in `connectedCallback`. | from service |
| `title` | Informative title (optional). | — |

| Property / method | Description |
| --- | --- |
| `data` | Transformed fragment for consumers. |
| `updateComplete` | Alias for internal fetch promise completion. |
| `fetchInfo` | Metrics keys prefixed with `aem-fragment:` (url, status, retryCount, stale, measure). |
| `refresh(flushCache = true)` | Reload fragment; clears cache entry when `flushCache` is true. |
| `AemFragment.cache` | Shared `FragmentCache` instance (also exposed as instance `cache`, deprecated). |

### Events

| Event | When | `detail` |
| --- | --- | --- |
| `aem:load` | Successful load | Fragment data plus `references`, `referencesTree`, `placeholders`, and fetch metadata |
| `aem:error` | Missing id, fetch failure, bad response | `{ message, context }` — element gets class `error` |

### Usage example

```html {.demo .light}
<div id="fragment-container"></div>
<script type="module">
    const container = document.getElementById('fragment-container');
    container.addEventListener('aem:load', (e) => console.log('loaded', e.detail));
    container.addEventListener('aem:error', (e) => console.error(e.detail));
    container.innerHTML = `
        <aem-fragment fragment="d8008cac-010f-4607-bacc-a7a327da1312"></aem-fragment>
        <aem-fragment fragment="wrong-fragment-id"></aem-fragment>
    `;
</script>
```

Inside `merch-card`:

```html {.demo .light}
<merch-card>
    <aem-fragment fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"></aem-fragment>
</merch-card>
```

Refresh all fragments on the page:

```javascript
document.querySelector('mas-commerce-service').refreshFragments();
```

### Notes

- `mas-commerce-service.refreshFragments()` clears `AemFragment.cache` and calls `refresh(false)` on each `aem-fragment`.
- Stale content: if a refetch fails but prior `#rawData` exists, stale data is served and `fetchInfo.stale` is true.
- Query param `mas.disableWcsCache` prevents WCS prefill from fragment response.
- Corp preview behavior depends on service preview settings and `generatePreview()` (implementation in same file).
