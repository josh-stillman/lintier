import { writeFileSync } from 'fs';
import * as prettier from 'prettier';

import { basePrettierRc } from './src/writeConfigs/basePrettierRc';
import PINNED_VERSIONS from './src/installDependencies/pinnedVersions.json';

const main = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _UPDATED_AT, ...oldPackages } = PINNED_VERSIONS;

  const getLatestVersion = async (packageName: string) => {
    const res = await fetch(
      'https://registry.npmjs.org/' + packageName + '/latest'
    );
    const json = await res.json();

    return json.version;
  };

  const newPackages = {};

  for (const [key, value] of Object.entries(oldPackages)) {
    const newVersion = await getLatestVersion(key);

    if (newVersion && newVersion !== value) {
      newPackages[key] = newVersion;
    }
  }

  console.log({ newPackages });

  if (!Object.keys(newPackages).length) {
    console.error('no new package versions to update, exiting.');
    process.exit(1);
  }

  const newJson = JSON.stringify({
    _UPDATED_AT: new Date().toLocaleDateString(),
    ...oldPackages,
    ...newPackages,
  });

  const formattedJson = await prettier.format(newJson, {
    ...basePrettierRc,
    parser: 'json',
  });

  writeFileSync('./src/installDependencies/pinnedVersions.json', formattedJson);
};

main();
