# checkout-button

## checkout-button

### What it does

`checkout-button` is a customized built-in element (`<button is="checkout-button">`) that resolves one or more WCS Offer Selector IDs (OSIs), builds a UCv3 checkout URL via commerce-core, and navigates to it on click.

It extends `HTMLButtonElement` through `CheckoutMixin` and shares the same offer-resolution pipeline as `checkout-link`. The resolved URL is stored on the element as the `data-href` attribute and exposed through the `href` getter.

Unlike `checkout-link`, the default click handler calls `window.location.href`. To intercept clicks, register a listener with `{ capture: true }` before the element's own handler runs.

Requires `mas-commerce-service` on the page. See [MAS](mas.html#terminology) for terminology.

### Attributes / Props

| Attribute / property | Description | Default | Required |
| --- | --- | --- | --- |
| `data-wcs-osi` | Offer Selector ID. Comma-separated for multi-offer checkout. | — | yes |
| `data-checkout-workflow` | Target checkout workflow. | `UCv3` | no |
| `data-checkout-workflow-step` | UCv3 workflow step (for example `email`, `recommendation`). | `email` | no |
| `data-extra-options` | JSON object of extra query params appended to the checkout URL. | `{}` | no |
| `data-ims-country` | Signed-in user's IMS country code. Overrides locale country in the checkout URL. | — | no |
| `data-perpetual` | Whether the offer is perpetual (`true` / `false`). | — | no |
| `data-promotion-code` | Flex promotion code, if applicable. | — | no |
| `data-quantity` | Purchase quantity. Comma-separated when multiple OSIs are set. | `1` | no |
| `data-entitlement` | Client-side entitlement flag (`true` / `false`). | `false` | no |
| `data-upgrade` | Client-side upgrade flag (`true` / `false`). | `false` | no |
| `data-modal` | Modal type for 3-in-1 checkout. Recognized values: `twp`, `d2p`, `crm`. When set and `mas-ff-3in1` is not `off`, checkout opens in the unified modal flow and the href becomes `#`. | — | no |
| `data-analytics-id` | Human-readable analytics id authored in Studio. | — | no |
| `daa-ll` | Martech analytics id. Format: `${data-analytics-id}-${position}`. | — | no |
| `isCheckoutButton` (property) | Returns `true` on checkout-button elements. | — | — |
| `href` (property) | Resolved checkout URL from `data-href`. Empty until the offer resolves. | — | — |
| `value` (property) | Resolved offer object(s) from WCS. | — | — |
| `options` (property) | Full option set used to resolve the offer. | — | — |
| `onceSettled()` (method) | Promise resolving when the element settles to resolved or failed. | — | — |
| `requestUpdate(force?)` (method) | Re-renders from current attributes. Skips when unchanged unless `force` is `true`. | — | — |
| `CheckoutButton.createCheckoutButton(options, innerHTML)` (static) | Programmatically creates a checkout button. Returns `null` if `mas-commerce-service` is missing. | — | — |

### Events

| Event | Description |
| --- | --- |
| `mas:resolved` | Fires when the offer resolves and the checkout URL is set. `detail` contains error context on failure paths handled by `MasElement`. |
| `mas:failed` | Fires when the offer cannot be fetched or selected. |

While resolving, the element toggles CSS classes `placeholder-pending`, `placeholder-resolved`, and `placeholder-failed`. **`mas:pending` is documented historically but is not dispatched by the current implementation** — use the pending CSS class or `onceSettled()` instead.

### Usage example

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>
    Buy now
</button>
```

Multiple quantities across two OSIs:

```html {.demo}
<button
    is="checkout-button"
    data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE"
    data-quantity="2,3"
>
    Buy now
</button>
```

Intercepting clicks (capture required):

```html {.demo}
<div id="eventsDemo">
    <button
        is="checkout-button"
        data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now (click me)</button>
</div>
<script type="module">
    const log = document.getElementById('log');
    const logger = (...messages) =>
        (log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`);
    const eventsDemo = document.getElementById('eventsDemo');
    eventsDemo.addEventListener('mas:resolved', () =>
        logger('checkout-button resolved'),
    );
    eventsDemo.addEventListener('mas:failed', () =>
        logger('checkout-button failed'),
    );
    eventsDemo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.isCheckoutButton) {
            logger('checkout button clicked:', e.target.href);
        }
    }, { capture: true });
</script>
```

#### Logs

```html {#log}

```

### Notes

- Checkout URL generation uses [commerce-core](https://git.corp.adobe.com/PandoraUI/commerce-core). See the [UCv3 button creation guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+button+Creation+Guide) for supported query params.
- When `registerCheckoutAction()` on `mas-commerce-service` returns a custom handler, navigation is delegated to that handler instead of the default redirect.
- `data-modal` values `twp`, `d2p`, and `crm` participate in the 3-in-1 modal flow when the page meta tag `<meta name="mas-ff-3in1" content="off">` is **not** present.
- Safari requires the customized built-in elements polyfill before `mas.js`. See [mas.js](mas.js.html).
