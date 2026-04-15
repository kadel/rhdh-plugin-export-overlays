import { Marked } from 'marked';
import { stringify } from 'yaml';
import { scanPlugins, scanPackages } from './src/scanner.js';
import { render } from './src/renderer.js';
import type { Plugin, Package, PluginViewModel, PackageViewModel, Support } from './src/types.js';

const marked = new Marked();

function getSupportLevel(support: Support | string | undefined): string {
  if (!support) return '';
  if (typeof support === 'string') return support;
  return support.level ?? '';
}

function getSupportProvider(support: Support | string | undefined): string {
  if (!support || typeof support === 'string') return '';
  return support.provider ?? '';
}

function buildPackageViewModel(pkg: Package): PackageViewModel {
  const spec = pkg.spec;
  const examples = (spec?.appConfigExamples ?? []).map((ex) => ({
    title: ex.title,
    yaml: stringify(ex.content, { indent: 2 }).trim(),
  }));

  return {
    name: pkg.metadata.name,
    title: pkg.metadata.title ?? pkg.metadata.name,
    packageName: spec?.packageName ?? pkg.metadata.name,
    version: spec?.version ?? '',
    role: spec?.backstage?.role ?? spec?.role ?? '',
    supportLevel: getSupportLevel(spec?.support),
    dynamicArtifact: spec?.dynamicArtifact ?? '',
    backstageVersion: spec?.backstage?.supportedVersions ?? spec?.supportedVersions ?? '',
    appConfigExamples: examples,
  };
}

function buildPluginViewModel(
  plugin: Plugin,
  allPackages: Package[],
): PluginViewModel {
  const spec = plugin.spec;
  const packageNames = spec?.packages ?? [];
  const matchedPackages = allPackages.filter((pkg) =>
    packageNames.includes(pkg.metadata.name),
  );

  const shortDesc =
    plugin.metadata.description ?? spec?.description?.slice(0, 200) ?? '';
  const fullMd = spec?.description ?? '';
  const fullHtml = fullMd ? (marked.parse(fullMd) as string) : '';

  return {
    name: plugin.metadata.name,
    title: plugin.metadata.title ?? plugin.metadata.name,
    shortDescription: shortDesc.replace(/\n/g, ' ').trim(),
    fullDescriptionHtml: fullHtml,
    icon: spec?.icon,
    author: spec?.author ?? spec?.authors?.[0]?.name ?? '',
    publisher: spec?.publisher ?? '',
    supportLevel: getSupportLevel(spec?.support),
    supportProvider: getSupportProvider(spec?.support),
    lifecycle: spec?.lifecycle ?? '',
    categories: spec?.categories ?? [],
    highlights: spec?.highlights ?? [],
    tags: plugin.metadata.tags ?? [],
    links: (plugin.metadata.links ?? []).map((l) => ({
      url: l.url,
      title: l.title ?? l.url,
    })),
    packages: matchedPackages.map(buildPackageViewModel),
  };
}

// Main
const plugins = scanPlugins();
const packages = scanPackages();

console.log(`Scanned ${plugins.length} plugins, ${packages.length} packages`);

const viewModels = plugins.map((p) => buildPluginViewModel(p, packages));

render(viewModels, packages.length);

console.log(`Built ${viewModels.length} plugin pages + index.html → dist/`);
