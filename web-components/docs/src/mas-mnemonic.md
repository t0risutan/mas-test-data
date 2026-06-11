<script type="module" src="../dist/mas.js"></script>

# mas-mnemonic {#mas-mnemonic}

## Introduction {#introduction}

`mas-mnemonic` is an inline info icon with a tooltip. It wraps a trigger (default slot text, a slotted `merch-icon`, or an icon from the `src` attribute) and shows explanatory copy on hover, focus, or tap.

Primary placements:

1. **Inline in card copy** — inside `body-xs`, `body-s`, `heading-xs`, or `price` slots on [Express](express.html) and [Fries](fries.html) cards. AEM fragment HTML may include `<mas-mnemonic>` elements; `processMnemonicElements()` in `hydrate.js` lazy-loads the component when such markup is present.
2. **Child of [merch-icon](merch-icon.html)** — when Spectrum Web Components are absent, `merch-icon` converts legacy `sp-tooltip` / `overlay-trigger` light-DOM markup into a `mas-mnemonic` wrapper on connect.
3. **Price footnotes** — asterisk or info icons beside [inline-price](inline-price.html) in Express price slots.

The host uses `display: contents`, so the element does not create its own layout box.

Registered when [mas.js](mas.js.html) loads. Also lazy-imported by `hydrate.js` and `merch-icon.js` when mnemonics appear in fragment HTML or tooltip fallback runs.

See also: [merch-icon](merch-icon.html), [Express Gallery](express.html), [Fries Gallery](fries.html), [merch-whats-included](merch-whats-included.html).

## Example {#example}

Text trigger with a CSS fallback tooltip. Hover or focus the trigger to show the tooltip; on touch devices, tap toggles visibility.

```html {.demo .light}
<p>
  100GB cloud storage
  <mas-mnemonic content="Sync across all your devices" placement="top">ⓘ</mas-mnemonic>
</p>
```

Icon trigger using a slotted `merch-icon`. Tooltip copy comes from the `content` attribute.

```html {.demo .light}
<p>
  Get 20+ creative apps
  <mas-mnemonic content="Including Photoshop, Illustrator, and more" placement="right">
    <merch-icon
      src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
      size="xs"
    ></merch-icon>
  </mas-mnemonic>
</p>
```

Icon-only trigger via `src` and `tooltip-text` (Studio-compatible attribute names). No default-slot content is required.

```html {.demo .light}
<h3>
  Express for Business
  <mas-mnemonic
    src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
    size="s"
    tooltip-text="Perfect for teams and enterprises"
    tooltip-placement="bottom"
  ></mas-mnemonic>
</h3>
```

## Tooltip modes {#tooltip-modes}

At render time, `hasSpectrumTooltip()` checks whether **all** of the following are true:

| Requirement | Check |
| --- | --- |
| `sp-tooltip` registered | `customElements.get('sp-tooltip')` |
| `overlay-trigger` registered | `customElements.get('overlay-trigger')` |
| `sp-theme` on page | `document.querySelector('sp-theme')` |

When all three pass, the component renders Spectrum `overlay-trigger` + `sp-tooltip` with `unsafeHTML` content and the `variant` attribute (default `info`).

Otherwise it renders a CSS fallback tooltip (`.css-tooltip`):

| Input | Behavior |
| --- | --- |
| Mouse / pen | `pointerenter` shows tooltip; `pointerleave` hides it |
| Touch | `pointerenter` does not open; `click` toggles via `handleTap()` |
| Keyboard | `:focus-visible` shows tooltip |
| Outside click | `mousedown` on `window` hides the active tooltip |

Only one tooltip is open at a time. `MasMnemonic.activeTooltip` tracks the current instance; showing a new tooltip dismisses the previous one.

## Smart placement {#smart-placement}

Set `smart-placement` to enable viewport-aware JS positioning. The tooltip body uses `position: fixed` with a computed `top` / `left` and an inner `.css-tooltip-tip` arrow span instead of the CSS-only `::after` arrow.

`connectedCallback()` auto-enables `smartPlacement` when the element is inside `merch-card[variant="fries"]` and `smart-placement` was not set explicitly. This keeps tooltips on screen in the compact fries card layout.

Placement fallbacks flip the tooltip when the preferred side would overflow the viewport (`top` ↔ `bottom`, `left` ↔ `right`).

## On merch-card {#on-merch-card}

### Express variants {#express-variants}

| Variant | Typical slots | Notes |
| --- | --- | --- |
| `simplified-pricing-express` | `body-xs`, `heading-xs`, `price` | Paragraphs with `mas-mnemonic` are styled as an icon row at the bottom of the description area. Card expansion ignores clicks on `mas-mnemonic`. |
| `full-pricing-express` | `heading-xs`, `body-s` | Inline mnemonics in the title; `--mas-mnemonic-tooltip-padding: 4px 8px` on the host. |

### Fries variant {#fries-variant}

Description HTML in `body-s` may include inline `mas-mnemonic` elements alongside `merch-icon` app icons. `smartPlacement` is enabled automatically. See [Fries Gallery](fries.html#description-mnemonics).

## Content and placement attributes {#content-and-placement}

Tooltip copy and placement each resolve through a precedence chain:

| Resolved value | Priority (first match wins) |
| --- | --- |
| Tooltip text | `tooltip-text` → `mnemonic-text` → `content` → `''` |
| Placement | `tooltip-placement` → `mnemonic-placement` → `placement` → `top` |

When no tooltip text resolves, the component renders an icon-only span (`.icon-only`) with no tooltip wrapper.

Tooltip HTML is rendered with `unsafeHTML`. Plain text is also used for `aria-label` on the CSS fallback trigger (HTML tags stripped).

## Attributes {#attributes}

| Attribute | Property | Description | Default | Reflects |
| --- | --- | --- | --- | --- |
| `content` | `content` | Tooltip HTML or plain text. | `''` | yes |
| `tooltip-text` | `tooltipText` | Studio alias for tooltip copy. Takes precedence over `content`. | `''` | yes |
| `mnemonic-text` | `mnemonicText` | Studio alias for tooltip copy. Used when `tooltip-text` is absent. | `''` | yes |
| `placement` | `placement` | Preferred tooltip side: `top`, `bottom`, `left`, or `right`. | `top` | yes |
| `tooltip-placement` | `tooltipPlacement` | Studio alias for placement. Takes precedence over `placement`. | `''` | yes |
| `mnemonic-placement` | `mnemonicPlacement` | Studio alias for placement. Used when `tooltip-placement` is absent. | `''` | yes |
| `variant` | `variant` | Spectrum `sp-tooltip` variant (for example `info`). Ignored in CSS fallback mode. | `info` | yes |
| `src` | `src` | Image URL for an icon-only trigger. Renders a child `merch-icon` instead of the default slot. | `''` | yes |
| `size` | `size` | `merch-icon` size when `src` is set. | `xs` | yes |
| `smart-placement` | `smartPlacement` | Opt in to viewport-aware fixed positioning. Auto-enabled inside fries cards. | `false` | yes |

## Slots {#slots}

| Slot | Purpose |
| --- | --- |
| Default | Trigger content (text character, `merch-icon`, or other inline markup). Ignored when `src` is set. |

## CSS custom properties {#css-custom-properties}

Variant styles may override tooltip padding on the host:

| Property | Typical override | Purpose |
| --- | --- | --- |
| `--mas-mnemonic-tooltip-padding` | `4px 8px` on Express and fries cards | Inner padding of `.css-tooltip-body` in fallback mode |

## AEM hydration {#aem-hydration}

`processMnemonicElements()` in `hydrate.js` scans fragment HTML strings for `<mas-mnemonic` and dynamically imports `mas-mnemonic.js`. The function does not rewrite mnemonic markup — the web component initializes when the HTML is inserted into the DOM.

Fields that commonly carry inline mnemonics:

| Fragment field | Variant | Slot |
| --- | --- | --- |
| `cardTitle` | `simplified-pricing-express`, `full-pricing-express` | `heading-xs` |
| `description` | `simplified-pricing-express`, `full-pricing-express`, `fries` | `body-xs` / `body-s` |

Pre-authored `<mas-mnemonic>` markup in fragment HTML is passed through unchanged.

## Bundle {#bundle}

Import via [mas.js](mas.js.html). `mas-mnemonic` is also built as a standalone Lit bundle entry (`build.mjs` → `dist/mas-mnemonic.js`) and lazy-loaded by `hydrate.js` and `merch-icon.js` when needed.
