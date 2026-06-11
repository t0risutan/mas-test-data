# plans-modal {#plans-modal}

## Introduction {#introduction}

`plans-modal` is a Lit overlay dialog for presenting plan comparison content: title, description, three feature lists (includes, extra, recommended), and a subscription actions panel. It uses Spectrum Web Components (`sp-theme`, `sp-dialog-wrapper`, `sp-button`) and opens automatically when the element connects.

The component is **not** registered by [mas.js](mas.js.html) or included in `build.mjs` bundle output. Import `web-components/src/plans-modal.js` directly in the hosting page (or add a dedicated bundle entry).

`openModal()` calls `Overlay.open()` from `@spectrum-web-components/overlay`, but the source file does not import `Overlay`. The hosting integration must provide `Overlay` in scope (for example by importing it on the page before loading `plans-modal.js`).

There are no AEM hydration mappings or variant registrations for this element in the M@S codebase. No production usage references were found in `web-components/`.

## Markup structure {#markup}

Author the modal in the light DOM, then append it to the document when the shopper opens the comparison. Set `trigger` to the element that opened the overlay (passed through to `Overlay.open()`). On connect, the modal parses list items from slotted containers and opens immediately.

```html
<plans-modal
  id="compare-modal"
  title="Creative Cloud All Apps"
  description="Get 20+ creative desktop and mobile apps."
  includes-limit="5"
  back-text="Back"
  cta-text="Continue"
  includes-text="Includes"
  extra-text="Extra"
  recommended-text="Recommended"
  see-more-text=" + See more"
>
  <img slot="icon" src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg" alt="" />

  <div slot="includes">
    <li><merch-icon size="s" src="..." alt="Photoshop"></merch-icon> Photoshop</li>
    <li><merch-icon size="s" src="..." alt="Illustrator"></merch-icon> Illustrator</li>
    <!-- additional <li> rows -->
  </div>

  <div slot="extra">
    <li>100GB cloud storage</li>
    <li>Adobe Fonts</li>
  </div>

  <div slot="recommended">
    <li>Acrobat Pro</li>
  </div>

  <merch-subscription-panel>
    <!-- subscription / checkout UI provided by the host integration -->
  </merch-subscription-panel>

  <offer>
    <!-- optional; queried on connect but not rendered by plans-modal -->
  </offer>
</plans-modal>
```

Remove the element from the DOM when the shopper dismisses the dialog (`@close` / `@cancel` call `this.remove()` on the host element).

## Attributes {#attributes}

| Attribute / property | Type | Default | Reflects | Description |
| --- | --- | --- | --- | --- |
| `title` | String | — | no | Dialog and heading text. Bound to `sp-dialog-wrapper` `title`, and rendered in the `#title` `<h2>`. |
| `description` | String | — | no | Body copy rendered in the `#description` `<p>`. |
| `includes-limit` | Number | `5` | yes | Maximum includes rows visible before the see-more control. Sets CSS variable `--consonant-plan-modal-includes-limit`. |
| `back-text` | String | — | no | Cancel button label on `sp-dialog-wrapper` (`cancel-label`). |
| `cta-text` | String | — | no | Confirm button label on `sp-dialog-wrapper` (`confirm-label`). |
| `includes-text` | String | `Includes` | no | Heading above the includes list. |
| `extra-text` | String | `Extra` | no | Heading above the extra list. |
| `recommended-text` | String | `Recommended` | no | Heading above the recommended list. |
| `see-more-text` | String | ` + See more` | no | Label on the includes see-more button. |
| `trigger` | Object | — | no | Overlay trigger element. Passed to `Overlay.open()` as `trigger`. Not reflected as an HTML attribute — set as a property in script. |

### Runtime-populated properties {#runtime-properties}

`prepareSlots()` runs after first update and assigns these from light-DOM queries. They are not authorable as attributes.

| Property | Source | Use |
| --- | --- | --- |
| `includes` | `[slot="includes"] > li` | Rendered in the includes `<ul>`. |
| `extra` | `[slot="extra"] > li` | Rendered in the extra `<ul>`. |
| `recommended` | `[slot="recommended"] > li` | Rendered in the recommended `<ul>`. |
| `subscriptionPanel` | `merch-subscription-panel` child | Moved into the `#actions` region. |
| `offers` | `offer` child | Queried on connect; not referenced in the render template. |

## Slots {#slots}

| Slot | Required | Content | Notes |
| --- | --- | --- | --- |
| `icon` | no | Image or icon markup | Rendered in both `#title` and `#description` (same slot reused). |
| `includes` | no | Wrapper with `<li>` children | Each `<li>` becomes one includes row. See [Includes list](#includes-list). |
| `extra` | no | Wrapper with `<li>` children | Bulleted via CSS `::before` content. |
| `recommended` | no | Wrapper with `<li>` children | Bulleted via CSS `::before` content. |

`merch-subscription-panel` and `offer` are **not** named slots. Place them as direct children of `<plans-modal>`.

## Includes list {#includes-list}

On connect, `prepareSlots()` counts `[slot="includes"] > li` elements:

| Condition | Behavior |
| --- | --- |
| `includes.length <= includesLimit` | See-more button hidden. |
| `includes.length > includesLimit` | Outline `sp-button` shown (`#seeMore`). |

Clicking see-more sets `hideSeeMoreButton = true`, sets `includesLimit` to the full list length, and sets `--consonant-plan-modal-includes` to `auto` so the list scrolls instead of clipping.

Default overflow is controlled by host CSS variable `--consonant-plan-modal-includes` (`hidden` until expanded).

## Dialog behavior {#dialog-behavior}

| Event / phase | Behavior |
| --- | --- |
| `connectedCallback` | After `updateComplete`, runs `prepareSlots()` then `openModal()`. |
| `openModal()` | Opens `sp-dialog-wrapper` via `Overlay.open()` with `placement: 'none'`, `type: 'auto'`, and `trigger: this.trigger`. Appends the overlay to `sp-theme` in the shadow root. |
| `sp-dialog-wrapper` `@close` / `@cancel` | Calls `this.remove()` — removes the `<plans-modal>` element from the document. |
| Mobile (`MOBILE_LANDSCAPE`, max-width 767px) | Dialog `mode` set to `fullscreenTakeover`. |
| Desktop | `mode` unset; fixed grid layout (see [Layout](#layout)). |

`sp-dialog-wrapper` is configured with `dismissable`, `underlay`, and `no-divider`.

## Layout {#layout}

### Mobile (max-width 767px)

Single-column flex stack inside `#container` (part `container`): title → description → actions → includes → extra → recommended.

### Desktop (min-width 901px)

`#container` becomes a 3-column grid (max-width 1000px, height 637px):

| Region | Grid placement |
| --- | --- |
| `#title` | Columns 1–2, row 1 |
| `#description` | Columns 1–2, row 2 |
| `#includes` | Column 1, rows 3–7 |
| `#extra` | Column 2, rows 3–4 |
| `#recommended` | Column 2, rows 5–6 |
| `merch-subscription-panel` | Column 3, rows 1–5 (gray background) |

Includes list height is `calc(min(max(includes-limit, 5), 12) * 36px)` on desktop; `calc(includes-limit * 36px)` below 901px.

## CSS {#css}

| Variable | Set by | Effect |
| --- | --- | --- |
| `--consonant-plan-modal-includes-limit` | `includes-limit` attribute / `updated()` | Clipped height of the includes `<ul>`. |
| `--consonant-plan-modal-includes` | `:host` default `hidden`; see-more sets `auto` | `overflow-y` on the includes list. |

### Parts {#parts}

| Part | Element |
| --- | --- |
| `container` | `#container` — main content wrapper inside the dialog. |

## External dependencies {#external-dependencies}

| Dependency | Status in M@S repo |
| --- | --- |
| `merch-subscription-panel` | Referenced in `plans-modal.js` and styled in `plans-modal.css.js`. **Not defined** in `web-components/src/`. Provided by the host page. |
| `offer` | Queried as a child element. **Not defined** in `web-components/src/`. |
| `Overlay` (`@spectrum-web-components/overlay`) | Required at runtime. **Not imported** in `plans-modal.js`. |
