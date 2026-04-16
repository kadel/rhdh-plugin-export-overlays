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
    return `<img class="detail-icon" src="${plugin.icon}" alt="">`;
  }
  return `<div class="detail-icon-placeholder">&#9654;</div>`;
}

function renderSidebar(plugin: PluginViewModel): string {
  const sections: string[] = [];

  if (plugin.highlights.length > 0) {
    sections.push(`
      <div class="sidebar-section">
        <h3>Highlights</h3>
        <ul>${plugin.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
      </div>`);
  }

  if (plugin.categories.length > 0) {
    sections.push(`
      <div class="sidebar-section">
        <h3>Categories</h3>
        <div class="sidebar-chips">
          ${plugin.categories.map((c) => `<span class="sidebar-chip">${escapeHtml(c)}</span>`).join('')}
        </div>
      </div>`);
  }

  if (plugin.tags.length > 0) {
    sections.push(`
      <div class="sidebar-section">
        <h3>Tags</h3>
        <div class="sidebar-chips">
          ${plugin.tags.map((t) => `<span class="sidebar-chip">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>`);
  }

  sections.push(`
    <div class="sidebar-section">
      <h3>Details</h3>
      <ul>
        ${plugin.author ? `<li><strong>Author:</strong> ${escapeHtml(plugin.author)}</li>` : ''}
        ${plugin.publisher ? `<li><strong>Publisher:</strong> ${escapeHtml(plugin.publisher)}</li>` : ''}
        ${plugin.supportProvider ? `<li><strong>Support:</strong> ${escapeHtml(plugin.supportProvider)}</li>` : ''}
        <li><strong>Lifecycle:</strong> ${escapeHtml(plugin.lifecycle)}</li>
      </ul>
    </div>`);

  if (plugin.links.length > 0) {
    sections.push(`
      <div class="sidebar-section">
        <h3>Links</h3>
        <ul>
          ${plugin.links.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.title)}</a></li>`).join('')}
        </ul>
      </div>`);
  }

  return sections.join('');
}

function renderPackageRow(pkg: PluginViewModel['packages'][0]): string {
  const configHtml = pkg.appConfigExamples.length > 0
    ? pkg.appConfigExamples.map((ex) => `
        <div class="config-block">
          <h4>${escapeHtml(ex.title)}</h4>
          <pre><code>${escapeHtml(ex.yaml)}</code></pre>
        </div>
      `).join('')
    : '';

  const artifactHtml = pkg.dynamicArtifact
    ? `<div class="config-block">
        <h4>OCI Artifact</h4>
        <pre><code>${escapeHtml(pkg.dynamicArtifact)}</code></pre>
      </div>`
    : '';

  return `<tr>
    <td>
      <div class="pkg-name">${escapeHtml(pkg.packageName)}</div>
      ${artifactHtml}
      ${configHtml}
    </td>
    <td>${escapeHtml(pkg.version)}</td>
    <td>${escapeHtml(pkg.role)}</td>
    <td><span class="badge ${badgeClass(pkg.supportLevel)}">${badgeLabel(pkg.supportLevel)}</span></td>
    <td>${escapeHtml(pkg.backstageVersion)}</td>
  </tr>`;
}

function renderPackages(plugin: PluginViewModel): string {
  if (plugin.packages.length === 0) {
    return '<p>No packages linked to this plugin.</p>';
  }

  return `
    <table class="packages-table">
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
          <th>Role</th>
          <th>Support</th>
          <th>Backstage</th>
        </tr>
      </thead>
      <tbody>
        ${plugin.packages.map(renderPackageRow).join('')}
      </tbody>
    </table>`;
}

export function pluginDetailPage(plugin: PluginViewModel): string {
  const content = `
    <div class="breadcrumb">
      <a href="../index.html">Catalog</a> &rsaquo; ${escapeHtml(plugin.title)}
    </div>
    <div class="detail-header">
      ${renderIcon(plugin)}
      <div class="detail-header-text">
        <h2>${escapeHtml(plugin.title)}</h2>
        <div class="detail-header-meta">
          <span class="badge ${badgeClass(plugin.supportLevel)}">${badgeLabel(plugin.supportLevel)}</span>
          ${plugin.author ? `<span>${escapeHtml(plugin.author)}</span>` : ''}
          ${plugin.packages.length > 0 ? `<span>${plugin.packages.length} package${plugin.packages.length > 1 ? 's' : ''}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="detail-layout">
      <aside class="sidebar">
        ${renderSidebar(plugin)}
      </aside>
      <div class="content-area">
        <h3>Description</h3>
        <div class="markdown-content">
          ${plugin.fullDescriptionHtml || `<p>${escapeHtml(plugin.shortDescription)}</p>`}
        </div>
        <h3>Packages</h3>
        ${renderPackages(plugin)}
      </div>
    </div>
  `;

  return layout(plugin.title, content, {
    cssPath: '../assets/style.css',
  });
}
