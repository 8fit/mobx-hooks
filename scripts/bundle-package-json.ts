import { resolve } from 'path';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs';

const sourcePackageJsonPath = resolve(__dirname, '../package.json');
const distPackageJsonPath = resolve(__dirname, '../dist/package.json');
const readAttributes = [
  'name',
  'version',
  'license',
  'dependencies',
  'peerDependencies',
];
const moduleSources = {
  main: './index.js',
  module: './index.module.js',
  typings: './index.d.ts',
};

const bundlePackageJson = async () => {
  const packageJson = JSON.parse(
    await promisify(readFile)(sourcePackageJsonPath, 'utf-8'),
  );

  const filtered = readAttributes.reduce((acc, attribute) => {
    acc[attribute] = packageJson[attribute];
    return acc;
  }, {} as { [key: string]: unknown });

  return promisify(writeFile)(
    distPackageJsonPath,
    JSON.stringify({ ...filtered, ...moduleSources }, null, 2),
    'utf-8',
  );
};

bundlePackageJson();
