# aem-fragment

## aem-fragment

### What it does

`aem-fragment` is a headless `<aem-fragment>` custom element that fetches a MAS/Odin content fragment by ID, transforms it into a consumable data object, and exposes it through properties and events.

It does not render visible UI. Consumers (typically `merch-card`) listen for `aem:load` and hydrate markup from `element.data`.

Features:

- Shared in-memory cache across instances (`AemFragment.cache`)
- Retry-capable fetch via `masFetch`
- Stale-data fallback when a refresh fails but prior data exists
- `loading="cache"` mode to wait for collection-level cache population
- Author vs publish data transforms
- Preview mode via `fragment-client.js`

Requires `mas-commerce-service` on the page.

### Attributes / Props

| Attribute / property | Description | Default | Required |
| --- | --- | --- | --- |
| `fragment` | Fragment UUID to load. | — | yes |
| `title` | Informative title (not sent to API). | — | no |
| `loading` | `eager` (fetch immediately) or `cache` (wait for cache, then fall back to eager after timeout). | `eager` | no |
| `timeout` | Milliseconds to wait when `loading="cache"`. | `5000` | no |
| `author` | When present/`true`, transforms author JSON shape instead of publish shape. | `false` | no |
| `preview` | Enable preview fetch path. Also inherits from service `preview` setting. | service setting | no |
| `data` (property) | Transformed fragment fields, tags, settings, literals, placeholders. | — | — |
| `rawData` (property) | Untransformed fragment payload from the API. | — | — |
| `fetchInfo` (property) | Fetch metadata prefixed with `aem-fragment:` (url, status, retries, stale, measure, etc.). | — | — |
| `updateComplete` (property) | Promise resolving when load completes; rejects if load never started or failed irrecoverably. | — | — |
| `cache` (static property) | Shared `FragmentCache` instance across all elements. | — | — |

**Methods**

| Method | Description |
| --- | --- |
| `refresh(flushCache = true)` | Reload fragment. When `flushCache` is `true`, removes cached entry first. Returns fetch promise or `false` on failure. |
| `getFragmentClientUrl()` | Resolves preview `fragment-client.js` URL from `maslibs` query param or default MAS studio URL. |
| `generatePreview()` | Dynamically imports fragment client and generates preview payload. |

### Events

| Event | Description |
| --- | --- |
| `aem:load` | Fires on successful load. `detail` includes transformed `data` fields plus `references`, `referencesTree`, `placeholders`, and fetch metadata. Bubbles and is composed. |
| `aem:error` | Fires on failure (missing id, network error, bad response). `detail` includes fetch info and service duration metadata. Bubbles and is composed. |

On error the element adds CSS class `error`.

### Usage example

Listen on a container (recommended — fragments resolve quickly):

```html {.demo .light}
<div id="fragment-container"></div>
<script type="module">
    const target = document.getElementById('log1');
    const container = document.getElementById('fragment-container');

    container.addEventListener('aem:load', (e) => {
        const pre = document.createElement('pre');
        pre.textContent = 'aem:load: ' + JSON.stringify(e.detail, null, 2);
        target.append(pre);
    });

    container.addEventListener('aem:error', (e) => {
        const pre = document.createElement('pre');
        pre.textContent = 'aem:error: ' + JSON.stringify(e.detail, null, 2);
        target.append(pre);
    });

    container.innerHTML = `
        <aem-fragment fragment="d8008cac-010f-4607-bacc-a7a327da1312"></aem-fragment>
        <aem-fragment fragment="wrong-fragment-id"></aem-fragment>
    `;
</script>
```

#### Logs

```html {#log1}

```

Use with `merch-card`:

```html {.demo .light}
<merch-card>
    <aem-fragment
        fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"
        title="Example card fragment"
    ></aem-fragment>
</merch-card>
```

Cache-first loading inside a collection:

```html
<aem-fragment
    fragment="8487f19d-b038-44fa-9db6-0dc55a85b326"
    loading="cache"
    timeout="5000"
></aem-fragment>
```

### Notes

- Missing or `#` fragment id immediately fails with `"Missing fragment id"`.
- Successful responses may include a `wcs` block; unless `mas.disableWcsCache` is set, the service pre-fills WCS cache from fragment payload.
- Referenced nested fragments are added to the shared cache recursively.
- `instance.cache` is deprecated; use `AemFragment.cache` (static).
- Refresh all fragments on a page via `mas-commerce-service.refreshFragments()`.
- Error messages include `"Failed to fetch fragment"`, `"Unexpected fragment response"`, and preview failures from `generatePreview()`.
