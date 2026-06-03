# mas-commerce-service

## mas-commerce-service

### What it does

Root custom element (`<mas-commerce-service>`) that bootstraps M@S on a page: loads locale/commerce settings, price literals, WCS and checkout APIs, IMS helpers, and logging. On `connectedCallback` it calls `activate()`, composes APIs from `Checkout`, `Ims`, `Price`, and `Wcs` modules onto the element, and dispatches `wcms:commerce:ready`.

All `inline-price`, `checkout-link`, and `checkout-button` elements depend on this service being present and activated.

Tag name constant: `mas-commerce-service` (`TAG_NAME_SERVICE` in `constants.js`).

### Attributes / Props

Root / locale attributes (`mas-commerce-service.js` `#config`):

| Attribute | Config key | Description |
| --- | --- | --- |
| `env` | `commerce.env`, `hostEnv.name` | `prod` or `stage`. Default `prod`. |
| `locale` | `locale` | Locale string (e.g. `en_US`). |
| `country` | `country` | Country code for WCS/pricing. |
| `language` | `language` | Language for literals and formatting. |
| `preview` | `preview` | Preview mode (`true`, `on`, etc.). |
| `instant` | `instant` | Optional “current date” for promo/price preview (also URL param). |
| `mas-io-url` | `masIOUrl` | MAS IO API base URL. |
| `lana-tags` | `lana.tags` | LANA logging tags. |
| `lana-sample-rate` | `lana.sampleRate` | LANA sample rate (integer, default `1`). |

Commerce attributes (camelCased into `config.commerce`):

| Attribute | Commerce key | Description |
| --- | --- | --- |
| `checkout-workflow-step` | `checkoutWorkflowStep` | Default UCv3 step for CTAs. |
| `force-tax-exclusive` | `forceTaxExclusive` | Force tax-exclusive prices globally. |
| `checkout-client-id` | `checkoutClientId` | Checkout client id. |
| `allow-override` | `allowOverride` | Allow `commerce.env` / landscape overrides via query params. |
| `wcs-api-key` | `wcsApiKey` | WCS API key. |

Feature flags on the element (read once, `data-{flag}` or URL param via `getParameter`):

| Attribute | Flag constant | Enabled when |
| --- | --- | --- |
| `data-mas-ff-defaults` | `mas-ff-defaults` | `on` or `true` |
| `data-mas-ff-annual-price` | `mas-ff-annual-price` | `on` or `true` |

**Methods** (defined in `activate()`):

| Method | Description |
| --- | --- |
| `registerCheckoutAction(action)` | `action(offers, options, imsSignedInPromise, el)` may return `{ url, text, className, handler }` to override CTA behavior. |
| `flushWcsCache()` | Clears internal WCS cache. |
| `refreshOffers()` | Flushes cache and calls `requestUpdate(true)` on all MAS elements (`SELECTOR_MAS_ELEMENT`). |
| `refreshFragments()` | Flushes WCS cache, clears `aem-fragment` cache, refreshes all fragments. |
| `isPreview()` | True when `preview` attribute is `true` or `on`. |

**Exposed APIs** (from composed modules): `buildCheckoutURL`, `collectCheckoutOptions`, `collectPriceOptions`, `buildPriceHTML`, `createInlinePrice`, `createCheckoutLink`, `resolvePriceTaxFlags`, `providers` (checkout/price provider registry), `settings`, `log`, `defaults`, WCS/IMS/checkout helpers, and re-exported `Constants`.

| Getter | Description |
| --- | --- |
| `duration` | Performance measure for service ready time. |
| `featureFlags` | `{ 'mas-ff-defaults', 'mas-ff-annual-price' }` booleans. |

### Events

| Event | When | `detail` |
| --- | --- | --- |
| `wcms:commerce:ready` | After `activate()` completes | The service element (`this`) |

(`EVENT_TYPE_READY` in `constants.js` — not `mas:ready`.)

### Usage example

Production (minimum: set `wcs-api-key` and `lana-tags` in real deployments):

```html
<mas-commerce-service
    wcs-api-key="wcms-commerce-ims-ro-user-milo"
    lana-tags="your-surface"
></mas-commerce-service>
<script src="https://www.adobe.com/mas/libs/mas.js" type="module"></script>
```

Stage:

```html
<mas-commerce-service env="stage" country="CA" language="fr"></mas-commerce-service>
```

Custom checkout action:

```javascript
const service = document.querySelector('mas-commerce-service');
await new Promise((r) =>
    service.addEventListener('wcms:commerce:ready', r, { once: true }),
);
service.registerCheckoutAction(async (offers, options, imsSignedIn, el) => ({
    handler: (e) => {
        e.preventDefault();
        /* custom flow */
    },
}));
```

Refresh offers:

```html {.demo}
<button id="btnRefresh">Refresh</button>
<script type="module">
    document.getElementById('btnRefresh').addEventListener('click', () => {
        document.querySelector('mas-commerce-service').refreshOffers();
    });
</script>
```

### Notes

- Safari: load customized built-in elements polyfill before `mas.js` (see [mas.js](mas.js.html)).
- `logFailedRequests()` runs ~10s after ready and logs fragment/WCS resource failures.
- Meta-tag feature flags are documented in [feature-flags](feature-flags.html); only `mas-ff-defaults` and `mas-ff-annual-price` are read on the service element itself.
- Broader enablement and locale table: [mas.js](mas.js.html).
