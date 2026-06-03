# Feature Flags {#feature-flags}

Feature flags for **web-components** can be set via a meta tag or on [`mas-commerce-service`](mas-commerce-service.html).

e.g. `<meta name="mas-ff-defaults" content="on">` or `<mas-commerce-service data-mas-ff-defaults="on"></mas-commerce-service>`

URL query parameters with the same name also apply (via `@dexter/tacocat-core` `getParameter`).

| Flag Name | Implemented in web-components | Description | Default | Valid Values |
|-----------|------------------------------|-------------|---------|--------------|
| `mas-ff-defaults` | Yes (`mas-commerce-service`, `inline-price`, `merch-card`) | Locale/segment-aware defaults for tax labels, per-unit display, and related price options. | `off` | `on`, `off`, `true`, `false` |
| `mas-ff-annual-price` | Yes (`mas-commerce-service`, `inline-price`) | Shows annual price for ABM offers when `data-display-annual` is not `false`. | `off` | `on`, `off`, `true`, `false` |
| `mas-ff-3in1` | Yes (meta tag only; read in `checkout.js` / `checkout-mixin.js`) | Unified 3-in-1 modal checkout for `data-modal` values `twp`, `d2p`, `crm`. | `on` (absent meta = enabled) | `on`, `off` |
| `mas-ff-copy-cta` | **Not found in web-components source** | — | — | — |
| `mas-ff-mas-deps` | **Not found in web-components source** | — | — | — |
| `mas-geo-detection` | **Not found in web-components source** | — | — | — |

Flags marked as not found in this repository may be implemented in consumer surfaces (e.g. Milo/mas.js loaders) outside `web-components/src/`.

## Detailed Flag Descriptions

### mas-ff-defaults

**Purpose:** Eliminates the need for authors to manually configure tax display and pricing settings for each locale. This flag automatically applies region-appropriate defaults based on country, language, and customer segment.

**What it controls:**
- **Unit label display:** Automatically adds unit labels (e.g., "per license") for team offers across all countries.
- **Tax label display:** Automatically shows or hides tax labels ("incl. tax" or "excl. tax") based on country regulations.
  
**Tax Label Display by Country and Customer Segment:**
> **Note:** The settings in the table apply only to Milo.

| Country/Locale | INDIVIDUAL | TEAM |
| --- | --- | --- |
| **Europe** |     |     |
| AT_de (Austria) | inkl. MwSt. | exkl. MwSt. |
| BE_en (Belgium) | incl. VAT | excl. VAT |
| BE_fr (Belgium) | TTC | HT  |
| BE_nl (Belgium) | incl. btw | excl. btw |
| BG_bg (Bulgaria) | вкл. ДДС | без ДДС |
| CH_de (Switzerland) | inkl. MwSt. | exkl. MwSt. |
| CH_fr (Switzerland) | TTC | HT  |
| CH_it (Switzerland) | incl. IVA | escl. IVA. |
| CZ_cs (Czech Republic) | včetně DPH | bez DPH |
| DE_de (Germany) | inkl. MwSt. | exkl. MwSt. |
| DK_da (Denmark) | inkl. moms | ekskl. moms |
| EE_et (Estonia) | käibemaksuga | käibemaksuta |
| ES_es (Spain) | IVA incluido | sin IVA |
| FI_fi (Finland) | sis. ALV:n | ilman ALV:tä |
| FR_fr (France) | TTC | HT  |
| GB_en (United Kingdom) | incl. VAT | excl. VAT |
| GR_el (Greece) | συμπερ. ΦΠΑ | εξαιρ. ΦΠΑ |
| GR_en (Greece) | incl. VAT | excl. VAT |
| HU_hu (Hungary) | áfával | áfa nélkül |
| IE_en (Ireland) | incl. VAT | excl. VAT |
| IT_it (Italy) | incl. IVA | escl. IVA. |
| LT_lt (Lithuania) | su PVM | be PVM |
| LU_de (Luxembourg) | inkl. MwSt. | exkl. MwSt. |
| LU_en (Luxembourg) | incl. VAT | excl. VAT |
| LU_fr (Luxembourg) | TTC | HT  |
| LV_lv (Latvia) | ar PVN | bez PVN |
| NL_nl (Netherlands) | incl. btw | excl. btw |
| NO_nb (Norway) | inkl. moms | uten moms |
| PL_pl (Poland) | w tym VAT | bez VAT |
| PT_pt (Portugal) | IVA incluso | IVA não incluso |
| RO_ro (Romania) | cu TVA | fără TVA |
| SE_sv (Sweden) | inkl. moms | exkl. moms |
| SI_sl (Slovenia) | z DDV-jem | brez DDV-ja |
| SK_sk (Slovakia) | vrátane DPH | bez DPH |
| TR_tr (Turkey) | KDV dahil | KDV hariç |
| UA_uk (Ukraine) | з ПДВ | без урахування ПДВ |
| **Asia-Pacific** |     |     |
| AU_en (Australia) | incl. GST | incl. GST |
| ID_en (Indonesia) | incl. VAT | excl. VAT |
| ID_id (Indonesia) | termasuk PPN | sebelum PPN |
| IN_en (India) | incl. GST | excl. GST |
| IN_hi (India) | GST सहित | GST अतिरिक्त |
| JP_ja (Japan) | 税込  | 税込  |
| KR_ko (South Korea) | 부가세 포함 | 부가세 별도 |
| MY_en (Malaysia) | incl. SST | excl. SST |
| MY_ms (Malaysia) | termasuk SST | SST dikecualikan |
| NZ_en (New Zealand) | incl. GST | incl. GST |
| SG_en (Singapore) | incl. GST | excl. GST |
| TH_en (Thailand) | incl. VAT | incl. VAT |
| TH_th (Thailand) | รวม VAT | รวม VAT |
| TW_zh (Taiwan) | 含稅 | 不含稅 |
| VN_en (Vietnam) | incl. VAT | excl. VAT |
| VN_vi (Vietnam) | gồm VAT | chưa bao gồm VAT |
| PH_en (Philippines) | incl. VAT | excl. VAT |
| PH_fil (Philippines) | kasama ang VAT | hindi kasama ang VAT |
| **Middle East & Africa** |     |     |
| EG_ar (Egypt) | بالضريبة | باستثناء ضريبة |
| EG_en (Egypt) | incl. VAT | excl. VAT |
| MU_en (Mauritius) | excl. VAT | excl. VAT |
| NG_en (Nigeria) | incl. VAT | incl. VAT |
| SA_ar (Saudi Arabia) | بالضريبة | باستثناء ضريبة |
| SA_en (Saudi Arabia) | incl. VAT | excl. VAT |
| ZA_en (South Africa) | incl. VAT | incl. VAT |
| **Latin America** |     |     |
| CO_es (Colombia) | IVA incluido | sin IVA |
| PE_es (Peru) | IVA incluido | IVA incluido |
| MX_es (Mexico) | sin IVA | sin IVA |
| CL_es (Chile) | sin IVA | sin IVA |

For the rest of the countries tax label is not displayed by default.

**Important:** Any card created in M@S Studio automatically has the `mas-ff-defaults` flag enabled, regardless of whether a meta tag is present on the page.

**Usage:**

Add the feature flag in the page metadata:

```html
<meta name="mas-ff-defaults" content="on">
```

Or on the commerce service element:

```html
<mas-commerce-service data-mas-ff-defaults="on"></mas-commerce-service>
```

---

### mas-ff-3in1

**Purpose:** Controls the unified 3-in-1 modal checkout experience that streamlines the purchase flow by combining multiple checkout steps into a single modal interface.

**What it controls:**
- **TWP (Trial With Purchase)**
- **D2P (Direct to Purchase)**
- **CRM (Content Rich Modals)**

**Behavior:**
- When enabled (default): Checkout links with modal types `twp`, `d2p`, or `crm` open in the unified 3-in-1 modal interface
- When disabled: The system uses fallback workflow steps based on product-specific configurations (segmentation, commitment, recommendation, or email steps)
- The checkout URL includes `cli=mini_plans` for TWP/D2P or `cli=creative` for CRM modals

**When to disable:** Use `off` when you need to bypass the 3-in-1 modal and use traditional multi-step checkout flows, or when testing specific workflow step configurations.

**Usage:**

```html
<!-- Disable 3-in-1 modal (enabled by default) -->
<meta name="mas-ff-3in1" content="off">
```

---

### mas-ff-annual-price

**Purpose:** Enables the display of annual pricing information alongside monthly prices, helping customers understand the total yearly cost of subscription products.

**What it controls:**
- **Annual price calculation:** For yearly commitment products billed monthly, calculates and displays the total annual cost (monthly price × 12)
- **Promotional pricing:** When promotions are active, calculates the blended annual price considering:
  - Discounted months during the promotion period
  - Regular price months after promotion ends
  - Example: 3 months at $9.99/mo + 9 months at $22.99/mo = $236.88/year
- **Price template rendering:** Adds annual price display in parentheses after the monthly price, e.g., "$22.99/mo ($275.88/yr)"
- **Mini compare chart styling:** Adds `annual-price-new-line` class to price headings for proper layout

**Usage:**

```html
<meta name="mas-ff-annual-price" content="on">
```

When enabled, individual price elements can opt out using the `annual=false` parameter in the merch link.

---

### Flags not implemented in web-components {#unimplemented-flags}

`mas-ff-copy-cta`, `mas-ff-mas-deps`, and `mas-geo-detection` are documented historically but have **no references** under `web-components/src/`. Do not assume they work from `mas.js` alone without verifying the consuming page loader. For local/stage library overrides, `aem-fragment` preview uses the `maslibs` URL query parameter (see [aem-fragment](aem-fragment.html)).

## Notes {#notes}

- Feature flags default to `off` unless otherwise specified (except `mas-ff-3in1` which defaults to `on`)
- Values `on` and `true` are equivalent for enabling a flag
- Values `off` and `false` are equivalent for disabling a flag
- Feature flags can be overridden via URL parameters for testing purposes
- Changes to feature flags take effect on page load

