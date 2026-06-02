## Feature Flags

### What it does

Feature flags toggle M@S runtime behavior for pricing defaults, annual price display, and checkout modal flows. In this codebase, flags are read at page load from:

1. **`mas-commerce-service` attributes** — `data-mas-ff-defaults`, `data-mas-ff-annual-price` (via `#getFeatureFlag()` in `mas-commerce-service.js`, also matching URL query parameters).
2. **`<meta>` tags** — `mas-ff-3in1` read directly in `checkout-mixin.js` and `checkout.js`.

There is no centralized feature-flag registry beyond these implementations.

### Attributes / Props

#### mas-ff-defaults

| Setting | Value |
|---------|-------|
| Attribute on service | `data-mas-ff-defaults="on"` or `"true"` |
| URL parameter | `mas-ff-defaults=on` |
| Constant | `FF_DEFAULTS` in `constants.js` |
| Default | **off** (flag absent or falsy) |

When enabled:

- `inline-price` auto-fills `displayPerUnit` for non-`INDIVIDUAL` customer segments when not explicitly set.
- `displayTax` and `forceTaxExclusive` are resolved via `resolvePriceTaxFlags()` when not set on the element.
- `merch-card` sets `options[FF_DEFAULTS] = true` for inline prices loaded from AEM fragments (`merch-card.js` price options provider).
- `mas-field` hosted inline prices also opt into defaults (`mas-field.js`).

#### mas-ff-annual-price

| Setting | Value |
|---------|-------|
| Attribute on service | `data-mas-ff-annual-price="on"` or `"true"` |
| URL parameter | `mas-ff-annual-price=on` |
| Constant | `FF_ANNUAL_PRICE` in `constants.js` |
| Default | **off** |

When enabled and element `data-display-annual` is not `false`, `inline-price` sets `displayAnnual: true`, which causes `buildPriceHTML()` to use annual price templates for ABM plan types.

#### mas-ff-3in1

| Setting | Value |
|---------|-------|
| Meta tag | `<meta name="mas-ff-3in1" content="off">` disables |
| Read in | `checkout-mixin.js` (`isOpen3in1Modal`), `checkout.js` (`buildCheckoutURL`) |
| Default | **on** (3-in-1 active when meta absent or content is not `off`) |

When active and `data-modal` is `twp`, `d2p`, or `crm` (`MODAL_TYPE_3_IN_1` in `constants.js`), checkout uses the unified 3-in-1 modal flow (`is3in1: true` in checkout URL data).

Valid `data-modal` values for 3-in-1: `twp`, `d2p`, `crm`.

### Events

Feature flags do not dispatch their own events. Enabling or disabling a flag requires a page reload; downstream elements react during normal `mas:resolved` / checkout rendering.

### Usage example

Enable pricing defaults and annual price on the service:

```html
<meta name="mas-ff-3in1" content="on">

<mas-commerce-service
  data-mas-ff-defaults="on"
  data-mas-ff-annual-price="on"
  wcs-api-key="wcms-commerce-ims-ro-user-milo"
></mas-commerce-service>
```

Disable 3-in-1 modal checkout:

```html
<meta name="mas-ff-3in1" content="off">
```

Opt out of annual display on a single price:

```html
<span
  is="inline-price"
  data-wcs-osi="..."
  data-display-annual="false"
></span>
```

### Notes

**Flags documented elsewhere but not implemented in this repository:**

The developer doc `web-components/docs/src/feature-flags.md` also describes `mas-ff-copy-cta`, `mas-ff-mas-deps`, and `mas-geo-detection`. These strings do not appear anywhere under `web-components/src/` or the rest of the `mas` repository. Treat them as out of scope for this codebase until corresponding source is added.

**Truthy values:** `#getFeatureFlag()` treats `on`, `true`, and boolean `true` as enabled.

**Studio behavior:** Authoring docs at `/docs/mas-defaults` on the live site cover locale-specific tax and unit label defaults tied to `mas-ff-defaults`; the implementation lives in `inline-price.js` (`DISPLAY_ALL_TAX_COUNTRIES`, `TAX_EXCLUDED_MAP`, etc.).

Source: `web-components/src/mas-commerce-service.js`, `web-components/src/constants.js`, `web-components/src/inline-price.js`, `web-components/src/checkout-mixin.js`, `web-components/src/checkout.js`, `web-components/src/merch-card.js`, `web-components/src/mas-field.js`.
