import { PluginViewModel } from '../types.js';
import { layout, escapeHtml } from './layout.js';

function badgeClass(level: string): string {
  switch (level) {
    case 'generally-available': return 'badge-ga';
    case 'tech-preview': return 'badge-tech-preview';
    case 'dev-preview': return 'badge-dev-preview';
    case 'community': return 'badge-community';
    default: return 'badge-none';
  }
}

function badgeLabel(level: string): string {
  switch (level) {
    case 'generally-available': return 'GA';
    case 'tech-preview': return 'Tech Preview';
    case 'dev-preview': return 'Dev Preview';
    case 'community': return 'Community';
    default: return level || 'Unknown';
  }
}

function renderIcon(plugin: PluginViewModel): string {
  if (plugin.icon) {
    return `<img class="card-icon" src="${plugin.icon}" alt="">`;
  }
  return `<div class="card-icon-placeholder">&#9654;</div>`;
}

function renderCard(plugin: PluginViewModel): string {
  const cats = plugin.categories.join(',').toLowerCase();
  const searchable = `${plugin.title} ${plugin.shortDescription}`.toLowerCase();

  return `<div class="card"
    data-title="${escapeHtml(searchable)}"
    data-description="${escapeHtml(plugin.shortDescription.toLowerCase())}"
    data-categories="${escapeHtml(cats)}"
    data-support="${escapeHtml(plugin.supportLevel)}">
    <div class="card-header">
      ${renderIcon(plugin)}
      <div>
        <div class="card-title"><a href="plugins/${encodeURIComponent(plugin.name)}.html">${escapeHtml(plugin.title)}</a></div>
      </div>
    </div>
    <div class="card-description">${escapeHtml(plugin.shortDescription)}</div>
    <div class="card-footer">
      <div class="card-meta">
        <span class="badge ${badgeClass(plugin.supportLevel)}">${badgeLabel(plugin.supportLevel)}</span>
        ${plugin.categories[0] ? `<span class="category-chip">${escapeHtml(plugin.categories[0])}</span>` : ''}
        ${plugin.packages[0]?.version ? `<span class="version">v${escapeHtml(plugin.packages[0].version)}</span>` : ''}
      </div>
      <span>${escapeHtml(plugin.author)}</span>
    </div>
  </div>`;
}

export function pluginListPage(
  plugins: PluginViewModel[],
  allCategories: string[],
  allSupportLevels: string[],
  totalPackages: number,
): string {
  const sorted = [...plugins].sort((a, b) => a.title.localeCompare(b.title));

  const categoryOptions = allCategories
    .sort()
    .map((c) => `<option value="${escapeHtml(c.toLowerCase())}">${escapeHtml(c)}</option>`)
    .join('');

  const supportOptions = allSupportLevels
    .sort()
    .map((s) => `<option value="${escapeHtml(s)}">${badgeLabel(s)}</option>`)
    .join('');

  const content = `
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${plugins.length}</div>
        <div class="stat-label">Plugins</div>
      </div>
      <div class="stat">
        <div class="stat-value">${totalPackages}</div>
        <div class="stat-label">Packages</div>
      </div>
    </div>
    <div class="toolbar">
      <input type="text" id="search" class="search-input" placeholder="Search plugins...">
      <select id="filter-category" class="filter-select">
        <option value="">All Categories</option>
        ${categoryOptions}
      </select>
      <select id="filter-support" class="filter-select">
        <option value="">All Support Levels</option>
        ${supportOptions}
      </select>
    </div>
    <div class="card-grid">
      ${sorted.map(renderCard).join('\n')}
    </div>
    <div id="no-results" class="no-results">No plugins match your search.</div>
  `;

  return layout('Plugins', content, {
    cssPath: 'assets/style.css',
    jsPath: 'assets/app.js',
  });
}
