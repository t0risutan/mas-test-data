# checkout-link

## checkout-link

### What it does

A customized built-in element (`<a is="checkout-link">`) that resolves WCS offer selector IDs and sets the anchor `href` to the generated UCv3 checkout URL. Historically called a “placeholder”; prefer **checkout-link** in new documentation.

Unlike `checkout-button`, the link does not call `window.location.href` in its default `clickHandler` — navigation uses normal anchor behavior when `href` is set. Custom behavior is available via `registerCheckoutAction` on `mas-commerce-service` (handler or `#` href).

Shares implementation with `checkout-button` via `checkout-mixin.js`.

### Attributes / Props

Same observed checkout attributes as `checkout-button` (see [checkout-button](checkout-button.html#attributes--props)).

URL storage differs: `setCheckoutUrl(value)` sets the native `href` attribute (not `data-href`).

| Property / method | Description |
| --- | --- |
| `isCheckoutLink` | Always `true`. |
| `href` | Native anchor href after resolution. |
| `value`, `options`, `onceSettled()`, `requestUpdate()`, `updateOptions()` | Same as checkout-button. |
| `CheckoutLink.createCheckoutLink(options, innerHTML)` | Factory; returns `null` without service. |

State CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

### Events

| Event | When |
| --- | --- |
| `mas:resolved` | Checkout URL or custom handler applied successfully |
| `mas:failed` | Resolution failed |

No `mas:pending` event is dispatched; use `placeholder-pending` class for loading UI.

### Usage example

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
>Buy now</a>
```

Multiple OSIs with quantities:

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE"
    data-quantity="2,3"
>Buy now</a>
```

Event logging (bubble phase; use `preventDefault` on the anchor click if needed):

```html {.demo}
<div id="eventsDemo">
    <a
        is="checkout-link"
        data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now (click me)</a>
</div>
<script type="module">
    const eventsDemo = document.getElementById('eventsDemo');
    eventsDemo.addEventListener('mas:resolved', () => console.log('resolved'));
    eventsDemo.addEventListener('mas:failed', () => console.log('failed'));
    eventsDemo.addEventListener('click', (e) => {
        if (e.target.isCheckoutLink) console.log(e.target.href);
    });
</script>
```

### Notes

- UCv3 link guide: [UCv3 Link Creation Guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide) (corp network).
- `data-modal="true"` (boolean string) sets href to `#` when building default URL (see `checkout-mixin.js` `renderOffers`).
- 3-in-1 modal types (`twp`, `d2p`, `crm`) interact with `mas-ff-3in1` the same way as checkout-button.
- Inner content wrapped by `createCheckoutLink` uses `pointer-events: none` on an inner `<span>` so clicks hit the anchor.
