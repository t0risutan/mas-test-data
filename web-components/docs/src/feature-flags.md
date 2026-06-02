# Feature Flags

## Feature Flags

### What it does

Feature flags control optional M@S behavior at page load. In `web-components/src`, flags are read from:

1. `<meta name="…" content="on">` tags
2. URL query parameters (via `@dexter/tacocat-core` `getParameter`)
3. `mas-commerce-service` attributes prefixed with `data-` (for service-managed flags)

Flags take effect on page load; changing them requires a reload.

### Attributes / Props

#### Implemented in `web-components/src`

| Flag | Set via | Default | Valid values | What it controls |
| --- | --- | --- | --- | --- |
| `mas-ff-defaults` | Meta, URL param, or `<mas-commerce-service data-mas-ff-defaults="on">` | off | `on`, `off`, `true`, `false` | Auto tax/per-unit defaults in `inline-price` via `resolvePriceTaxFlags()`. Also forced on for prices inside `merch-card` and `mas-field` fragments. |
| `mas-ff-annual-price` | Meta, URL param, or `<mas-commerce-service data-mas-ff-annual-price="on">` | off | `on`, `off`, `true`, `false` | Sets `displayAnnual=true` for eligible ABM offers unless `data-display-annual="false"` on the inline-price. |
| `mas-ff-3in1` | **Meta tag only** (`<meta name="mas-ff-3in1" content="off">`) | on (3-in-1 active when meta absent or not `off`) | `on`, `off` | When `data-modal` is `twp`, `d2p`, or `crm` on checkout elements, controls whether unified 3-in-1 modal checkout is used. Read in `checkout-mixin.js` / `buildCheckoutUrl.js`. |

#### Documented elsewhere — not found in `web-components/src`

The following flags appear in older documentation or sibling Milo packages but **have no references in this repository's source**. Behavior described for them may apply on adobe.com via Milo, not via this package alone:

| Flag | Status in this repo |
| --- | --- |
| `mas-ff-copy-cta` | Not implemented in `web-components/src` |
| `mas-ff-mas-deps` | Not implemented in `web-components/src` |
| `mas-geo-detection` | Not implemented in `web-components/src` |

### Events

Feature flags do not dispatch events. Downstream elements emit their normal lifecycle events after flag-driven rendering (for example `mas:resolved` on prices).

### Usage example

Enable defaults and annual pricing:

```html
<meta name="mas-ff-defaults" content="on">
<meta name="mas-ff-annual-price" content="on">

<mas-commerce-service
    wcs-api-key="wcms-commerce-ims-ro-user-milo"
    lana-tags="acom"
    data-mas-ff-defaults="on"
    data-mas-ff-annual-price="on"
></mas-commerce-service>
```

Disable 3-in-1 modal checkout:

```html
<meta name="mas-ff-3in1" content="off">
```

Opt out of annual price on a specific element while the flag is on:

```html
<span
    is="inline-price"
    data-wcs-osi="Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"
    data-display-annual="false"
></span>
```

### Notes

#### mas-ff-defaults

When enabled, unset `data-display-tax` and `data-force-tax-exclusive` on `inline-price` are resolved from country, language, customer segment, and market segment.

**Additional behaviors when enabled:**

- `data-display-per-unit` defaults to `true` for non-`INDIVIDUAL` customer segments when not explicitly set.
- Cards authored in M@S Studio effectively behave as if this flag is on for fragment-hosted prices.

**Tax label defaults (Milo surfaces)**

| Country/Locale | INDIVIDUAL | TEAM |
| --- | --- | --- |
| **Europe** | | |
| AT_de (Austria) | inkl. MwSt. | exkl. MwSt. |
| BE_en (Belgium) | incl. VAT | excl. VAT |
| BE_fr (Belgium) | TTC | HT |
| BE_nl (Belgium) | incl. btw | excl. btw |
| BG_bg (Bulgaria) | вкл. ДДС | без ДДС |
| CH_de (Switzerland) | inkl. MwSt. | exkl. MwSt. |
| CH_fr (Switzerland) | TTC | HT |
| CH_it (Switzerland) | incl. IVA | escl. IVA. |
| CZ_cs (Czech Republic) | včetně DPH | bez DPH |
| DE_de (Germany) | inkl. MwSt. | exkl. MwSt. |
| DK_da (Denmark) | inkl. moms | ekskl. moms |
| EE_et (Estonia) | käibemaksuga | käibemaksuta |
| ES_es (Spain) | IVA incluido | sin IVA |
| FI_fi (Finland) | sis. ALV:n | ilman ALV:tä |
| FR_fr (France) | TTC | HT |
| GB_en (United Kingdom) | incl. VAT | excl. VAT |
| GR_el (Greece) | συμπερ. ΦΠΑ | εξαιρ. ΦΠΑ |
| GR_en (Greece) | incl. VAT | excl. VAT |
| HU_hu (Hungary) | áfával | áfa nélkül |
| IE_en (Ireland) | incl. VAT | excl. VAT |
| IT_it (Italy) | incl. IVA | escl. IVA. |
| LT_lt (Lithuania) | su PVM | be PVM |
| LU_de (Luxembourg) | inkl. MwSt. | exkl. MwSt. |
| LU_en (Luxembourg) | incl. VAT | excl. VAT |
| LU_fr (Luxembourg) | TTC | HT |
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
| **Asia-Pacific** | | |
| AU_en (Australia) | incl. GST | incl. GST |
| ID_en (Indonesia) | incl. VAT | excl. VAT |
| ID_id (Indonesia) | termasuk PPN | sebelum PPN |
| IN_en (India) | incl. GST | excl. GST |
| IN_hi (India) | GST सहित | GST अतिरिक्त |
| JP_ja (Japan) | 税込 | 税込 |
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
| **Middle East & Africa** | | |
| EG_ar (Egypt) | بالضريبة | باستثناء ضريبة |
| EG_en (Egypt) | incl. VAT | excl. VAT |
| MU_en (Mauritius) | excl. VAT | excl. VAT |
| NG_en (Nigeria) | incl. VAT | incl. VAT |
| SA_ar (Saudi Arabia) | بالضريبة | باستثناء ضريبة |
| SA_en (Saudi Arabia) | incl. VAT | excl. VAT |
| ZA_en (South Africa) | incl. VAT | incl. VAT |
| **Latin America** | | |
| CO_es (Colombia) | IVA incluido | sin IVA |
| PE_es (Peru) | IVA incluido | IVA incluido |
| MX_es (Mexico) | sin IVA | sin IVA |
| CL_es (Chile) | sin IVA | sin IVA |

For other countries the tax label is hidden by default.

#### mas-ff-3in1

Recognized `data-modal` values: `twp`, `d2p`, `crm` (see `MODAL_TYPE_3_IN_1` in `constants.js`). When 3-in-1 is active, checkout URL context uses iframe/modal flow (`context: 'if'`).

#### mas-ff-annual-price

Annual display is gated on the offer's `planType === 'ABM'` in the default price template path. Promotional annual blending logic lives in the price template functions.

Values `on`/`true` enable a flag; `off`/`false` disable it.
