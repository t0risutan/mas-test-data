# upt-link {#upt-link}

## Introduction {#introduction}

This custom element renders a universal promo terms link.
It extends `HTMLAnchorElement` and will automatically generate the correct `href` based on the provided attributes.

The link will point to the promo terms page with offer information resolved from WCS.

See [MAS](mas.html#terminology) to learn more.

### Example

```html {.demo}
<a
    href="#"
    is="upt-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-promotion-code="PROMO123"
    >See terms</a
>
```

## Attributes {#attributes}

| Attribute             | Description                                                                                                   | Default Value | Required | Provider                |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------- | -------- | ----------------------- |
| `data-wcs-osi`        | Offer Selector ID. Can be only one.                                                                           |               | `true`   | mas.js or consumer code |
| `data-promotion-code` | Flex promotion code, if applicable.                                                                           |               | `false`  | mas.js or consumer code |
| `data-ims-country`    | The IMS country to code of the user if signed in, overrides the locale country in the generated checkout url. |               | `false`  | mas.js or consumer code |

## Properties {#properties}

| Property        | Description                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| `isUptLink`     | On UPT link elements, it will return `true`.                                                 |
| `onceSettled()` | Promise that resolves when the link URL is set, or rejects if the offer cannot be resolved.  |
| `href`          | Resolved promo terms URL on `www.adobe.com` or `www.stage.adobe.com` after `mas:resolved`.   |

### Example

```html {.demo}
<a
    id="upt1"
    href="#"
    is="upt-link"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    >See terms</a
>
```

## Methods {#methods}

| Method                         | Description                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `requestUpdate(true \| false)` | Causes a re-render using the actual options, force = false by default, meaning if no change is found will skip |

## Events {#events}

| Event          | Description                                        |
| -------------- | -------------------------------------------------- |
| `mas:resolved` | Fires when the promo terms URL is set on the link  |
| `mas:failed`   | Fires when the offer could not be found or fetched |

There is no `mas:pending` event in the current implementation. Loading state is reflected with CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

If `data-wcs-osi` is missing at render time, the element logs an error and does not update `href`.
