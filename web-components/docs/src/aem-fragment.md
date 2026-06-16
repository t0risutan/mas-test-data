# aem-fragment {#aem-fragment}

## Introduction {#introduction}

The `aem-fragment` custom element loads a content fragment from MAS/Odin.
It features a caching mechanism, supports retrying on fetch errors, and can serve stale content if fetching new content fails, ensuring robustness.

The element is **headless** and does not render visible content. Listen for `aem:load` / `aem:error` or read the `data` property after `updateComplete`.

Requires an active [mas-commerce-service](mas-commerce-service.html) (provides `mas-io-url`, `wcs-api-key`, and locale settings for the fragment endpoint).

## Example {#example}

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

## Attributes {#attributes}

| Name       | Description                                                                                                                                                   | Default Value | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `fragment` | The ID of the fragment to load.                                                                                                                               |               | `true`   |
| `loading`  | `eager` (default) fetches immediately. `cache` waits up to `timeout` ms for the fragment to appear in the shared cache (e.g. from a collection), then fetches. | `eager`       | `false`  |
| `timeout`  | Milliseconds to wait when `loading=cache`.                                                                                                                    | `5000`        | `false`  |
| `author`   | When present or `true`, transforms raw author JSON (`fields` array). Otherwise publish shape (`fields` object) is used.                                       | `false`       | `false`  |
| `preview`  | When set, uses preview generation instead of the live fragment endpoint (also inherits service `preview` setting on connect).                                 | `false`       | `false`  |
| `title`    | Informative title for logging.                                                                                                                                |               | `false`  |

## Properties {#properties}

| Name             | Description                                                                              | Type      |
| ---------------- | ---------------------------------------------------------------------------------------- | --------- |
| `data`           | Transformed fragment data (`fields`, `tags`, `settings`, `placeholders`, etc.).          | `Object`  |
| `rawData`        | Untransformed fragment payload from the network.                                         | `Object`  |
| `updateComplete` | Promise that resolves when loading finishes, or rejects if the fragment cannot be loaded. | `Promise` |
| `fetchInfo`      | Fetch metadata (URL, status, retries, stale flag, timing) with keys prefixed `aem-fragment:`. | `Object`  |

## Methods {#methods}

| Name                         | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `refresh(flushCache = true)` | Refreshes the fragment. Default clears cache entry first; pass `false` to keep cache (used by `mas-commerce-service.refreshFragments()`). |

`AemFragment.cache` is a module-level cache shared across instances. Successful loads with embedded `wcs` data call `prefillWcsCache` on the commerce service unless the URL contains `mas.disableWcsCache`.

## Events {#events}

| Name        | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `aem:load`  | Fires when the fragment is successfully loaded. `detail` includes transformed `data` fields plus `references`, `referencesTree`, `placeholders`, and fetch metadata. |
| `aem:error` | Fires when the fragment fails to load. `detail` contains `{ message, context }`.                        |

## Error Handling {#error-handling}

The `aem-fragment` component can encounter several types of errors during its lifecycle, such as a missing fragment ID, network issues, or server errors. When an error occurs, it dispatches an `aem:error` event. The `detail` property of this event contains information about the error.

Common failure messages from source:

- `Missing fragment id` — `fragment` attribute missing or `#`
- `Failed to fetch fragment: …` — network or non-OK response (may serve **stale** cached `rawData` on retry failure)
- `Unexpected fragment response` — HTTP response not OK
- `AEM fragment cannot be loaded` — exposed via `updateComplete` rejection when not yet loaded

You can handle these errors by adding an event listener to the `aem-fragment` element or on a parent container (events bubble).
