<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/theme.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/button.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/tooltip.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/overlay.js"></script>
<script type="module" src="https://www.adobe.com/libs/features/spectrum-web-components/dist/popover.js"></script>

## Overview {#overview}

Commerce gallery cards set `spectrum="swc"` on `<merch-card>` so footer CTAs hydrate as Spectrum Web Components (`sp-button`) instead of Consonant or Spectrum CSS buttons (`hydrate.js` → `createSpectrumSwcButton`).

The card layout mapping is selected by the fragment `variant` field — commonly `plans-v2` (`PLANS_V2_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/plans-v2.js`) or `plans` (`PLANS_AEM_FRAGMENT_MAPPING` in `web-components/src/variants/plans.js`). See [Plans v2](plans-v2.html) for the `plans-v2` authoring reference, or the [Plans Gallery](plans.html) for the original plans variants.

## Commerce-specific markup {#commerce-markup}

```html {.demo}
<merch-card spectrum="swc">
  <aem-fragment fragment="…"></aem-fragment>
</merch-card>
```

| Attribute | Value | Effect |
| --- | --- | --- |
| `spectrum` | `swc` | Footer checkout links render as `sp-button` with `treatment`, `variant`, and `size` from the link class and mapping `ctas.size`. |
| `variant` | From fragment | Omit on the element when using `aem-fragment`; hydration sets it from `fields.variant`. |

When the fragment variant is `plans-v2`, see [Plans v2](plans-v2.html) for `shortDescription`, stock toggle, legal price, collection layout, and Spectrum-prefixed badge/border tokens.

## Fragment settings {#fragment-settings}

Same settings as plans cards apply when the underlying variant is from the plans family:

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` on the card. |
| `displayPlanType` | Controls plan-type text in legal price clones. |
| `addon` | Fallback HTML for `merch-addon`. |
| `quantitySelect` | Fallback markup for quantity UI. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

<div class="commerce-gallery-content">
  <h1 id="commerce-gallery">Commerce Gallery</h1>
  <div class="commerce-container">
    <h2 id="commerce-plans">Commerce Plans <a class="header-anchor" href="#commerce-plans" title="Permalink to this heading">#</a></h2>
    <h3 class="size-header">Featured Commerce Plans</h3>
    <div class="four-merch-cards commerce-plans">
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="8bd9c722-8b3c-4c65-b135-7f6a1b84f800"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8bd9c722-8b3c-4c65-b135-7f6a1b84f800"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="8487f19d-b038-44fa-9db6-0dc55a85b326"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8487f19d-b038-44fa-9db6-0dc55a85b326"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="a7179d35-1dd2-4f9a-9223-2f8c7062acc7"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=a7179d35-1dd2-4f9a-9223-2f8c7062acc7"> Open in Studio</a>
      </div>
      <div class="commerce-item">
        <merch-card spectrum="swc"><aem-fragment fragment="e243cb07-cb53-439d-bb62-d80f0fd719e5"></aem-fragment></merch-card>
        <a class="commerce-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=e243cb07-cb53-439d-bb62-d80f0fd719e5"> Open in Studio</a>
      </div>
    </div>
  </div>
</div>
