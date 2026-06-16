## Overview {#overview}

Plans cards load from AEM fragments. The fragment `variant` field selects one of three mappings in `web-components/src/variants/plans.js`. Gallery examples omit an explicit `variant` attribute on `<merch-card>` — hydration sets it from the fragment.

See [merch-card](merch-card.html) for shared attributes and events, and [merch-quantity-select](merch-quantity-select.html) for quantity UI referenced by the `quantitySelect` field.

## Variants {#variants}

| Variant | Mapping constant | Gallery section |
| --- | --- | --- |
| `plans` | `PLANS_AEM_FRAGMENT_MAPPING` | Individual and business cards |
| `plans-education` | `PLANS_EDUCATION_AEM_FRAGMENT_MAPPING` | Education cards |
| `plans-students` | `PLANS_STUDENTS_AEM_FRAGMENT_MAPPING` | Student pricing (not shown in this gallery) |
| `plans-v2` | `PLANS_V2_AEM_FRAGMENT_MAPPING` | [Plans v2 Gallery](plans-v2.html) (Commerce examples) |

Education omits `whatsIncluded`, `size`, and `secureLabel` from the base mapping and places the title in `heading-s` instead of `heading-xs`. Students omits `subtitle`, `whatsIncluded`, `size`, and `quantitySelect`.

## AEM fragment fields {#aem-fields}

During hydration (`hydrate.js`), each field below is mapped through `PLANS_*_AEM_FRAGMENT_MAPPING`:

| AEM field | Slot / target | Tag | Notes |
| --- | --- | --- | --- |
| `variant` | `merch-card.variant` | — | Required. |
| `cardName` | `name` attribute | — | Card identifier for analytics and collections. |
| `cardTitle` | `heading-xs` (`heading-s` for education) | `h3` | Plan title. |
| `subtitle` | `subtitle` | `p` | Not used by education or students variants. |
| `prices` | `heading-m` | `p` | HTML with `inline-price` elements. |
| `promoText` | `promo-text` | `p` | |
| `description` | `body-xs` | `div` | Checkout links in description HTML are converted to buttons. |
| `callout` | `callout-content` | `div` | |
| `whatsIncluded` | `whats-included` | `div` | `merch-whats-included` markup. Not used by education or students. |
| `quantitySelect` | `quantity-select` | `div` | Serialized `merch-quantity-select` HTML. Not used by students. |
| `addon` | `addon` | — | Creates `merch-addon` from field HTML or `settings.addon`. |
| `badge` | `badge` | `div` | Plain text is wrapped in `merch-badge`; HTML passthrough when already tagged. Default background `spectrum-yellow-300-plans`. |
| `borderColor` | `border-color` attribute / CSS variable | — | Allowed values listed in `allowedBorderColors`. |
| `size` | `size` attribute | — | `wide` or `super-wide`. Not used by education or students. |
| `mnemonicIcon`, `mnemonicAlt`, `mnemonicLink` | `icons` | `merch-icon` | Parallel arrays; icon size `l`. |
| `ctas` | `footer` | `div` | Footer links hydrated as Consonant buttons (`style: 'consonant'` sets the `consonant` attribute). |

## Fragment settings {#fragment-settings}

| Setting | Effect |
| --- | --- |
| `secureLabel` | Sets `secure-label` when the variant mapping includes `secureLabel: true` (not education). |
| `displayPlanType` | Controls plan-type text in legal price clones. |
| `addon` | Fallback HTML for `merch-addon` when `fields.addon` is absent. |
| `quantitySelect` | Fallback markup when `fields.quantitySelect` is absent. |
| `hideTrialCTAs` | Removes trial CTAs from the footer during hydration. |

Stock checkbox UI (`checkbox-label`, `stock-offer-osis`) is rendered by the plans layout when those attributes are present on `merch-card`; they are not set in `hydrate.js` from fragment fields.

## Slots {#slots}

Layout from `Plans.renderLayout()`:

| Slot | Region | Notes |
| --- | --- | --- |
| `icons` | Body | Product mnemonics. |
| `heading-xs` / `heading-s` | Body | Title (`heading-s` for education). |
| `subtitle` | Body | |
| `heading-m` | Body | Main price. |
| `promo-text` | Body | |
| `body-xs` | Body | Description. |
| `whats-included` | Body | |
| `callout-content` | Body | |
| `quantity-select` | Body | |
| — | Body | Stock checkbox when `checkbox-label` is set. |
| `addon` | Body or footer | Moves to footer on `super-wide` at desktop widths. |
| `badge` | Body | |
| `footer` | Footer | CTAs and secure-transaction label. |

<div class="plans-gallery-content">
  <h1 id="plans-gallery">Plans Gallery</h1>
  <a class="plans-link" target="_blank" href="https://main--milo--adobecom.aem.page/drafts/nala/features/commerce/plans">Nala Test Plans collection page ↗</a>
  <a class="plans-link" target="_blank" href="https://main--milo--adobecom.aem.page/merch/mas/plans">Dev Test Plans collection page ↗</a>
  <h2 id="crd-mrch-plan-ind">Regular Plans Individual Cards <a class="header-anchor" href="#crd-mrch-plan-ind" title="Permalink to this heading">#</a></h2>
  <div class="four-merch-cards plans">
      <div class="plans-item">
        <merch-card><aem-fragment fragment="5a5ca143-a417-4087-b466-5b72ac68a830"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=5a5ca143-a417-4087-b466-5b72ac68a830"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="1736f2c9-0931-401b-b3c0-fe87ff72ad38"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=1736f2c9-0931-401b-b3c0-fe87ff72ad38"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="616273eb-3aad-462a-a6d7-6f6857973b77"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=616273eb-3aad-462a-a6d7-6f6857973b77"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="dfc2eede-7e88-4ed3-b96c-f5214472dfcf"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=dfc2eede-7e88-4ed3-b96c-f5214472dfcf"> Open in Studio</a>
      </div>
  </div>
    <h2 id="crd-mrch-plan-bus">Promotion Plans Cards <a class="header-anchor" href="#crd-mrch-plan-bus" title="Permalink to this heading">#</a></h2>
  <div class="four-merch-cards plans">
      <div class="plans-item">
        <merch-card><aem-fragment fragment="8373b5c2-69e6-4e9c-befc-b424dd33469b"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=8373b5c2-69e6-4e9c-befc-b424dd33469b"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="38a8c8f1-63a6-4b59-b8e1-0008674e22be"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=38a8c8f1-63a6-4b59-b8e1-0008674e22be"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="14e18a9c-252f-4d3d-b243-bf9b1509a91d"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=14e18a9c-252f-4d3d-b243-bf9b1509a91d"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="973b373d-5484-41d5-acac-5d4b49763d88"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=973b373d-5484-41d5-acac-5d4b49763d88"> Open in Studio</a>
      </div>

  </div>

  <h2 id="crd-mrch-plan-bus">Regular Plans Business Cards <a class="header-anchor" href="#crd-mrch-plan-bus" title="Permalink to this heading">#</a></h2>
  <div class="four-merch-cards plans">
      <div class="plans-item">
        <merch-card><aem-fragment fragment="d9998fc3-578e-44be-be4f-d8be1c45c75b"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=d9998fc3-578e-44be-be4f-d8be1c45c75b"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="ec482607-bcf8-4d3e-b285-0033268b99d3"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=ec482607-bcf8-4d3e-b285-0033268b99d3"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="1828159b-93a3-4b8c-b737-5fbf83ca78ee"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=1828159b-93a3-4b8c-b737-5fbf83ca78ee"> Open in Studio</a>
      </div>

  </div>
  <h2 id="crd-mrch-plan-bus">Regular Plans Education Cards <a class="header-anchor" href="#crd-mrch-plan-bus" title="Permalink to this heading">#</a></h2>
  <div class="four-merch-cards plans">
      <div class="plans-item">
        <merch-card><aem-fragment fragment="b8cd82c8-f8fa-433a-afa2-9aba4ebe5ea5"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=b8cd82c8-f8fa-433a-afa2-9aba4ebe5ea5"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="97fd843f-eacf-4ccf-b067-3a61bd1f8872"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=97fd843f-eacf-4ccf-b067-3a61bd1f8872"> Open in Studio</a>
      </div>
      <div class="plans-item">
        <merch-card><aem-fragment fragment="a8bc3d90-ff5f-4beb-8e23-04e4d22ac37e"></aem-fragment></merch-card>
        <a class="plans-link" target="_blank" href="https://main--mas--adobecom.aem.live/studio.html?#path=nala&query=a8bc3d90-ff5f-4beb-8e23-04e4d22ac37e"> Open in Studio</a>
      </div>

  </div>
</div>
