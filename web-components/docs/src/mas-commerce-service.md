# mas-commerce-service

## What it does

`<mas-commerce-service>` is the root web component that activates commerce on a page. On connect it loads locale and commerce settings, initializes WCS, checkout URL building, price rendering, IMS helpers, and logging, then exposes that API on the element itself.

Child elements (`inline-price`, `checkout-link`, `checkout-button`, `upt-link`, `merch-card`, `aem-fragment`, and others) call `getService()` to resolve offers and render commerce UI. The element must be present in the DOM before those placeholders can resolve.

## Attributes / Props

Element attributes (kebab-case on the tag; commerce-specific values are passed into internal `commerce` config):

| Attribute | Description |
| --------- | ----------- |
| `env` | Commerce environment. Default `prod`. `stage` switches WCS to the stage artifact URL. |
| `locale` | Locale string (e.g. `en_US`). Used with `country` / `language` when set. |
| `country` | Uppercase country code for WCS and pricing. |
| `language` | Lowercase language code. |
| `preview` | When `true` or `on`, enables preview mode in settings. |
| `instant` | Passed through for preview/instant content flows. |
| `mas-io-url` | Base URL for MAS IO (fragment API). Defaults to `https://www.adobe.com/mas/io` or stage equivalent. |
| `checkout-workflow-step` | Default UCv3 workflow step for checkout placeholders (validated against `CheckoutWorkflowStep` in `constants.js`). Default from service: `email`. |
| `force-tax-exclusive` | Service-level default for tax-exclusive pricing. |
| `checkout-client-id` | Checkout client id. Default `adobe_com`. |
| `allow-override` | When `true` or empty, allows `commerce.env` and `commerce.landscape` URL overrides. |
| `wcs-api-key` | WCS API key. Default `wcms-commerce-ims-ro-user-milo`. |
| `lana-tags` | Tags passed to Lana logging config. |
| `lana-sample-rate` | Lana sample rate (integer, default `1`). |
| `data-mas-ff-defaults` | Feature flag: `on` / `true` enables `mas-ff-defaults` behavior for inline prices on the page. |
| `data-mas-ff-annual-price` | Feature flag: `on` / `true` enables annual price display defaults for inline prices. |

**Properties and methods on the activated element** (defined at runtime in `mas-commerce-service.js` and mixed-in modules):

| Name | Description |
| ---- | ----------- |
| `settings` | Resolved locale, WCS, checkout, and display defaults. |
| `featureFlags` | Object with `mas-ff-defaults` and `mas-ff-annual-price` booleans. |
| `defaults` | Frozen default values from `defaults.js`. |
| `log` | MAS logging module. |
| `providers` | Register checkout/price option providers: `providers.checkout(fn)`, `providers.price(fn)`. |
| `resolvePriceTaxFlags(country, language, customerSegment, marketSegment)` | Returns `{ displayTax, forceTaxExclusive }` for geo/segment. |
| `registerCheckoutAction(action)` | Optional async hook to override checkout CTA behavior per offer. |
| `buildCheckoutURL`, `collectCheckoutOptions`, `collectPriceOptions`, `buildPriceHTML`, `resolveOfferSelectors`, `flushWcsCache`, etc. | Checkout and price APIs from `checkout.js`, `price.js`, `wcs.js`. |
| `refreshOffers()` | Clears WCS cache and calls `requestUpdate(true)` on all MAS placeholder elements. |
| `refreshFragments()` | Clears WCS cache and AEM fragment cache, then refreshes all `aem-fragment` elements. |
| `isPreview()` | Returns whether preview mode is active. |
| `duration` | Performance timing object for service activation. |

## Events

| Event | Description |
| ----- | ----------- |
| `wcms:commerce:ready` | Dispatched when the service has finished `activate()`. `event.detail` is the service element. Bubbles. Constant: `EVENT_TYPE_READY` in `constants.js`. |

## Usage example

```html {.demo}
<mas-commerce-service
    env="prod"
    locale="en_US"
    data-mas-ff-defaults="on"
></mas-commerce-service>

<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>Buy now</a>
```

Listen for readiness before depending on service APIs:

```html {.demo}
<script type="module">
    document.addEventListener('wcms:commerce:ready', (e) => {
        console.log('Commerce service ready', e.detail.settings);
    });
</script>
```

## Notes

- Tag name: `mas-commerce-service` (`TAG_NAME_SERVICE` in `constants.js`).
- Feature flags on the service only implement `mas-ff-defaults` and `mas-ff-annual-price` via `data-mas-ff-*` attributes or URL parameters (see `feature-flags.md`).
- `mas-ff-3in1` is not read on the service element; checkout code reads `<meta name="mas-ff-3in1">` directly (`checkout-mixin.js`, `checkout.js`).
- IMS country is applied asynchronously to checkout placeholders when signed in (`checkout-mixin.js`).
