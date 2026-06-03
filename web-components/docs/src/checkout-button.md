# checkout-button

## checkout-button

### What it does

A customized built-in element (`<button is="checkout-button">`) that resolves one or more WCS offer selector IDs (OSIs), builds a UCv3 checkout URL via commerce-core, and stores it on `data-href`. On click, it navigates to that URL unless a custom checkout action handler is registered on `mas-commerce-service`.

The element extends `HTMLButtonElement` and shares checkout logic with `checkout-link` through `checkout-mixin.js`. It requires `mas-commerce-service` to be on the page before it can resolve offers.

Use `{ capture: true }` on click listeners if you need to intercept navigation before the button’s default handler runs.

### Attributes / Props

Observed `data-*` attributes (from `checkout-mixin.js`):

| Attribute | Maps to option | Description |
| --- | --- | --- |
| `data-wcs-osi` | `wcsOsi` | Comma-separated offer selector IDs. Required for resolution. |
| `data-checkout-workflow` | (in `rest`) | Checkout workflow identifier. Default workflow is `UCv3` at service level. |
| `data-checkout-workflow-step` | `checkoutWorkflowStep` | UCv3 workflow step (e.g. `email`, `recommendation`). Default from service settings. |
| `data-extra-options` | `extraOptions` | JSON string of extra query parameters merged into checkout URL building. |
| `data-ims-country` | (via `dataset.imsCountry`) | Signed-in IMS country; overrides locale country when set. Populated from service if omitted. |
| `data-perpetual` | `perpetual` | `true` / `false` — perpetual offer flag. |
| `data-promotion-code` | `promotionCode` | Flex promotion code; removed automatically if promotion is not active. |
| `data-quantity` | `quantity` | Comma-separated quantities per OSI (e.g. `2,3`). Default `1`. |
| `data-entitlement` | `entitlement` | Client-side entitlement flag (`true` / `false`). |
| `data-upgrade` | `upgrade` | Client-side upgrade flag (`true` / `false`). |
| `data-modal` | `modal` | Modal type for 3-in-1 flow: `twp`, `d2p`, or `crm` (see `MODAL_TYPE_3_IN_1` in `constants.js`). When modal resolves and 3-in-1 is enabled, href is set to `#`. |
| `data-template` | — | Listed in `observedAttributes`; not used in checkout `render()` in source. |

Additional attributes documented for authoring/analytics (set via `createCheckoutElement` / hydration, not in `observedAttributes`):

| Attribute | Description |
| --- | --- |
| `data-analytics-id` | Human-readable CTA id for analytics. |
| `daa-ll` | Martech id format `${data-analytics-id}-${position}`. |

**Properties and methods** (from `checkout-button.js`, `checkout-mixin.js`, `mas-element.js`):

| Name | Description |
| --- | --- |
| `isCheckoutButton` | Always `true` on this element. |
| `href` | Getter for `data-href` (checkout URL after resolution). |
| `value` | Resolved offer(s) after `mas:resolved`. |
| `options` | Options object used for the last successful render. |
| `marketSegment` / `customerSegment` | Derived from options or resolved offer (`ms`/`cs` shorthand supported). |
| `is3in1Modal` / `isOpen3in1Modal` | Whether `data-modal` is a 3-in-1 type and whether `mas-ff-3in1` allows it. |
| `onceSettled()` | Promise resolving to the element when resolved or rejecting on failure. |
| `requestUpdate(force?)` | Re-runs `render()`; skips if no changes unless `force` is true. |
| `updateOptions(options)` | Updates dataset via `collectCheckoutOptions` and triggers update. |
| `CheckoutButton.createCheckoutButton(options, innerHTML)` | Factory; returns `null` if no service. Wraps innerHTML in a non-interactive `<span>`. |

**CSS state classes** (from `mas-element.js`): `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

**Checkout action classes** (from `checkout-mixin.js`): `download`, `upgrade` may be added by a custom `registerCheckoutAction` handler.

### Events

| Event | When | `detail` |
| --- | --- | --- |
| `mas:resolved` | Offer(s) resolved and checkout URL or handler applied | Error object shape if `MasError`; otherwise undefined |
| `mas:failed` | Resolution failed (no offers, WCS error, etc.) | Error / context from `MasError` when applicable |

There is **no `mas:pending` event** in the implementation. Pending state is indicated only by the `placeholder-pending` CSS class while `render()` is in flight.

`mas-commerce-service` dispatches `wcms:commerce:ready` when the service activates (not on the button itself).

### Usage example

Basic button:

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>
    Buy now
</button>
```

Intercept click before navigation (capture phase):

```html {.demo}
<div id="eventsDemo">
    <button
        is="checkout-button"
        data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now (click me)</button>
</div>
<script type="module">
    const eventsDemo = document.getElementById('eventsDemo');
    eventsDemo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.isCheckoutButton) {
            console.log('checkout URL:', e.target.href);
        }
    }, { capture: true });
</script>
```

Read resolved offer and options:

```html {.demo}
<button
    id="co1"
    is="checkout-button"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-ims-country="CA"
>Buy now</button>
<script type="module">
    onceEvent(document.getElementById('co1'), 'mas:resolved', ({ target }) => {
        console.log(target.value, target.options);
    });
</script>
```

Enablement requires `mas-commerce-service` on the page (see [mas-commerce-service](mas-commerce-service.html)).

### Notes

- UCv3 authoring guides: [button creation guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+button+Creation+Guide) (corp network).
- Terminology for OSI/WCS: [MAS home](mas.html#terminology).
- Safari requires the customized built-in elements polyfill before `mas.js` (see [mas.js](mas.js.html)).
- When `registerCheckoutAction` returns a `handler`, the button sets href to `#` and runs the handler on click instead of navigating.
- Multiple OSIs: quantities align by position in `data-quantity`; checkout URL building uses the first quantity for multi-item carts (see `checkout.js`).
