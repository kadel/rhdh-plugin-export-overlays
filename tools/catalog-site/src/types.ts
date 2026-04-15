export interface PluginMetadata {
  name: string;
  namespace?: string;
  title?: string;
  description?: string;
  annotations?: Record<string, string>;
  tags?: string[];
  links?: Array<{ url: string; title?: string }>;
}

export interface PluginSpec {
  icon?: string;
  author?: string;
  authors?: Array<{ name: string; url?: string }>;
  support?: Support;
  packages?: string[];
  categories?: string[];
  highlights?: string[];
  description?: string;
  lifecycle?: string;
  publisher?: string;
}

export interface Plugin {
  apiVersion: string;
  kind: string;
  metadata: PluginMetadata;
  spec?: PluginSpec;
}

export interface PackageBackstage {
  role?: string;
  supportedVersions?: string;
}

export interface PackageSpec {
  packageName?: string;
  version?: string;
  dynamicArtifact?: string;
  author?: string;
  support?: Support | string;
  lifecycle?: string;
  backstage?: PackageBackstage;
  appConfigExamples?: Array<{ title: string; content: unknown }>;
  partOf?: string[];
}

export interface PackageMetadata {
  name: string;
  namespace?: string;
  title?: string;
  description?: string;
  annotations?: Record<string, string>;
  tags?: string[];
  links?: Array<{ url: string; title?: string }>;
}

export interface Package {
  apiVersion: string;
  kind: string;
  metadata: PackageMetadata;
  spec?: PackageSpec;
}

export type Support = {
  provider?: string;
  level?: string;
};

export interface PluginViewModel {
  name: string;
  title: string;
  shortDescription: string;
  fullDescriptionHtml: string;
  icon?: string;
  author: string;
  publisher: string;
  supportLevel: string;
  supportProvider: string;
  lifecycle: string;
  categories: string[];
  highlights: string[];
  tags: string[];
  links: Array<{ url: string; title: string }>;
  packages: PackageViewModel[];
}

export interface PackageViewModel {
  name: string;
  title: string;
  packageName: string;
  version: string;
  role: string;
  supportLevel: string;
  dynamicArtifact: string;
  backstageVersion: string;
  appConfigExamples: Array<{ title: string; yaml: string }>;
}
