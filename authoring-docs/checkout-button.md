## checkout-button

### What it does

A customized built-in element (`<button is="checkout-button">`) that resolves one or more Offer Selector IDs (OSIs) via WCS, builds a UCv3 checkout URL, and navigates to it on click. It extends `HTMLButtonElement` via `CheckoutMixin` in `web-components/src/checkout-mixin.js`.

The resolved checkout URL is stored on the element as `data-href` (exposed through the `href` getter). If a custom checkout action is registered on `mas-commerce-service`, or if the resolved action provides a handler, click behavior is delegated to that handler instead of navigation.

When `data-modal="true"`, the checkout URL is set to `#` and modal behavior is handled by the checkout action layer.

### Attributes / Props

Observed `data-*` attributes (from `CheckoutMixin.observedAttributes` in `checkout-mixin.js`):

| Attribute | Maps to option | Description | Default |
|-----------|----------------|-------------|---------|
| `data-wcs-osi` | `wcsOsi` | Comma-separated Offer Selector IDs. Required for resolution. | (none) |
| `data-checkout-workflow` | checkout workflow | Target checkout workflow. | `UCv3` (from settings) |
| `data-checkout-workflow-step` | `checkoutWorkflowStep` | UCv3 workflow step (e.g. `email`, `recommendation`). | `email` |
| `data-extra-options` | `extraOptions` | JSON string of additional checkout query parameters. | `{}` |
| `data-ims-country` | `imsCountry` / `country` | Signed-in user's country; overrides locale country in checkout URL. Set automatically from IMS when available. | (none) |
| `data-perpetual` | `perpetual` | Whether the offer is perpetual (`true` / `false`). | `false` |
| `data-promotion-code` | `promotionCode` | Flex promotion code. Cleared if promotion is not active. | (from service settings) |
| `data-quantity` | `quantity` | Comma-separated quantities aligned with OSIs. | `1` |
| `data-entitlement` | `entitlement` | Entitlement flag for client-side interpretation. | `false` |
| `data-upgrade` | `upgrade` | Upgrade flag for client-side interpretation. | `false` |
| `data-modal` | `modal` | Modal flag. Values `twp`, `d2p`, or `crm` participate in 3-in-1 modal flow when `mas-ff-3in1` is not disabled. | (none) |
| `data-template` | `template` | Observed but used by price elements, not checkout rendering. | (none) |

Additional attributes commonly set during hydration (via `element.dataset`, not in `observedAttributes`):

| Attribute | Description |
|-----------|-------------|
| `data-analytics-id` | Human-readable analytics ID for the button. |
| `daa-ll` | Martech analytics ID including position within the card. |

Read-only properties:

| Property | Description |
|----------|-------------|
| `isCheckoutButton` | Always `true`. |
| `onceSettled` | Promise resolving when the element reaches resolved or failed state. |
| `options` | Collected checkout options used for the last render. |
| `value` | Resolved WCS offer(s). |
| `href` | Resolved checkout URL from `data-href`. |
| `marketSegment` / `customerSegment` | Derived from options or resolved offer. |
| `is3in1Modal` | Whether `data-modal` is `twp`, `d2p`, or `crm`. |
| `isOpen3in1Modal` | Whether 3-in-1 modal flow is active (see Notes). |

Methods:

| Method | Description |
|--------|-------------|
| `requestUpdate(force?)` | Re-resolves and re-renders. Skips if no changes unless `force` is true. |

Static factory:

| Method | Description |
|--------|-------------|
| `CheckoutButton.createCheckoutButton(options, innerHTML)` | Creates a button when `mas-commerce-service` is present. |

### Events

Dispatched by the internal `MasElement` wrapper (`web-components/src/mas-element.js`):

| Event | When |
|-------|------|
| `mas:resolved` | Offer(s) resolved and checkout URL or action applied. |
| `mas:failed` | Offer resolution failed. `detail` contains error information. |

CSS state classes toggled on the element: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

The service readiness event is `wcms:commerce:ready` on `mas-commerce-service` (not on the button itself).

### Usage example

```html
<mas-commerce-service wcs-api-key="wcms-commerce-ims-ro-user-milo"></mas-commerce-service>

<button
  is="checkout-button"
  data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>
  Buy now
</button>
```

To intercept clicks without following the checkout URL, attach a capture-phase listener:

```javascript
button.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log(button.href);
}, { capture: true });
```

### Notes

- Requires `mas-commerce-service` on the page. Without it, `connectedCallback` cannot resolve offers.
- For buttons with nested markup (`<span>`, `<strong>`), use `{ capture: true }` on click listeners; the mixin wraps label text in a `<span style="pointer-events: none;">`.
- 3-in-1 modal behavior (`twp`, `d2p`, `crm`) is controlled by `<meta name="mas-ff-3in1" content="off">`. When the meta tag is absent or not `off`, those modal types use the unified flow (`isOpen3in1Modal` in `checkout-mixin.js`).
- Download and upgrade checkout actions add CSS classes `download` and `upgrade` respectively; in those cases URL navigation may be suppressed.
- Source: `web-components/src/checkout-button.js`, `web-components/src/checkout-mixin.js`, `web-components/src/checkout.js`.
