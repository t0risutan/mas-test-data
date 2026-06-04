# inline-price {#inline-price}

## Introduction {#introduction}

This custom element renders an inline price supporting various display options and configurations. It retrieves pricing information from WCS based on the provided Offer Selector ID.

See [MAS](mas.html#terminology) to learn more.

### Example

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

## Attributes {#attributes}

| Attribute                  | Description                                                                                             | Default Value | Required |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `data-wcs-osi`             | Offer Selector ID. Supports multiple comma-separated OSIs for soft bundles (prices will be summed).     |               | `true`   |
| `data-display-old-price`   | Whether to display the old price (in case of flex or legacy promo offer)                                | `true`        | `false`  |
| `data-display-per-unit`    | Whether to display the price per unit (e.g:, per license)                                               | `false`       | `false`  |
| `data-display-recurrence`  | Whether to display the recurrence information (e.g:, /mo)                                               | `true`        | `false`  |
| `data-display-tax`         | Whether to display tax information                                                                      | `false`       | `false`  |
| `data-display-plan-type`   | Whether to display plan type text (e.g. Annual, paid monthly)                                           | `false`       | `false`  |
| `data-display-annual`    | When [mas-ff-annual-price](feature-flags.html#mas-ff-annual-price) is on, show annual price for ABM offers unless set to `false` | (flag-driven) | `false`  |
| `data-perpetual`           | Whether this is a perpetual offer                                                                       | `false`       | `false`  |
| `data-promotion-code`      | Flex promotion code to apply, if applicable                                                             |               | `false`  |
| `data-force-tax-exclusive` | Whether to force tax exclusive price, if `false`, it's automatic, driven by country service             | `false`       | `false`  |
| `data-template`            | Price template (see table below)                                                                        | price         | `false`  |
| `data-quantity`            | Quantity of the offer, used with volume promotion codes to display either regular or promotional price. | 1             | `false`  |
| `data-alternative-price`   | When paired strikethrough prices are present in the parent, adds screen-reader “Alternatively at” labeling on the non-strikethrough price | `false`       | `false`  |

### data-template values

| Name                 | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `price`              | The default price of the offer                                  |
| `discount`           | Displays the promo price in percentage, e.g:, 19%               |
| `optical`            | For **paid upfront offers** (PUF), renders the monthly price    |
| `annual`             | For **annual, billed monthly** offers, renders the yearly price |
| `strikethrough`      | Render the price as strikethrough                               |
| `promo-strikethrough`| Promo price with strikethrough styling                          |
| `legal`              | Legal price line (used on cards; may set `displayDot` from variant layout) |

With exactly two comma-separated OSIs and `data-template="discount"`, the percentage is computed from the first offer against the second offer's price as reference.

### Examples {#examples}

#### Soft Bundle (Multiple OSIs)

When multiple Offer Selector IDs are provided (comma-separated), the prices are summed together. This is useful for displaying the total price of a soft bundle containing multiple products.

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M,Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
></span>
```

::: warning
**Note**: All OSIs in a soft bundle must resolve successfully. If any OSI fails to resolve, the entire price will fail to render. The `data-quantity` attribute is not supported for soft bundles.
:::

#### Display Per Unit Price with Tax

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
```

#### template=optical

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
vs
<span
    is="inline-price"
    data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"
    data-display-per-unit="true"
    data-display-tax="true"
    data-template="optical"
></span>
```

#### template=annual

```html {.demo}
<span
    is="inline-price"
    data-wcs-osi="Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
vs
<span
    is="inline-price"
    data-wcs-osi="Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
    data-display-per-unit="true"
    data-display-tax="true"
    data-template="annual"
></span>
```

## Properties {#properties}

| Property        | Description                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| `isInlinePrice` | on inline price elements, it will return `true`                                              |
| `isFailed`      | `true` when the element is in failed state                                                   |
| `onceSettled()` | Promise that resolves when the custom-element either resolves or fails to retrieve the price |
| `options`       | JSON object with the complete set of properties used to resolve the price                    |
| `value`         | The actual price data that is used to render the inline price.                               |

### Example

```html {.demo}
<span
    id="ip1"
    is="inline-price"
    data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
></span>
<script type="module">
    document
        .getElementById('ip1')
        .onceSettled()
        .then((el) => {
            document.getElementById('ipValue').innerHTML = JSON.stringify(
                el.value,
                null,
                '\t',
            );
            document.getElementById('ipOptions').innerHTML = JSON.stringify(
                el.options,
                null,
                '\t',
            );
        });
</script>
```

##### value property

```json {#ipValue}

```

##### options property

```json {#ipOptions}

```

## Static factory {#static-factory}

`InlinePrice.createInlinePrice(options)` returns a configured `<span is="inline-price">` when `mas-commerce-service` is active, or `null` otherwise.

When [mas-ff-defaults](feature-flags.html#mas-ff-defaults) is enabled (on the service or via options inside a `merch-card` with an `aem-fragment`), unset `data-display-per-unit`, `data-display-tax`, and `data-force-tax-exclusive` are resolved from geo and customer segment via `resolvePriceTaxFlags`.

## Methods {#methods}

| Method                         | Description                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `requestUpdate(true \| false)` | Causes a re-render using the actual options, force = false by default, meaning if no change is found will skip |

Clicks on child price markup are re-dispatched on the `inline-price` element so parent card listeners receive price clicks.

## Events {#events}

| Event          | Description                                        |
| -------------- | -------------------------------------------------- |
| `mas:resolved` | Fires when the price is successfully resolved      |
| `mas:failed`   | Fires when the price could not be found or fetched |

There is no `mas:pending` event in the current implementation. Loading state is reflected with CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

### Example

```html {.demo}
<span
    id="ip2"
    is="inline-price"
    data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
></span>
<button id="btnRefresh">Refresh</button>
<script type="module">
    const log = document.getElementById('log');
    const logger = (...messages) =>
        (log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`);
    const span = document.getElementById('ip2');
    span.addEventListener('mas:resolved', () =>
        logger('inline-price resolved'),
    );
    span.addEventListener('mas:failed', () => logger('inline-price failed'));
    document.getElementById('btnRefresh').addEventListener('click', () => {
        span.requestUpdate(true);
    });
</script>
```

#### Logs

```html {#log}

```
