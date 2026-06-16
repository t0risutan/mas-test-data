// build-docs.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItHighlightjs from 'markdown-it-highlightjs';

// Reconstruct __dirname and __filename in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = process.argv[2];
if (!sourceFile) {
    console.error('Please provide a source file as an argument');
    process.exit(1);
}

const targetFile = process.argv[3];
if (!targetFile) {
    console.error('Please provide a target file as an argument');
    process.exit(1);
}

// Initialize markdown-it with desired plugins
const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
})
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: (slug, state) => ({
                href: `#${slug}`,
                title: 'Permalink to this heading',
            }),
        }),
    })
    .use(markdownItContainer, 'warning')
    .use(markdownItHighlightjs);

// Define input and output paths
const inputPath = path.join(__dirname, sourceFile);
const outputPath = path.join(targetFile);

// Read the Markdown file
const inputContent = fs.readFileSync(inputPath, 'utf8');

// depending on surface, load either Milo consonant or Spectrum styles
const styleDependecy = ['plans.md', 'plans-v2.md', 'plans-collection.md'].includes(sourceFile)
    ? '<link rel="stylesheet" href="../styles/styles.css">'
    : '<link rel="stylesheet" href="spectrum.css">';

// Render Markdown to HTML
let htmlContent = md.render(inputContent);
// wrap in sp-theme
const galleryPages = ['ccd.md', 'ccd-mini.md'];
htmlContent = galleryPages.includes(sourceFile)
    ? htmlContent
    : `<sp-theme color="light" scale="medium">\n${htmlContent}\n</sp-theme>`;

const initScript =
    sourceFile === 'ccd-mini.md'
        ? `import { init } from './common.js';
    const urlParams = new URLSearchParams(window.location.search);
    init({ 'data-mas-ff-defaults': 'on'});
    const country = urlParams.get('country');
    const language = urlParams.get('language');
    let activeLocale = document.querySelector(\`a[value="\${country},\${language}"]\`);
    activeLocale ??= document.querySelector('a.locale-toggle');
    activeLocale.classList.add('active');`
        : `import { init } from './common.js';
    init();`;

const ccdMiniStyles =
    sourceFile === 'ccd-mini.md'
        ? `
  <style>
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      align-items: baseline;
    }

    @media (min-width: 768px) {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .cards {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .locales {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .locale-toggle {
      font-size: 2.5em;
      text-decoration: none;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .locale-toggle:hover,
    .locale-toggle.active {
        background-color: var(--spectrum-gray-300);
    }

    .locale-toggle span {
      font-size: 0.5em;
      font-weight: 400;
      vertical-align: super;
    }
  </style>`
        : '';

// HTML template with your custom element script
const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>M@S Web Components</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${styleDependecy}
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://p.typekit.net/p.css?s=1&amp;k=hah7vzn&amp;ht=tk&amp;f=7180.7181.7182.7183.22474.22749.22750.22751.22753&amp;a=8634977&amp;app=typekit&amp;e=css">
    <link rel="stylesheet" href="https://use.typekit.net/hah7vzn.css">
    <link rel="stylesheet" href="/studio/con-button.css">
  
  <!-- Include your custom element script as an ES6 module -->
  <script type="module">
    ${initScript}
  </script>${ccdMiniStyles}
  <!-- Include Highlight.js stylesheet for syntax highlighting -->
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
  <script type="module" src="./mas-sidenav.js"></script>
</head>
<body class="spectrum spectrum--medium spectrum--light">
    <aside is="mas-sidenav"></aside>
<main>
${htmlContent}
</main>
<script type="module">
  document.querySelectorAll('code.demo').forEach(el => {
      const targetContainer = document.createElement('div');
      targetContainer.classList.toggle('light', el.classList.contains('light'));
      targetContainer.innerHTML = \`<h4>Demo: </h4><div class="demo-container">\${el.textContent}</div>\`;
      el.parentElement.after(targetContainer);
      // Extract and evaluate <script> tags
      const scriptTags = targetContainer.getElementsByTagName('script');
      for (let i = 0; i < scriptTags.length; i++) {
          const script = document.createElement('script');
          script.type = 'module';
          script.text = scriptTags[i].text;
          document.body.appendChild(script); // Appends to the document to execute
          scriptTags[i].remove(); // Remove the script tag
      }
  });
</script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
console.log('Documentation generated at', outputPath);
