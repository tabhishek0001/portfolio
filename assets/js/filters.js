// Filters
/* ============================================================
   FILTERS — Project filtering, search with debounce
   ============================================================ */

const Filters = (() => {
  let activeFilter = 'All';
  let searchQuery = '';
  let debounceTimer = null;
  let projectsData = [];

  /**
   * Initialize filter buttons
   */
  function initFilters(filters, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    filters.forEach(filter => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (filter === 'All' ? ' active' : '');
      btn.textContent = filter;
      btn.setAttribute('aria-label', `Filter by ${filter}`);
      btn.addEventListener('click', () => {
        activeFilter = filter;
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
      container.appendChild(btn);
    });
  }

  /**
   * Initialize search input with debounce
   */
  function initSearch(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
      }, 220);
    });
  }

  /**
   * Store projects reference
   */
  function setProjects(projects) {
    projectsData = projects || [];
  }

  /**
   * Apply active filter + search to project cards
   */
  function applyFilters() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.project-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = (card.dataset.categories || '').toLowerCase();
      const name = (card.dataset.name || '').toLowerCase();
      const tech = (card.dataset.tech || '').toLowerCase();
      const type = (card.dataset.type || '').toLowerCase();
      const featured = card.dataset.featured === 'true';

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Featured' && featured) ||
        categories.includes(activeFilter.toLowerCase());

      const matchesSearch =
        !searchQuery ||
        name.includes(searchQuery) ||
        tech.includes(searchQuery) ||
        type.includes(searchQuery) ||
        categories.includes(searchQuery);

      const visible = matchesFilter && matchesSearch;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    // Show no-results message
    let noResults = grid.querySelector('.no-results');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem;opacity:0.3;">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>No projects match your current filter or search.</p>
      `;
      grid.appendChild(noResults);
    }
    noResults.style.display = visibleCount === 0 ? '' : 'none';
  }

  function reset() {
    activeFilter = 'All';
    searchQuery = '';
    applyFilters();
  }

  return { initFilters, initSearch, setProjects, applyFilters, reset };
})();