# aem-fragment {#aem-fragment}

The `aem-fragment` custom element is used to load a content fragment from MAS/Odin via the [`mas-commerce-service`](mas-commerce-service.html) `mas-io-url` API.
It features a shared in-memory cache (`AemFragment.cache`), supports retries on fetch errors (via `masFetch`), and can serve stale content if a refetch fails while prior data exists.

## Example

The `aem-fragment` element is headless and does not render any content on its own. You should use its events to handle the loaded data.

## Attributes

| Name       | Description                                                                                                                                                   | Default Value | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `fragment` | The ID of the fragment to load.                                                                                                                               |               | `true`   |
| `loading`  | If a fragment is known to be in a collection, set to `cache`, so that it can be initialized from the collection cache, falls back to `eager` after a timeout. | `eager`       | `false`  |
| `timeout`  | The timeout in milliseconds for `loading=cache`.                                                                                                              | `5000`        | `false`  |
| `author`   | Enables author mode, which affects data transformation.                                                                                                       | `false`       | `false`  |
| `preview`  | Enables preview mode, fetching data from the preview service.                                                                                                 | `false`       | `false`  |
| `title`    | An informative title for the fragment.                                                                                                                        |               | `false`  |

## Properties

| Name             | Description                                                                              | Type      |
| ---------------- | ---------------------------------------------------------------------------------------- | --------- |
| `data`           | The transformed fragment data (`fields`, `tags`, `settings`, `placeholders`, etc.). Author mode uses `transformAuthorData`; publish uses `transformPublishData`. | `Object`  |
| `rawData`        | Untransformed fragment JSON from the API (before field normalization).                   | `Object`  |
| `updateComplete` | A promise that resolves when the fragment fetch completes, or rejects with `AEM fragment cannot be loaded` if never started. | `Promise` |
| `fetchInfo`      | Fetch metadata prefixed with `aem-fragment:` keys (`url`, `status`, `retryCount`, `stale`, `measure`, etc.). | `Object`  |

## Methods

| Name                         | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `refresh(flushCache = true)` | Refreshes the fragment content. If `flushCache` is `true`, it will bypass the cache. |

## Events

| Name        | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `aem:load`  | Fires when the fragment is successfully loaded. `detail` includes transformed data plus `references`, `referencesTree`, `placeholders`, and fetch metadata. Bubbles and is composed. |
| `aem:error` | Fires when the fragment fails to load. `detail` includes fetch info and service duration. The element gets class `error`. |

When the fragment response includes a `wcs` payload and `mas.disableWcsCache` is not in the URL, the service prefills the WCS cache (`prefillWcsCache`) before `aem:load` fires.

### Preview mode {#preview-mode}

With `preview` enabled on `mas-commerce-service`, fragments load via dynamically imported `fragment-client.js`. The script URL is resolved from the `maslibs` query parameter (`local`, AEM preview host, or default `https://mas.adobe.com/studio/libs/fragment-client.js`).

## Error Handling {#error-handling}

The `aem-fragment` component can encounter several types of errors during its lifecycle, such as a missing fragment ID, network issues, or server errors. When an error occurs, it dispatches an `aem:error` event. The `detail` property of this event contains information about the error.

You can handle these errors by adding an event listener to the `aem-fragment` element.

<style>
  #log1 {
    max-height: 400px;
  }
</style>

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
