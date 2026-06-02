# aem-fragment

## What it does

`<aem-fragment>` is a headless custom element that loads a MAS/Odin content fragment by ID over the MAS IO API, caches responses (including referenced fragments), and exposes transformed field data to consumers—typically `<merch-card>` or authoring tools.

It does not render visible UI. Consumers listen for `aem:load` and read the `data` property (or `event.detail`). On fetch failure it may serve stale cached content; if no cache exists it dispatches `aem:error`.

Requires an active `<mas-commerce-service>` (uses `getService()` for settings, logging, and WCS cache prefill).

## Attributes / Props

Observed attributes (`aem-fragment.js`):

| Attribute | Description |
| --------- | ----------- |
| `fragment` | Fragment UUID. **Required** (missing or `#` triggers `aem:error` with "Missing fragment id"). |
| `loading` | `eager` (default) or `cache`. With `cache`, waits up to `timeout` ms for a collection cache entry before fetching. |
| `timeout` | Milliseconds for `loading=cache` wait. Default `5000`. |
| `author` | When `true` or empty string, uses author-mode field transformation (`transformAuthorData`). |
| `preview` | Preview mode; uses dynamically imported `fragment-client.js` and `generatePreview()`. |
| `title` | Informative title only (not used in fetch logic). |

**Properties and methods:**

| Name | Description |
| ---- | ----------- |
| `data` | Transformed fragment object (`fields`, `id`, `tags`, `settings`, `placeholders`, `dictionary`, `priceLiterals`, `variationId`). |
| `rawData` | Untransformed fragment from API/cache. |
| `fetchInfo` | Fetch metadata (URL, status, retries, timing keys prefixed `aem-fragment:`). |
| `updateComplete` | Promise that resolves when load completes or rejects if load never started. |
| `refresh(flushCache = true)` | Reload fragment; `flushCache: false` skips cache removal. |
| `cache` / `AemFragment.cache` | Shared `FragmentCache` instance across elements. |

Static `getFragmentClientUrl()` resolves Studio `fragment-client.js` URL from `maslibs` query param.

## Events

| Event | Description |
| ----- | ----------- |
| `aem:load` | Successful load. `detail` includes transformed data plus `references`, `referencesTree`, `placeholders`, and fetch info. Bubbles and composed. |
| `aem:error` | Load failed. `detail` includes error message and fetch context. Bubbles and composed. |

On success, WCS data from the fragment may prefill the service WCS cache unless URL has `mas.disableWcsCache`.

## Usage example

```html {.demo .light}
<merch-card>
    <aem-fragment
        fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"
        title="Example fragment"
    ></aem-fragment>
</merch-card>
<script type="module">
    document.querySelector('aem-fragment').addEventListener('aem:load', (e) => {
        console.log('Loaded', e.detail);
    });
    document.querySelector('aem-fragment').addEventListener('aem:error', (e) => {
        console.error('Fragment error', e.detail);
    });
</script>
```

Collection cache loading:

```html
<aem-fragment
    fragment="d8008cac-010f-4607-bacc-a7a327da1312"
    loading="cache"
    timeout="5000"
></aem-fragment>
```

## Notes

- Implementation: `web-components/src/aem-fragment.js`.
- Endpoint pattern: `{masIOUrl}/fragment?id={id}&api_key={wcsApiKey}&locale={locale}` plus `country` when needed.
- `AemFragment.cache` on the class is the supported cache API; instance `cache` property is marked for deprecation in source comments.
- `merch-card` listens for `aem:error` and propagates card-level `mas:error` when fragments fail.
