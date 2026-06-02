# checkout-link

## checkout-link

### What it does

`checkout-link` is a customized built-in element (`<a is="checkout-link">`) that resolves WCS Offer Selector IDs and sets the anchor `href` to a generated UCv3 checkout URL.

It extends `HTMLAnchorElement` through `CheckoutMixin`. The element is sometimes called a "placeholder" in legacy content; prefer **checkout-link** in new documentation.

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
| `data-modal` | Modal type for 3-in-1 checkout. Recognized values: `twp`, `d2p`, `crm`. When active, href is set to `#` and modal checkout is used. | — | no |
| `data-analytics-id` | Human-readable analytics id authored in Studio. | — | no |
| `daa-ll` | Martech analytics id. Format: `${data-analytics-id}-${position}`. | — | no |
| `isCheckoutLink` (property) | Returns `true` on checkout-link elements. | — | — |
| `value` (property) | Resolved offer object(s) from WCS. | — | — |
| `options` (property) | Full option set used to resolve the offer. | — | — |
| `onceSettled()` (method) | Promise resolving when the element settles to resolved or failed. | — | — |
| `requestUpdate(force?)` (method) | Re-renders from current attributes. Skips when unchanged unless `force` is `true`. | — | — |
| `CheckoutLink.createCheckoutLink(options, innerHTML)` (static) | Programmatically creates a checkout link. Returns `null` if `mas-commerce-service` is missing. | — | — |

### Events

| Event | Description |
| --- | --- |
| `mas:resolved` | Fires when the offer resolves and `href` is set. |
| `mas:failed` | Fires when the offer cannot be fetched or selected. |

CSS classes `placeholder-pending`, `placeholder-resolved`, and `placeholder-failed` reflect state. **`mas:pending` is not dispatched by the current implementation.**

### Usage example

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now</a
>
```

Custom workflow step:

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-checkout-workflow-step="recommendation"
    >Buy now</a
>
```

Listening for resolution:

```html {.demo}
<a
    id="co1"
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-ims-country="CA"
    >Buy now</a
>
<script type="module">
    onceEvent(document.getElementById('co1'), 'mas:resolved', ({ target }) => {
        document.getElementById('coValue').innerHTML = JSON.stringify(
            target.value,
            null,
            '\t',
        );
    });
</script>
```

#### value property

```json {#coValue}

```

### Notes

- Unlike `checkout-button`, the default click handler does not force navigation; the browser follows the resolved `href` unless a custom `checkoutActionHandler` is registered via `mas-commerce-service.registerCheckoutAction()`.
- `data-modal` values `twp`, `d2p`, and `crm` use the 3-in-1 modal when `<meta name="mas-ff-3in1" content="off">` is not set.
- Checkout URL generation uses [commerce-core](https://git.corp.adobe.com/PandoraUI/commerce-core). See the [UCv3 link creation guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide).
- Inactive promotion codes are stripped automatically before URL generation.
