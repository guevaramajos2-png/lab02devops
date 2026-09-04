// "Build" del sitio: genera public/index.html inyectando la info de versión.
const fs = require('fs');
const path = require('path');
const { buildInfo } = require('./version');

const info = buildInfo(process.env.GITHUB_SHA, new Date().toISOString());
const template = fs.readFileSync(path.join(__dirname, '..', 'public', 'template.html'), 'utf8');
const html = template
  .replace('{{VERSION}}', info.version)
  .replace('{{BUILT_AT}}', info.builtAt);

fs.writeFileSync(path.join(__dirname, '..', 'public', 'index.html'), html);
console.log(`Sitio generado: versión ${info.version}`);
