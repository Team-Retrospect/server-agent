const saveFile = require('fs').writeFileSync;
const config = require('./config.json')

const pkgJsonPath = require.main.paths[0].split('node_modules')[0] + 'package.json';

const json = require(pkgJsonPath);

if (!json.hasOwnProperty('scripts')) {
  json.scripts = {};
}

// with using cli app to create config file
// json.scripts['trace'] = `node -r textrix-server/tracing.js ${config.rootEntryPoint}`;

// without using a cli app to create config file
json.scripts['trace'] = `node -r textrix-server/tracing.js`;

saveFile(pkgJsonPath, JSON.stringify(json, null, 2));