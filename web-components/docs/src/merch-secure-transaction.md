<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/theme.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/tooltip.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/overlay.js"></script>
<script type="module" src="../dist/merch-secure-transaction.js"></script>

# merch-secure-transaction {#merch-secure-transaction}

## Introduction {#introduction}

`merch-secure-transaction` is a small Spectrum label for checkout reassurance copy (for example “Secure transaction”). It optionally prefixes a lock glyph and wraps the label in an `overlay-trigger` + `sp-tooltip` when `tooltip` is set.

The source file notes that this element **must not** be used inside spectrum-free components such as [merch-card](merch-card.html). Plan, product, and compare cards instead render secure copy from the `secure-label` attribute as a `.secure-transaction-label` span inside variant layouts — see [Secure transaction label on merch-card](merch-card.html#secure-label).

`merch-secure-transaction` is built and exported as a standalone bundle. It is **not** registered by [mas.js](mas.js.html) and is not referenced elsewhere in the M@S codebase today. Use it on Spectrum-enabled pages when you need a reusable secure-transaction label with an optional tooltip outside `merch-card` layouts.

See also: [merch-card — `secure-label`](merch-card.html#secure-label), [Plans Gallery](plans.html), [Product Gallery](product.html).

## Example {#example}

Label with lock icon. Set `--secure-icon` on an ancestor (or load M@S global styles) so the `#label.icon::before` glyph resolves. The default token matches `global.css.js`.

```html {.demo .light}
<div
  style="--secure-icon: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E&quot;);"
>
  <merch-secure-transaction label="Secure transaction"></merch-secure-transaction>
</div>
```

Label with tooltip. Requires Spectrum `overlay-trigger` and `sp-tooltip` on the page (see script imports above). Hover or focus the label to open the tooltip (`placement="top-start"`, `offset="4"`, `delayed` on `sp-tooltip`).

```html {.demo .light}
<div
  style="--secure-icon: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E&quot;);"
>
  <merch-secure-transaction
    label="Secure transaction"
    tooltip="Your payment information is encrypted."
  ></merch-secure-transaction>
</div>
```

Text only (no lock icon). Set `icon="false"`.

```html {.demo .light}
<merch-secure-transaction label="Secure checkout" icon="false"></merch-secure-transaction>
```

## On merch-card {#on-merch-card}

`merch-card` does **not** use `merch-secure-transaction`. When `secure-label` is set, `VariantLayout.secureLabel` renders a plain `<span class="secure-transaction-label">` above footer CTAs (or in the `secure-transaction-label` slot on mini-compare variants). The lock glyph comes from `.secure-transaction-label::before` in `merch-card.css.js`, not from this element.

During hydration, `processSecureLabel()` sets `secure-label` when **both** the variant mapping includes `secureLabel: true` and the fragment `settings.secureLabel` string is present.

```html {.demo .light}
<merch-card variant="plans" secure-label="Secure transaction">
  <h4 slot="heading-xs">Acrobat Pro</h4>
  <div slot="body-xs"><p>Access advanced PDF tools.</p></div>
  <div slot="footer">
    <a href="#" class="con-button blue">Buy now</a>
  </div>
</merch-card>
```

Use `merch-secure-transaction` for standalone Spectrum pages. Use `secure-label` on `merch-card` for standard commerce card layouts.

## Attributes {#attributes}

| Attribute | Property | Description | Default | Reflects |
| --- | --- | --- | --- | --- |
| `label` | `labelText` | Visible label text rendered inside `#label`. | `''` | yes |
| `icon` | `showIcon` | Boolean. When true, `#label` gets class `icon` and shows the lock glyph via `--secure-icon`. | `true` | yes |
| `tooltip` | `tooltipText` | When non-empty, wraps `#label` in `overlay-trigger` with an `sp-tooltip` in the `hover-content` slot. When empty, renders `#label` only. | `''` | yes |

## Render behavior {#render-behavior}

| Condition | Output |
| --- | --- |
| `tooltip` empty | `#label` div only (inline-flex, 12px / 15px type). |
| `tooltip` set | `overlay-trigger` → `#label` (`slot="trigger"`) + `sp-tooltip` (`slot="hover-content"`, `delayed`). |
| `icon` true (default) | `#label` has class `icon`; `::before` uses `var(--secure-icon)`. |
| `icon` false | `#label` has no `icon` class; no lock glyph. |

The component does not define slots, events, or public methods.

## CSS custom properties {#css-custom-properties}

| Property | Used by | Purpose |
| --- | --- | --- |
| `--secure-icon` | `#label.icon::before` | Background image for the lock glyph. Defined in `global.css.js` for M@S pages; set on an ancestor when using the standalone bundle. |
| `--consonant-merch-spacing-xxxs` | `#label` gap | Spacing between lock icon and label text. |

Label typography is fixed at `font-size: 12px` and `line-height: 15px` in the component stylesheet.

## Spectrum dependencies {#spectrum-dependencies}

When `tooltip` is set, the render tree expects these custom elements to be registered on the page:

| Element | Role |
| --- | --- |
| `overlay-trigger` | Positions the hover/focus overlay (`placement="top-start"`, `offset="4"`). |
| `sp-tooltip` | Tooltip content (`slot="hover-content"`, `delayed`). |

Import Spectrum Web Components overlay and tooltip modules before loading `merch-secure-transaction.js`, as in the script block at the top of this page.

## Bundle {#bundle}

`merch-secure-transaction` is **not** registered by [mas.js](mas.js.html). Load the standalone bundle:

```html
<script type="module" src="../dist/merch-secure-transaction.js"></script>
```

Also import Spectrum `overlay-trigger` and `sp-tooltip` when using the `tooltip` attribute.
