# mas-commerce-service {#mas-commerce-service}

## Introduction {#introduction}

The `mas-commerce-service` custom element bootstraps Merch at Scale on a page. When it connects to the DOM it activates WCS, checkout URL building, price rendering, IMS helpers, and logging, then exposes that API on the element itself.

Place it in the document **before** `aem-fragment` or other M@S elements are created so dependents can resolve offers as soon as they connect. See [Step By Step](step-by-step.html) and [mas.js](mas.js.html) for enablement.

```html {.demo}
<mas-commerce-service id="svc"></mas-commerce-service>
<script type="module">
    document.getElementById('svc').addEventListener('wcms:commerce:ready', (e) => {
        document.getElementById('svcLog').textContent =
            'ready: ' + (e.detail?.settings?.locale ?? 'unknown locale');
    });
</script>
```

#### Log

```html {#svcLog}

```

## Attributes {#attributes}

| Attribute | Description | Default | Required |
| --- | --- | --- | --- |
| `env` | Commerce environment: `stage` or `prod` | `prod` | `false` |
| `locale` | Locale for WCS and price formatting (e.g. `en_US`) | Derived from `country` / `language` | `false` |
| `country` | ISO country for offers and checkout | `US` or locale country | `false` |
| `language` | Language for price literals | `en` or locale language | `false` |
| `preview` | Preview mode (`true`, `on`, or `false` / `off`) | off | `false` |
| `instant` | Passed through service config when set | — | `false` |
| `wcs-api-key` | API key for WCS artifact requests | `wcms-commerce-ims-ro-user-milo` | recommended |
| `checkout-client-id` | Checkout client id | `adobe_com` | `false` |
| `checkout-workflow-step` | Default checkout workflow step for CTAs | `email` | `false` |
| `force-tax-exclusive` | Force tax-exclusive price display globally | `false` | `false` |
| `allow-override` | Allow `commerce.env` / `commerce.landscape` URL overrides | `false` | `false` |
| `lana-tags` | LANA logging tags | — | recommended |
| `lana-sample-rate` | LANA sample rate (integer) | `1` | `false` |
| `mas-io-url` | Base URL for AEM fragment IO (used by `aem-fragment`) | Set at activation from config | `false` |
| `data-mas-ff-defaults` | Enable [mas-ff-defaults](feature-flags.html#mas-ff-defaults) on the service | off | `false` |
| `data-mas-ff-annual-price` | Enable [mas-ff-annual-price](feature-flags.html#mas-ff-annual-price) on the service | off | `false` |

Feature flag attributes accept `on` or `true` to enable. URL query parameters with the same names can also enable flags (see `#getFeatureFlag` in source).

## Events {#events}

| Event | Description |
| --- | --- |
| `wcms:commerce:ready` | Fires after activation. `event.detail` is the service element with WCS, checkout, price, and IMS APIs attached. |

## Methods {#methods}

| Method | Description |
| --- | --- |
| `registerCheckoutAction(action)` | Registers a custom checkout handler. `action` signature: `(offers, options, imsSignedInPromise, element) => checkoutAction \| null`. When a handler returns `{ url, text, className, handler }`, checkout elements use that result. |
| `flushWcsCache()` | Clears the WCS response cache. |
| `refreshOffers()` | Flushes WCS cache and calls `requestUpdate(true)` on all `inline-price`, `checkout-link`, `checkout-button`, and `upt-link` elements in the document. |
| `refreshFragments()` | Flushes WCS cache, clears the global `aem-fragment` cache, and calls `refresh(false)` on every `aem-fragment`. |
| `isPreview()` | Returns whether the `preview` attribute is enabled. |

## Properties and APIs {#properties}

After `wcms:commerce:ready`, the element exposes (among others):

| Name | Description |
| --- | --- |
| `settings` | Resolved locale, country, language, WCS URL, checkout defaults, and display defaults. |
| `featureFlags` | Object with `mas-ff-defaults` and `mas-ff-annual-price` booleans (from attributes or URL). |
| `providers.checkout(fn)` | Register a checkout options provider; returns an unsubscribe function. |
| `providers.price(fn)` | Register a price options provider; returns an unsubscribe function. |
| `collectCheckoutOptions(overrides, element)` | Merge service, provider, dataset, and override options for checkout. |
| `collectPriceOptions(overrides, element)` | Merge service, provider, dataset, and override options for pricing. |
| `buildCheckoutURL(offers, options)` | Build a UCv3 checkout URL from resolved offers. |
| `buildPriceHTML(offers, options)` | Render price markup for `inline-price`. |
| `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)` | Resolve default `displayTax` / `forceTaxExclusive` for a geo/segment (used by `inline-price` when defaults flag is on). |
| `duration` | Performance timing object for service activation. |
| `log` | LANA logger instance. |

`merch-card` registers price and checkout providers automatically when it connects, so card-hosted `inline-price` and checkout elements inherit card context (promotion codes, literals, etc.).

## Examples {#examples}

### Stage environment

```html {.demo}
<mas-commerce-service env="stage"></mas-commerce-service>
```

### Locale and API key

```html
<mas-commerce-service
    locale="en_CA"
    wcs-api-key="custom-api-key"
    checkout-client-id="custom-client-id"
    lana-tags="my-surface"
></mas-commerce-service>
```

### Refresh offers

```html {.demo}
<button id="btnRefreshOffers">Refresh offers</button>
<script type="module">
    document.getElementById('btnRefreshOffers').addEventListener('click', () => {
        document.querySelector('mas-commerce-service')?.refreshOffers();
    });
</script>
```
