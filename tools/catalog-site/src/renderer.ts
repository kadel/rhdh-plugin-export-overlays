import { mkdirSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import { PluginViewModel } from './types.js';
import { pluginListPage } from './templates/plugin-list.js';
import { pluginDetailPage } from './templates/plugin-detail.js';

const DIST = path.resolve(import.meta.dirname, '../dist');
const ASSETS_SRC = path.resolve(import.meta.dirname, 'assets');

export function render(
  plugins: PluginViewModel[],
  totalPackages: number,
): void {
  mkdirSync(path.join(DIST, 'plugins'), { recursive: true });
  mkdirSync(path.join(DIST, 'assets'), { recursive: true });

  // Collect all distinct categories and support levels
  const categories = [...new Set(plugins.flatMap((p) => p.categories))];
  const supportLevels = [...new Set(plugins.map((p) => p.supportLevel).filter(Boolean))];

  // List page
  const listHtml = pluginListPage(plugins, categories, supportLevels, totalPackages);
  writeFileSync(path.join(DIST, 'index.html'), listHtml);

  // Detail pages
  for (const plugin of plugins) {
    const html = pluginDetailPage(plugin);
    writeFileSync(path.join(DIST, 'plugins', `${plugin.name}.html`), html);
  }

  // Copy static assets
  copyFileSync(path.join(ASSETS_SRC, 'style.css'), path.join(DIST, 'assets', 'style.css'));
  copyFileSync(path.join(ASSETS_SRC, 'app.js'), path.join(DIST, 'assets', 'app.js'));
}
