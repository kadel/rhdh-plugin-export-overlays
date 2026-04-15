(() => {
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('filter-category');
  const supportFilter = document.getElementById('filter-support');
  const cards = document.querySelectorAll('.card');
  const noResults = document.getElementById('no-results');

  if (!searchInput) return;

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const support = supportFilter.value;
    let visible = 0;

    cards.forEach((card) => {
      const title = card.dataset.title || '';
      const desc = card.dataset.description || '';
      const cats = card.dataset.categories || '';
      const sup = card.dataset.support || '';

      const matchesSearch = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = !category || cats.split(',').includes(category);
      const matchesSupport = !support || sup === support;

      if (matchesSearch && matchesCategory && matchesSupport) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  supportFilter.addEventListener('change', applyFilters);
})();
