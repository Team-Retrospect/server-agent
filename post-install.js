const saveFile = require('fs').writeFileSync;

const pkgJsonPath = require.main.paths[0].split('node_modules')[0] + 'package.json';

const json = require(pkgJsonPath);

if (!json.hasOwnProperty('scripts')) {
  json.scripts = {};
}

json.scripts['trace'] = `node -r textrix-server/tracing.js`;

saveFile(pkgJsonPath, JSON.stringify(json, null, 2));