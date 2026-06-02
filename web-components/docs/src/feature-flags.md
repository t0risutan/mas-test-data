# Feature Flags

## What it does

Feature flags control optional MAS commerce behavior. In this repository, flags are implemented in two ways:

1. **Commerce service element** — `data-mas-ff-*` attributes (and URL params via `getParameter`) read in `mas-commerce-service.js` `featureFlags` getter.
2. **Document meta tags** — read directly in checkout code for 3-in-1 modal behavior.

Studio-authored cards enable `mas-ff-defaults` for fragment-backed prices via `merch-card.js` (not only via meta).

## Attributes / Props

### Implemented on `mas-commerce-service`

Set via attribute `data-{flag-name}` with value `on` or `true`, or matching URL parameter:

| Flag | Attribute | Default | Effect in code |
| ---- | --------- | ------- | -------------- |
| `mas-ff-defaults` | `data-mas-ff-defaults` | off | When on: inline prices use geo/segment tax and per-unit defaults (`inline-price.js`); service settings respect flag in `settings.js`. |
| `mas-ff-annual-price` | `data-mas-ff-annual-price` | off | When on and `data-display-annual` is not `false`: enables annual price rendering for eligible ABM offers (`inline-price.js`). |

Example:

```html
<mas-commerce-service data-mas-ff-defaults="on" data-mas-ff-annual-price="on"></mas-commerce-service>
```

Meta tag equivalent (parsed by `getParameter` when wired through commerce config):

```html
<meta name="mas-ff-defaults" content="on">
```

### Implemented via meta tag (checkout)

| Flag | Meta name | Default in code | Effect |
| ---- | --------- | --------------- | ------ |
| `mas-ff-3in1` | `mas-ff-3in1` | on (3-in-1 active unless meta content is `off`) | When `data-modal` is `twp`, `d2p`, or `crm` (`MODAL_TYPE_3_IN_1` in `constants.js`), unified 3-in-1 checkout flow is used (`checkout-mixin.js`, `checkout.js`). |

```html
<meta name="mas-ff-3in1" content="off">
```

### Documented previously but not found in `web-components/src`

The following flags appear in older authoring docs but **have no references** under `web-components/src/` in this repository: `mas-ff-copy-cta`, `mas-ff-mas-deps`, `mas-geo-detection`. They may be implemented in page loaders (e.g. Milo `mas.js`) outside this package—verify in the consuming surface before relying on them.

## Events

Feature flags do not dispatch their own events. Enabling `mas-ff-annual-price` or `mas-ff-defaults` affects `mas:resolved` / `mas:failed` timing and content on child `inline-price` elements.

## Usage example

```html
<meta name="mas-ff-3in1" content="on">
<mas-commerce-service
    locale="en_US"
    data-mas-ff-defaults="on"
></mas-commerce-service>
```

## Notes

- `mas-ff-defaults` tax and unit behavior is implemented in `inline-price.js` (`resolvePriceTaxFlags`, country lists `DISPLAY_ALL_TAX_COUNTRIES`, `TAX_EXCLUDED_MAP`). Detailed locale tables in earlier docs were Milo-specific; source of truth for logic is `inline-price.js`.
- Only `mas-ff-defaults` and `mas-ff-annual-price` are exposed on `MasCommerceService.featureFlags`.
- Per-price opt-out of annual display: `data-display-annual="false"` on `inline-price`.
- 3-in-1 modal types: `twp`, `d2p`, `crm` (`constants.js`).
