# mas-commerce-service

## mas-commerce-service

### What it does

`mas-commerce-service` is the root `<mas-commerce-service>` custom element that bootstraps M@S commerce on a page. On connect it:

1. Reads configuration from element attributes (and URL parameters where applicable).
2. Initializes settings, price literals, logging (Lana), IMS, WCS, checkout, and price modules.
3. Dispatches `wcms:commerce:ready` with the service instance as `event.detail`.
4. Makes the service discoverable to `inline-price`, `checkout-link`, `checkout-button`, `upt-link`, and `aem-fragment` elements.

Include `mas.js` (which registers this element) before any M@S placeholders on the page.

### Attributes / Props

| Attribute / property | Description | Default | Required |
| --- | --- | --- | --- |
| `env` | Commerce environment: `prod` or `stage`. | `prod` | no |
| `locale` | Price locale (for example `en_US`). Must be a supported locale. | Derived from `country`/`language` or `en_US` | no |
| `country` | Offer country code (for example `US`, `CA`). | `US` | no |
| `language` | Price literal language. | `en` or locale language | no |
| `preview` | Enable preview mode (`true`, `on`). Overridable via `mas.preview` URL param. | off | no |
| `instant` | Passed to fragment preview generation when preview is active. | — | no |
| `wcs-api-key` | API key for WCS and fragment requests. | `wcms-commerce-ims-ro-user-milo` | recommended |
| `checkout-client-id` | Checkout client id. | `adobe_com` | no |
| `checkout-workflow-step` | Default checkout workflow step for CTAs. | `email` | no |
| `force-tax-exclusive` | Force tax-exclusive pricing globally. | `false` | no |
| `allow-override` | Allow `commerce.env` / `commerce.landscape` URL overrides. | `false` | no |
| `lana-tags` | Lana logging tags (for example `ccd`). | — | recommended |
| `lana-sample-rate` | Lana sample rate (integer). | `1` | no |
| `mas-io-url` | Base URL for MAS IO fragment API. | — | no |
| `data-mas-ff-defaults` | Enable locale/segment pricing defaults. Also readable from meta tag or URL param. | off | no |
| `data-mas-ff-annual-price` | Enable annual price display for eligible offers. Also readable from meta tag or URL param. | off | no |
| `featureFlags` (property) | Object with resolved flags: `mas-ff-defaults`, `mas-ff-annual-price`. | — | — |
| `settings` (property) | Resolved commerce settings object. | — | — |
| `defaults` (property) | Frozen defaults from `defaults.js`. | — | — |
| `providers` (property) | Register/unregister checkout and price option providers. | — | — |
| `duration` (property) | Performance timing for service activation. | — | — |

**Methods**

| Method | Description |
| --- | --- |
| `registerCheckoutAction(action)` | Register `(offers, options, imsSignedInPromise, el) => checkoutAction` to override default checkout navigation. |
| `flushWcsCache()` | Clear cached WCS payloads. |
| `refreshOffers()` | Flush WCS cache and force-update all M@S placeholders (`inline-price`, checkout links/buttons, `upt-link`). |
| `refreshFragments()` | Flush WCS cache, clear `aem-fragment` cache, and refresh all fragments. |
| `isPreview()` | Returns `true` when preview mode is active. |
| `logFailedRequests()` | Logs failed fragment/commerce network requests (called automatically ~10s after activation). |
| `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)` | Returns `{ displayTax, forceTaxExclusive }` for a geo/segment pair. |

The activated service also exposes checkout, IMS, WCS, and price APIs merged onto the element (for example `buildCheckoutURL`, `collectPriceOptions`, `createCheckoutLink`).

### Events

| Event | Description |
| --- | --- |
| `wcms:commerce:ready` | Fires once when the service finishes activation. `event.detail` is the service element. Bubbles. |

Child placeholders dispatch their own events (`mas:resolved`, `mas:failed`) independently.

### Usage example

Minimal production setup:

```html
<script src="https://www.adobe.com/libs/deps/custom-elements.js"></script>
<script src="https://www.adobe.com/mas/libs/mas.js" type="module"></script>

<mas-commerce-service
    wcs-api-key="wcms-commerce-ims-ro-user-milo"
    lana-tags="acom"
></mas-commerce-service>

<span is="inline-price" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"></span>
```

Stage environment with locale override:

```html
<mas-commerce-service
    env="stage"
    locale="en_CA"
    wcs-api-key="wcms-commerce-ims-ro-user-milo"
    lana-tags="acom"
></mas-commerce-service>
```

Wait for service readiness:

```html
<script type="module">
    document.addEventListener('wcms:commerce:ready', ({ detail: service }) => {
        console.log('M@S ready', service.settings.locale);
    });
</script>
```

Refresh all offers on the page:

```html {.demo}
<button id="btnRefresh">Refresh offers</button>
<script type="module">
    document.getElementById('btnRefresh').addEventListener('click', () => {
        document.querySelector('mas-commerce-service').refreshOffers();
    });
</script>
```

### Notes

- **Safari** requires the customized built-in elements polyfill before `mas.js`.
- Minimum recommended attributes for production: `wcs-api-key` and `lana-tags`.
- Feature flags on the service element use the `data-` prefix (for example `data-mas-ff-defaults="on"`). See [Feature Flags](feature-flags.html).
- `refreshFragments()` also clears the shared `AemFragment.cache` Map used across all `aem-fragment` instances.
- WCS requests retry up to 3 times with 500ms delay and may serve the last successful payload for the same OSI on failure.
- For the full `mas.js` developer guide including supported locales, see [mas.js](mas.js.html).
