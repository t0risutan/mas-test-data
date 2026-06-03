# checkout-link {#checkout-link}

## Introduction {#introduction}

This custom element renders a checkout link supporting most of the features documented at https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide.<br>

⚠️ Internal reference — cannot be verified by agent

Sometimes a checkout-link can be also referred as placeholder, as it can be used as an inline link resolving at runtime.<br>
The term placeholder will be deprecated and it is recommended to refer as **checkout-link custom element** going forward.

Behind the scene, it uses https://git.corp.adobe.com/PandoraUI/commerce-core to generate the checkout url.

⚠️ Internal reference — cannot be verified by agent

It requires an Offer Selector ID to retrieve the offer details from WCS. A [`mas-commerce-service`](mas-commerce-service.html) must be on the page before placeholders resolve.

See [MAS](mas.html#terminology) to learn more.

### Example

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >Buy now</a
>
```

## Attributes {#attributes}

| Attribute                     | Description                                                                                                                                                                                                                                  | Default Value | Required | Provider                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- | ----------------------- |
| `data-wcs-osi`                | Offer Selector ID, can be multiple, separeted by comma                                                                                                                                                                                       |               | `true`   | mas.js or consumer code |
| `data-checkout-workflow`      | Target checkout workflow for the generation of checkout urls                                                                                                                                                                                 | UCv3          | `false`  | mas.js                  |
| `data-checkout-workflow-step` | [workflow step](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide#UCv3LinkCreationGuide-RegularWorkflow) to land on the unified checkout page. Valid values: `segmentation`, `bundle`, `commitment`, `recommendation`, `email`, `payment`, `change-plan/team-upgrade/plans`, `change-plan/team-upgrade/payment`. | email         | `false`  | mas.js                  |
| `data-checkout-market-segment` | Override market segment (`ms`) in checkout URL generation when not inferred from the offer |               | `false`  | mas.js or consumer code |
| `data-extra-options`          | additional query params to append to the url, see: [Table of public query params](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide#UCv3LinkCreationGuide-Tableofpublicqueryparams) | {}            | `false`  | mas.js                  |
| `data-ims-country`            | the ims country to code of the user if signed in, overrides the locale country in the generated checkout url                                                                                                                                 |               | `false`  | mas.js or consumer code |
| `data-perpetual`              | whether this is a perpetual offer `true\|false`                                                                                                                                                                                              |               | `false`  | mas.js                  |
| `data-promotion-code`         | Flex promotion code, if applicable                                                                                                                                                                                                           |               | `false`  | mas.js                  |
| `data-quantity`               | Quantity of the offer to purchase                                                                                                                                                                                                            | 1             | `false`  | mas.js or consumer code |
| `data-entitlement`            | `entitlement` flag for client side interpretation                                                                                                                                                                                            | `false`       | `false`  | mas.js                  |
| `data-upgrade`                | `upgrade` flag for client side interpretation                                                                                                                                                                                                | `false`       | `false`  | mas.js                  |
| `data-modal`                  | Modal checkout type. When set to `twp`, `d2p`, or `crm` and `mas-ff-3in1` is not `off`, checkout uses the unified 3-in-1 modal flow. Other values set `href` to `#` when modal is `true`. | `false`       | `false`  | mas.js                  |
| `data-analytics-id`           | human-readable, non-translatable link id for analytics. Authored in Studio in Link Editor.                                                                                                                                                   | `false`       | `false`  | mas.js                  |
| `daa-ll`                      | martech-compatible link id for analytics. Format: '${data-analytics-id}-${#}', where # is the position of the link within a card. E.g. : see-terms-1, buy-now-2                                                                              | `false`       | `false`  | mas.js                  |

Wiki links for UCv3 workflow steps and query params: https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide

⚠️ Internal reference — cannot be verified by agent

### Examples {#examples}

#### Custom Workflow Step

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-checkout-workflow-step="recommendation"
    >Buy now</a
>
```

#### Multiple Quantities

Two photoshop and three acrobat pro single apps (TEAMS):

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE"
    data-quantity="2,3"
    >Buy now</a
>
```

#### Custom query params

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-extra-options='{"promoid":"promo12345","mv":1,"mv2":2}'
    >Buy now</a
>
```

#### IMS Country

```html {.demo}
<a
    href="#"
    is="checkout-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-ims-country="JP"
    >Buy now</a
>
```

## Properties {#properties}

| Property         | Description                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isCheckoutLink` | on checkout link elements, it will return `true`                                                                                                                |
| `onceSettled`    | promise that resolves when the custom-element either resolves or fails to resolve the offer                                                                     |
| `options`        | JSON object with the complete set of properties used to resolve the offer                                                                                       |
| `value`          | The actual offer that is used to render the checkout link. In some cases WCS can return multiple offers but only one will be picked to render for a single app. |
| `href`           | Resolved checkout URL on the anchor. Default click uses native navigation unless `checkoutActionHandler` is set.                                                 |
| `marketSegment`  | Resolved market segment from options or offer.                                                                                                                    |
| `customerSegment`| Resolved customer segment from options or offer.                                                                                                                  |
| `is3in1Modal`    | `true` when `data-modal` is `twp`, `d2p`, or `crm`.                                                                                                             |
| `isOpen3in1Modal`| `true` when `is3in1Modal` and meta `mas-ff-3in1` is not `off`.                                                                                                 |

### Example

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
        document.getElementById('coOptions').innerHTML = JSON.stringify(
            target.options,
            null,
            '\t',
        );
    });
</script>
```

#### value property

```json {#coValue}

```

#### options property

```json {#coOptions}

```

## Methods {#methods}

| Property                       | Description                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `requestUpdate(true \| false)` | Causes a re-render using the actual options, force = false by default, meaning if no change is found will skip |

## Events {#events}

| Event          | Description                                        |
| -------------- | -------------------------------------------------- |
| `mas:resolved` | fires when the offer is successfully resolved      |
| `mas:failed`   | fires when the offer could not be found or fetched |

<br>

While loading, the element uses the `placeholder-pending` CSS class. On success or failure, `placeholder-resolved` or `placeholder-failed` is applied respectively. A `mas:pending` event is **not** dispatched by the current implementation.

### Example

```html {.demo}
<div id="eventsDemo">
    <a
        is="checkout-link"
        data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
        >Buy now (click me)</a
    >
    <br />
    <a
        is="checkout-link"
        data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
        ><span style="pointer-events: none;"
            >Span + <strong>Strong + Buy now</strong></span
        ></a
    >
</div>
<button id="btnRefresh">Refresh</button>
<script type="module">
    const log = document.getElementById('log');
    const logger = (...messages) =>
        (log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`);
    const eventsDemo = document.getElementById('eventsDemo');
    eventsDemo.addEventListener('mas:resolved', (e) =>
        logger('checkout-link resolved'),
    );
    eventsDemo.addEventListener('mas:failed', () =>
        logger('checkout-link failed'),
    );
    eventsDemo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.isCheckoutLink) {
            logger('checkout link is clicked: ', e.target.href);
        } else {
            logger('element clicked: ', e.target);
        }
    });
    document.getElementById('btnRefresh').addEventListener('click', () => {
        [...eventsDemo.querySelectorAll('a')].forEach((a) =>
            a.requestUpdate(true),
        );
    });
</script>
```

#### Logs

```html {#log}

```
