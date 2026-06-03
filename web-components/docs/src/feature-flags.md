# Feature Flags

## Feature Flags

### What it does

M@S feature flags toggle authoring defaults, checkout modal behavior, annual price display, dependency loading, and geo-based locale resolution. Flags are typically set with `<meta name="...">` tags; `mas-ff-defaults` and `mas-ff-annual-price` can also be set on `mas-commerce-service` via `data-mas-ff-*` attributes or URL parameters (see `MasCommerceService.#getFeatureFlag`).

`mas-commerce-service.featureFlags` only exposes `mas-ff-defaults` and `mas-ff-annual-price`. Other flags are consumed elsewhere (e.g. `mas-ff-3in1` read from `meta` in `checkout.js` / `checkout-mixin.js`).

### Attributes / Props

| Flag (meta `name`) | Default | Valid values | Read by |
| --- | --- | --- | --- |
| `mas-ff-defaults` | `off` | `on`, `off`, `true`, `false` | Service (`data-mas-ff-defaults`), inline-price tax/per-unit defaults, merch-card AEM hydration |
| `mas-ff-annual-price` | `off` | `on`, `off`, `true`, `false` | Service, inline-price `displayAnnual` |
| `mas-ff-3in1` | `on` | `on`, `off` | `document.querySelector('meta[name=mas-ff-3in1]')` in checkout URL build |
| `mas-ff-copy-cta` | `off` | `on`, `off` | Authoring surfaces (not in web-components service) |
| `mas-ff-mas-deps` | `off` | `on`, `off`, `true`, `false` | Milo / page loader (not in `MasCommerceService`) |
| `mas-geo-detection` | `off` | `on`, `off` | Locale resolution outside this package |

**`mas-ff-defaults`** (when on):

- Sets `displayPerUnit` default from offer `customerSegment` (non-`INDIVIDUAL` → per unit) when unset.
- Resolves `displayTax` and `forceTaxExclusive` via `resolvePriceTaxFlags` when unset.
- Without the flag, `displayOldPrice` defaults to `true` when unset on inline-price.

**`mas-ff-3in1`**: When `data-modal` is `twp`, `d2p`, or `crm` and meta is not `off`, checkout uses 3-in-1 context (`is3in1` in `buildCheckoutURL`).

**`mas-ff-annual-price`**: When on and `data-display-annual` is not `false`, inline-price sets `displayAnnual` true; ABM offers can render annual totals.

Service element form:

```html
<mas-commerce-service data-mas-ff-defaults="on" data-mas-ff-annual-price="on"></mas-commerce-service>
```

### Events

Feature flags do not dispatch dedicated events. Dependent components emit `mas:resolved` / `mas:failed` or `wcms:commerce:ready` when the service activates.

### Usage example

```html
<meta name="mas-ff-defaults" content="on">
<meta name="mas-ff-3in1" content="off">
```

Disable 3-in-1 modal checkout:

```html
<meta name="mas-ff-3in1" content="off">
```

### Notes

- Studio-authored cards enable `mas-ff-defaults` regardless of page meta (product behavior documented in prior internal docs).
- Tax label tables by country/segment for Milo are maintained in the long-form tables below; source of truth for runtime defaults is `inline-price.js` (`DISPLAY_ALL_TAX_COUNTRIES`, `TAX_EXCLUDED_MAP`, etc.).
- URL query parameters can override some flags for testing (`getParameter` from `@dexter/tacocat-core`).

## Detailed tax label reference (Milo)

The following tables document default tax **copy** when `mas-ff-defaults` is on. Runtime behavior is implemented in `resolvePriceTaxFlags` / `resolveTaxExclusive` in `web-components/src/inline-price.js`.

### mas-ff-defaults — Tax label display by country and segment

> Applies to Milo surfaces when the flag is enabled.

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

For other countries, tax labels are hidden by default (`Defaults.displayTax`).

Other flag narratives (`mas-ff-copy-cta`, `mas-ff-mas-deps`, `mas-geo-detection`) describe integration outside `web-components/src`; behavior is not implemented in the service class itself.
