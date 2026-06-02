# checkout-button

## What it does

`checkout-button` is a customized built-in element (`<button is="checkout-button">`) that resolves one or more WCS offer selector IDs (OSIs), builds a UCv3 checkout URL (via `buildCheckoutUrl` / commerce-core), and sets navigation on click.

When resolution succeeds, the button gets a checkout URL on `data-href` (exposed as the `href` getter). On click, if no custom handler is registered, the browser navigates to that URL. Modal flows may set `href` to `#` and use an internal `checkoutActionHandler` instead.

Requires `<mas-commerce-service>` on the page. See [MAS](mas.html#terminology) for OSI terminology.

## Attributes / Props

Observed attributes (from `checkout-mixin.js` `observedAttributes`; changes trigger re-render):

| Attribute | Maps to options | Description |
| --------- | ---------------- | ----------- |
| `data-wcs-osi` | `wcsOsi` | Offer selector ID(s). Comma-separated for multiple offers. **Required** for resolution. |
| `data-checkout-workflow-step` | `checkoutWorkflowStep` | UCv3 workflow step (e.g. `email`, `recommendation`). Default from service: `email`. |
| `data-extra-options` | `extraOptions` | JSON string of extra checkout query parameters. |
| `data-ims-country` | (dataset) | Overrides locale country in checkout URL when set. May be set automatically from IMS when signed in. |
| `data-perpetual` | `perpetual` | `true` / `false` — perpetual offer flag. |
| `data-promotion-code` | `promotionCode` | Flex promotion code; removed if promotion is not active. |
| `data-quantity` | `quantity` | Quantity per OSI; comma-separated when multiple OSIs (default `1`). |
| `data-entitlement` | `entitlement` | Boolean flag for client-side interpretation. |
| `data-upgrade` | `upgrade` | Boolean; adds `upgrade` class when checkout action supplies it. |
| `data-modal` | `modal` | Modal type string; `twp`, `d2p`, and `crm` enable 3-in-1 modal flow when meta flag allows. |

Also commonly set by authoring/hydration (not in `observedAttributes`):

| Attribute | Description |
| --------- | ----------- |
| `data-analytics-id` | Human-readable CTA id for analytics (Studio). |
| `daa-ll` | Martech id: `{data-analytics-id}-{position}` within the card. |

**Properties and methods:**

| Name | Description |
| ---- | ----------- |
| `isCheckoutButton` | Always `true`. |
| `href` | Checkout URL from `data-href` after resolution. |
| `value` | Resolved offer(s) from WCS. |
| `options` | Options object used for the last render. |
| `onceSettled()` | Promise resolving to the element when resolved, or rejecting on failure. |
| `requestUpdate(force?)` | Re-runs offer resolution (`force` default `false`). |
| `marketSegment` / `customerSegment` | Derived from options or first offer. |
| `is3in1Modal` / `isOpen3in1Modal` | Whether `data-modal` is a 3-in-1 type and meta `mas-ff-3in1` is not `off`. |
| `checkoutActionHandler` | Optional function set when checkout action provides a custom handler (click does not navigate). |

Static helper: `CheckoutButton.createCheckoutButton(options, innerHTML)` creates a button when the commerce service exists.

## Events

| Event | Description |
| ----- | ----------- |
| `mas:resolved` | Dispatched when offers resolve and the checkout URL/action is applied. Bubbles. |
| `mas:failed` | Dispatched when offers cannot be resolved. `detail` may include error context. Bubbles. |

**CSS classes** toggled with state (`mas-element.js`): `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

**Note:** Older docs refer to `mas:pending`; the current `MasElement` implementation does **not** dispatch a `mas:pending` event—only the pending CSS class is applied during load.

## Usage example

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>
    Buy now
</button>
```

To intercept the default navigation, listen in the **capture** phase (the button navigates on click when `href` is set):

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>Buy now</button>
<script type="module">
    document.querySelector('button[is="checkout-button"]').addEventListener(
        'click',
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Checkout URL', e.target.href);
        },
        { capture: true },
    );
</script>
```

Multiple quantities (team bundle example):

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE"
    data-quantity="2,3"
>Buy now</button>
```

## Notes

- Implementation: `web-components/src/checkout-button.js`, shared logic in `checkout-mixin.js`.
- `data-checkout-workflow` appears in `observedAttributes` but workflow step is driven by `data-checkout-workflow-step` and service defaults; UCv3 workflow id is fixed as `UCv3` in `constants.js` (`CheckoutWorkflow`).
- Download and upgrade CTAs may add classes `download` or `upgrade` from the checkout action (`CLASS_NAME_DOWNLOAD`, `CLASS_NAME_UPGRADE`).
- Service must be active; without `mas-commerce-service`, `createCheckoutButton` returns `null`.
