#!/bin/bash

node ./docs/src/build-docs.mjs inline-price.md ./docs/inline-price.html
node ./docs/src/build-docs.mjs checkout-link.md ./docs/checkout-link.html
node ./docs/src/build-docs.mjs checkout-button.md ./docs/checkout-button.html
node ./docs/src/build-docs.mjs upt-link.md ./docs/upt-link.html
node ./docs/src/build-docs.mjs mas.md ./docs/mas.html
node ./docs/src/build-docs.mjs step-by-step.md ./docs/step-by-step.html
node ./docs/src/build-docs.mjs mas.js.md ./docs/mas.js.html
node ./docs/src/build-docs.mjs mas-commerce-service.md ./docs/mas-commerce-service.html
node ./docs/src/build-docs.mjs feature-flags.md ./docs/feature-flags.html
node ./docs/src/build-docs.mjs aem-fragment.md ./docs/aem-fragment.html
node ./docs/src/build-docs.mjs merch-card.md ./docs/merch-card.html
node ./docs/src/build-docs.mjs merch-card-collection.md ./docs/merch-card-collection.html
node ./docs/src/build-docs.mjs merch-offer-select.md ./docs/merch-offer-select.html
node ./docs/src/build-docs.mjs merch-quantity-select.md ./docs/merch-quantity-select.html
node ./docs/src/build-docs.mjs merch-addon.md ./docs/merch-addon.html
node ./docs/src/build-docs.mjs merch-badge.md ./docs/merch-badge.html
node ./docs/src/build-docs.mjs merch-icon.md ./docs/merch-icon.html
node ./docs/src/build-docs.mjs merch-whats-included.md ./docs/merch-whats-included.html
node ./docs/src/build-docs.mjs merch-sidenav.md ./docs/merch-sidenav.html
node ./docs/src/build-docs.mjs headless.md ./docs/headless.html
node ./docs/src/build-docs.mjs plans.md ./docs/plans.html
node ./docs/src/build-docs.mjs plans-v2.md ./docs/plans-v2.html
node ./docs/src/build-docs.mjs plans-collection.md ./docs/plans-collection.html
node ./docs/src/build-docs.mjs catalog.md ./docs/catalog.html
node ./docs/src/build-docs.mjs minicompare.md ./docs/minicompare.html
node ./docs/src/build-docs.mjs minicomparemweb.md ./docs/minicomparemweb.html
node ./docs/src/build-docs.mjs product.md ./docs/product.html
node ./docs/src/build-docs.mjs segment.md ./docs/segment.html
node ./docs/src/build-docs.mjs specialoffer.md ./docs/specialoffer.html
node ./docs/src/build-docs.mjs image.md ./docs/image.html
node ./docs/src/build-docs.mjs commerce.md ./docs/commerce.html
node ./docs/src/build-docs.mjs fries.md ./docs/fries.html
node ./docs/src/build-docs.mjs ccd.md ./docs/ccd.html
node ./docs/src/build-docs.mjs json-ld.md ./docs/json-ld.html
npx esbuild --bundle --external:*.css --outfile=./docs/spectrum.js ./docs/src/spectrum.mjs