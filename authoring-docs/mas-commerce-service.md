## mas-commerce-service

### What it does

The root commerce service custom element (`<mas-commerce-service>`) initializes M@S on a page. On `connectedCallback`, it calls `activate()`, which:

1. Builds commerce settings from element attributes and URL parameters (`getSettings()` in `settings.js`).
2. Initializes logging (Lana), price literals, and WCS/IMS/Checkout modules.
3. Exposes a flat API on the element (checkout URL building, offer resolution, cache control, etc.).
4. Dispatches `wcms:commerce:ready` when activation completes.

All `inline-price`, `checkout-link`, and `checkout-button` elements depend on this service being present in the DOM.

### Attributes / Props

Root-level attributes read in `#config` (`mas-commerce-service.js`):

| Attribute | Config key | Description | Default |
|-----------|------------|-------------|---------|
| `env` | `commerce.env`, `hostEnv.name` | Commerce environment: `prod` or `stage`. | `prod` |
| `locale` | `locale` | Locale string (e.g. `en_US`). | Derived in settings |
| `country` | `country` | Country code for WCS pricing. | `US` |
| `language` | `language` | Language for price literals. | `en` |
| `preview` | `preview` | Enable preview mode. | off |
| `instant` | `instant` | Instant preview flag. | (none) |
| `mas-io-url` | `masIOUrl` | Base URL for MAS IO fragment API. | `https://www.adobe.com/mas/io` (stage variant when `env=stage`) |
| `lana-tags` | `lana.tags` | Lana logging tags. | (none) |
| `lana-sample-rate` | `lana.sampleRate` | Lana sample rate. | `1` |

Commerce sub-attributes (mapped to camelCase under `config.commerce`):

| Attribute | Description | Default |
|-----------|-------------|---------|
| `checkout-workflow-step` | Default UCv3 workflow step. | `email` |
| `force-tax-exclusive` | Force tax-exclusive prices globally. | `false` |
| `checkout-client-id` | Checkout client id. | `adobe_com` |
| `allow-override` | Allow `commerce.env` / `commerce.landscape` URL overrides. | (unset / false) |
| `wcs-api-key` | WCS API key. | `wcms-commerce-ims-ro-user-milo` |

Feature flag attributes (read once into `featureFlags` getter):

| Attribute | Flag constant | Enabled when |
|-----------|---------------|--------------|
| `data-mas-ff-defaults` | `mas-ff-defaults` | Value or URL param is `on` or `true` |
| `data-mas-ff-annual-price` | `mas-ff-annual-price` | Value or URL param is `on` or `true` |

Feature flags can also be set via URL query parameters with the same names (`getParameter()` from tacocat-core).

Exposed API (partial list from `activate()`):

| Member | Description |
|--------|-------------|
| `settings` | Resolved locale, WCS URL, display defaults, etc. |
| `featureFlags` | `{ 'mas-ff-defaults', 'mas-ff-annual-price' }` booleans. |
| `defaults` | Frozen default constants object. |
| `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)` | Async tax display defaults. |
| `providers.checkout(fn)` / `providers.price(fn)` | Register option providers; returns unsubscribe function. |
| `buildCheckoutURL(offers, options)` | Build UCv3 checkout URL. |
| `resolveOfferSelectors(options)` | Fetch offers from WCS. |
| `collectCheckoutOptions()` / `collectPriceOptions()` | Merge settings, dataset, and provider overrides. |
| `registerCheckoutAction(action)` | Override checkout click behavior globally. |
| `flushWcsCache()` | Clear WCS response cache. |
| `refreshOffers()` | Flush cache and `requestUpdate(true)` on all MAS commerce elements. |
| `refreshFragments()` | Flush cache, clear AEM fragment cache, refresh all `aem-fragment` elements. |
| `isPreview()` | Whether preview attribute is active. |
| `duration` | Performance measure for service activation. |
| `log` / `Log` | Logging utilities. |

### Events

| Event | When | Detail |
|-------|------|--------|
| `wcms:commerce:ready` | Service activation complete (`EVENT_TYPE_READY` in `constants.js`). | The service element (`detail: this`). |

### Usage example

Production (minimal):

```html
<mas-commerce-service
  wcs-api-key="wcms-commerce-ims-ro-user-milo"
  lana-tags="acom"
></mas-commerce-service>
<script type="module" src="https://www.adobe.com/mas/libs/mas.js"></script>
```

Stage with locale override:

```html
<mas-commerce-service
  env="stage"
  locale="fr_FR"
  data-mas-ff-defaults="on"
></mas-commerce-service>
```

Wait for readiness:

```javascript
document.addEventListener('wcms:commerce:ready', (e) => {
  console.log('MAS ready', e.detail.settings);
});
```

Custom checkout action:

```javascript
const service = document.querySelector('mas-commerce-service');
service.registerCheckoutAction(async (offers, options, imsPromise, el) => {
  return { url: 'https://example.com/checkout', text: 'Custom CTA' };
});
```

### Notes

- Safari requires a customized built-in elements polyfill before `mas.js` when using `is="inline-price"` / `is="checkout-link"` / `is="checkout-button"`.
- `logFailedRequests()` runs 10 seconds after activation and logs failed fragment or WCS network requests.
- Settings defaults come from `web-components/src/defaults.js` and can be overridden per-element on child commerce placeholders via `data-*` attributes.
- Only `mas-ff-defaults` and `mas-ff-annual-price` are exposed through `service.featureFlags`. Other flags such as `mas-ff-3in1` are read directly from `<meta>` tags in checkout code (see [feature-flags](feature-flags.md)).
- Source: `web-components/src/mas-commerce-service.js`, `web-components/src/settings.js`, `web-components/src/checkout.js`, `web-components/src/price.js`, `web-components/src/wcs.js`, `web-components/src/ims.js`.
