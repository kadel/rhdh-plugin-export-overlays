export function layout(
  title: string,
  content: string,
  options: { cssPath: string; jsPath?: string },
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - RHDH Plugin Catalog</title>
  <link rel="stylesheet" href="${options.cssPath}">
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <h1><a href="${options.cssPath.replace('assets/style.css', 'index.html')}">RHDH Plugin Catalog</a></h1>
    </div>
  </header>
  <main class="main">
    ${content}
  </main>
  <footer class="site-footer">
    Red Hat Developer Hub &mdash; Plugin Catalog
  </footer>
  ${options.jsPath ? `<script src="${options.jsPath}"></script>` : ''}
</body>
</html>`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
