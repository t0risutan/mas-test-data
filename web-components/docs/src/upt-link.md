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

| Property    | Description                                  |
| ----------- | -------------------------------------------- |
| `isUptLink` | On UPT link elements, it will return `true`. |

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

## Events {#events}

| Event | Description |
| ----- | ----------- |
| `mas:resolved` | Promo terms URL set on `href`. Bubbles. |
| `mas:failed` | Missing OSI or offer resolution failed. Bubbles. |

CSS classes: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`. (`mas:pending` is not dispatched by `MasElement`.)

Logs an error if `data-wcs-osi` is missing or the offer cannot be resolved.
