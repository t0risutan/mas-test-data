# checkout-link

## What it does

`checkout-link` is a customized built-in element (`<a is="checkout-link">`) that resolves WCS offer selector IDs and sets the anchor `href` to a generated UCv3 checkout URL. It shares the same resolution and URL-building pipeline as `checkout-button` via `checkout-mixin.js`.

The element is headless in behavior beyond setting `href` and optional checkout action handlers; link text stays in light DOM. Historically called a “placeholder”; prefer **checkout-link** in new authoring.

Requires `<mas-commerce-service>` on the page.

## Attributes / Props

Same observed `data-*` attributes as `checkout-button` (`checkout-mixin.js`):

| Attribute | Description |
| --------- | ----------- |
| `data-wcs-osi` | Offer selector ID(s), comma-separated. **Required**. |
| `data-checkout-workflow-step` | UCv3 workflow step. |
| `data-extra-options` | JSON checkout query params. |
| `data-ims-country` | Country override; may be set from IMS when signed in. |
| `data-perpetual` | Perpetual offer flag. |
| `data-promotion-code` | Flex promotion code. |
| `data-quantity` | Quantity (comma-separated for multiple OSIs). |
| `data-entitlement` | Client-side entitlement flag. |
| `data-upgrade` | Client-side upgrade flag. |
| `data-modal` | Modal type (`twp`, `d2p`, `crm` for 3-in-1 when enabled). |

Analytics (typically from Studio / hydration):

| Attribute | Description |
| --------- | ----------- |
| `data-analytics-id` | Human-readable link id. |
| `daa-ll` | Martech id with position suffix. |

**Properties and methods:**

| Name | Description |
| ---- | ----------- |
| `isCheckoutLink` | Always `true`. |
| `value` | Resolved offer(s). |
| `options` | Last render options. |
| `onceSettled()` | Promise for resolve/fail lifecycle. |
| `requestUpdate(force?)` | Re-resolve offers. |
| `marketSegment` / `customerSegment` | From options or offer. |
| `is3in1Modal` / `isOpen3in1Modal` | 3-in-1 modal detection (see checkout-button). |
| `checkoutActionHandler` | Custom click handler when checkout action provides one. |

Static helper: `CheckoutLink.createCheckoutLink(options, innerHTML)`.

Checkout URL is written to the native `href` attribute (`setCheckoutUrl` in `checkout-link.js`). Modal offers may use `href="#"`.

## Events

| Event | Description |
| ----- | ----------- |
| `mas:resolved` | Offers resolved; `href` updated. Bubbles. |
| `mas:failed` | Resolution failed. Bubbles. |

**CSS classes:** `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

`mas:pending` is **not** dispatched by current `MasElement` code (see checkout-button notes).

## Usage example

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>Buy now</a>
```

Custom workflow step and extra query params:

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-checkout-workflow-step="recommendation"
    data-extra-options='{"promoid":"promo12345"}'
>Buy now</a>
```

Unlike `checkout-button`, default click on the anchor follows `href`; use `preventDefault` on the link or a parent handler if you need to intercept navigation (bubble phase is sufficient for links that have not yet navigated).

## Notes

- Implementation: `web-components/src/checkout-link.js`, `checkout-mixin.js`.
- `clickHandler` only runs a custom `checkoutActionHandler` when present; otherwise the browser follows `href`.
- Inner markup can include nested elements; `createCheckoutElement` wraps inner HTML in a `pointer-events: none` span for consistent click targeting on buttons (links use plain innerHTML when created programmatically).
