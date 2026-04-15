import path from 'path';
import { globSync } from 'glob';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { Plugin, Package } from './types.js';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');

export function scanPlugins(): Plugin[] {
  const pattern = path.join(REPO_ROOT, 'catalog-entities/extensions/plugins/*.yaml');
  const files = globSync(pattern);

  return files
    .filter((f) => !f.endsWith('all.yaml'))
    .map((f) => parse(readFileSync(f, 'utf-8')) as Plugin)
    .filter((p) => p.kind === 'Plugin');
}

export function scanPackages(): Package[] {
  const pattern = path.join(REPO_ROOT, 'workspaces/*/metadata/*.yaml');
  const files = globSync(pattern);

  return files
    .map((f) => parse(readFileSync(f, 'utf-8')) as Package)
    .filter((p) => p.kind === 'Package');
}
