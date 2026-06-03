# mas-commerce-service {#mas-commerce-service}

## Introduction {#introduction}

The `mas-commerce-service` custom element bootstraps M@S commerce on a page. It activates WCS (offer resolution), checkout URL generation, price rendering, IMS integration, and fragment fetching. Every `inline-price`, `checkout-link`, `checkout-button`, and `merch-card` on the page depends on a single `mas-commerce-service` instance being present and activated.

See [mas.js](mas.js.html) for library loading and [Feature Flags](feature-flags.html) for flag configuration.

### Example {#example}

```html {.demo}
<mas-commerce-service locale="en_US"></mas-commerce-service>
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

## Attributes {#attributes}

| Attribute | Description | Default Value | Required |
| --- | --- | --- | --- |
| `env` | Commerce environment: `prod` or `stage`. Controls WCS and MAS IO URLs. | `prod` | `false` |
| `locale` | Locale for WCS and pricing (`language_country`, e.g. `en_US`). | Derived from `language` + `country`, or `en_US` | `false` |
| `country` | ISO country code for offers and checkout. | `US` or locale country | `false` |
| `language` | Language code for price literals. | `en` or locale language | `false` |
| `wcs-api-key` | API key for WCS and fragment requests. | `wcms-commerce-ims-ro-user-milo` | `false` |
| `checkout-client-id` | Checkout client id passed to commerce-core. | `adobe_com` | `false` |
| `checkout-workflow-step` | Default checkout workflow step for CTAs without `data-checkout-workflow-step`. One of: `segmentation`, `bundle`, `commitment`, `recommendation`, `email`, `payment`, `change-plan/team-upgrade/plans`, `change-plan/team-upgrade/payment`. | `email` | `false` |
| `force-tax-exclusive` | Force tax-exclusive price display globally when set. | `false` | `false` |
| `allow-override` | When `true` or empty, allows overriding `env` and landscape via URL (`commerce.env`, `commerce.landscape`). | `false` | `false` |
| `preview` | Enable preview mode (`true`, `on`). Can be overridden with `mas.preview=off` in the URL. | off | `false` |
| `instant` | Passed to AEM fragment preview when generating preview content. | | `false` |
| `mas-io-url` | Base URL for MAS IO fragment API. | `https://www.adobe.com/mas/io` (stage: `https://www.stage.adobe.com/mas/io`) | `false` |
| `lana-tags` | Tags for LANA logging (e.g. `ccd`). | | `false` |
| `lana-sample-rate` | LANA sampling rate (integer). | `1` | `false` |
| `data-mas-ff-defaults` | Enable `mas-ff-defaults` (see [Feature Flags](feature-flags.html)). Values `on`/`true` enable. URL query param `mas-ff-defaults` also applies. | off | `false` |
| `data-mas-ff-annual-price` | Enable `mas-ff-annual-price`. Values `on`/`true` enable. URL query param `mas-ff-annual-price` also applies. | off | `false` |

## Events {#events}

| Event | Description |
| --- | --- |
| `wcms:commerce:ready` | Fires when the service has activated. `event.detail` is the service element. Bubbles. Use this (not `mas:ready`) to detect service readiness. |

### Example {#events-example}

```html {.demo}
<script type="module">
    document.addEventListener('wcms:commerce:ready', (e) => {
        document.getElementById('serviceLog').textContent =
            'Service ready: ' + e.detail.tagName;
    });
</script>
<p id="serviceLog"></p>
```

## Methods {#methods}

| Method | Description |
| --- | --- |
| `registerCheckoutAction(action)` | Registers a custom checkout handler. `action` signature: `(offers, options, imsSignedInPromise, element) => Promise<{ url?, text?, className?, handler? } \| null>`. When a handler is returned, navigation uses that instead of the default checkout URL. |
| `flushWcsCache()` | Clears the in-memory WCS offer cache. |
| `refreshOffers()` | Flushes WCS cache and calls `requestUpdate(true)` on all MAS placeholder elements (`inline-price`, `checkout-link`, `checkout-button`). |
| `refreshFragments()` | Flushes WCS cache, clears the `aem-fragment` cache, and refreshes all `aem-fragment` elements without bypassing fragment cache on each element (`refresh(false)`). |
| `isPreview()` | Returns `true` when `preview` attribute is `true` or `on`. |
| `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)` | Returns a promise `{ displayTax, forceTaxExclusive }` for geo/segment defaults (used by `inline-price` when `mas-ff-defaults` is on). |

## Properties {#properties}

After activation, the service exposes APIs merged from checkout, price, WCS, and IMS modules:

| Property / API | Description |
| --- | --- |
| `settings` | Resolved locale, WCS URL, checkout defaults, literals config, etc. |
| `featureFlags` | Object with `mas-ff-defaults` and `mas-ff-annual-price` booleans (only flags read by this component). |
| `defaults` | Frozen default option values (`Defaults`). |
| `providers.checkout(fn)` | Register a checkout options provider; returns unsubscribe function. |
| `providers.price(fn)` | Register a price options provider; returns unsubscribe function. |
| `buildCheckoutURL(offers, options)` | Build checkout URL from resolved offers. |
| `buildPriceHTML(offers, options)` | Build price HTML for `inline-price`. |
| `createCheckoutLink(options, innerHTML)` | Programmatically create a `checkout-link`. |
| `createInlinePrice(options)` | Programmatically create an `inline-price`. |
| `resolveOfferSelectors(options)` | Resolve WCS OSIs to offer arrays. |
| `imsSignedInPromise` | Promise resolving to whether the user is signed in. |
| `imsCountryPromise` | Promise resolving to signed-in user's country code or null. |
| `duration` | Performance timing object for service activation. |
| `log` | MAS logging module. |

## Providers {#providers}

`merch-card` registers price and checkout providers so nested placeholders inherit card-level `promotionCode`, literals, and variant-specific options. Consumer code can register additional providers the same way:

```javascript
const service = document.querySelector('mas-commerce-service');
service.providers.price((element, options) => {
    // mutate options before inline-price resolves
});
```

## Custom checkout action {#custom-checkout-action}

```html {.demo}
<mas-commerce-service id="svc"></mas-commerce-service>
<a
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now</a
>
<script type="module">
    document.addEventListener('wcms:commerce:ready', ({ detail: svc }) => {
        svc.registerCheckoutAction(async () => ({
            url: '#custom-checkout',
            handler(e) {
                e.preventDefault();
                alert('Custom checkout');
            },
        }));
        document.querySelector('a[is="checkout-link"]').requestUpdate(true);
    });
</script>
```

## Related pages {#related}

- [inline-price](inline-price.html)
- [checkout-link](checkout-link.html)
- [checkout-button](checkout-button.html)
- [merch-card](merch-card.html)
- [aem-fragment](aem-fragment.html)
