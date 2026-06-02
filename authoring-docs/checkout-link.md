## checkout-link

### What it does

A customized built-in element (`<a is="checkout-link">`) that resolves Offer Selector IDs via WCS, builds a UCv3 checkout URL, and sets it as the element `href`. It extends `HTMLAnchorElement` via `CheckoutMixin` in `web-components/src/checkout-mixin.js`.

The element is also referred to historically as a "placeholder" in older documentation; the codebase uses the `checkout-link` custom element name.

On click, if a custom checkout action handler is registered, the handler runs instead of default link navigation. Otherwise the browser follows `href`.

### Attributes / Props

Observed `data-*` attributes (same set as `checkout-button`; see `CheckoutMixin.observedAttributes`):

| Attribute | Maps to option | Description | Default |
|-----------|----------------|-------------|---------|
| `data-wcs-osi` | `wcsOsi` | Comma-separated Offer Selector IDs. Required. | (none) |
| `data-checkout-workflow` | checkout workflow | Target checkout workflow. | `UCv3` |
| `data-checkout-workflow-step` | `checkoutWorkflowStep` | UCv3 workflow step. | `email` |
| `data-extra-options` | `extraOptions` | JSON string of extra checkout query params. | `{}` |
| `data-ims-country` | `imsCountry` / `country` | Overrides locale country when set. | (none) |
| `data-perpetual` | `perpetual` | Perpetual offer flag. | `false` |
| `data-promotion-code` | `promotionCode` | Flex promotion code. | (from settings) |
| `data-quantity` | `quantity` | Comma-separated quantities per OSI. | `1` |
| `data-entitlement` | `entitlement` | Entitlement flag. | `false` |
| `data-upgrade` | `upgrade` | Upgrade flag. | `false` |
| `data-modal` | `modal` | Modal type (`twp`, `d2p`, `crm`, or `true`). | (none) |
| `data-template` | `template` | Observed on the mixin; not used for link rendering. | (none) |

Additional attributes from hydration / authoring:

| Attribute | Description |
|-----------|-------------|
| `data-analytics-id` | Human-readable analytics ID. |
| `daa-ll` | Martech analytics ID with position suffix. |

Read-only properties:

| Property | Description |
|----------|-------------|
| `isCheckoutLink` | Always `true`. |
| `onceSettled` | Promise for resolved or failed state. |
| `options` | Last collected checkout options. |
| `value` | Resolved WCS offer(s). |
| `marketSegment` / `customerSegment` | From options or offer. |
| `is3in1Modal` / `isOpen3in1Modal` | 3-in-1 modal detection (see checkout-button Notes). |

Methods:

| Method | Description |
|--------|-------------|
| `requestUpdate(force?)` | Re-resolve offers and update `href`. |

Static factory:

| Method | Description |
|--------|-------------|
| `CheckoutLink.createCheckoutLink(options, innerHTML)` | Creates a link when service is present. |

### Events

| Event | When |
|-------|------|
| `mas:resolved` | Offer(s) resolved; `href` updated. |
| `mas:failed` | Resolution failed. |

CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

Unlike `checkout-button`, a normal (non-capture) click listener with `preventDefault()` is sufficient to intercept navigation on the anchor itself.

### Usage example

```html
<mas-commerce-service></mas-commerce-service>

<a
  href="#"
  is="checkout-link"
  data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>
  Buy now
</a>
```

Multiple OSIs with quantities:

```html
<a
  is="checkout-link"
  data-wcs-osi="osi1,osi2"
  data-quantity="2,3"
>
  Buy bundle
</a>
```

### Notes

- Initial `href` should be `#` or a placeholder; it is replaced after `mas:resolved`.
- When `data-modal="true"`, `href` is set to `#` after resolution (`checkout-mixin.js` `renderOffers`).
- Checkout URL generation uses `buildCheckoutURL` in `web-components/src/checkout.js`, which reads `<meta name="mas-ff-3in1">` for modal workflow behavior.
- Source: `web-components/src/checkout-link.js`, `web-components/src/checkout-mixin.js`, `web-components/src/checkout.js`.
