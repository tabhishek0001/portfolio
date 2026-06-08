// Portfolio Data Loader
/* ============================================================
   DATA LOADER — Fetch and cache portfolio-data.json
   ============================================================ */

const DataLoader = (() => {
  const DATA_PATH = 'data/portfolio-data.json';
  let _cache = null;

  /**
   * Fetch portfolio data from JSON file.
   * Returns cached data on subsequent calls.
   */
  async function load() {
    if (_cache) return _cache;

    const res = await fetch(DATA_PATH + '?v=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}: Could not load portfolio-data.json`);

    const json = await res.json();
    _cache = json;
    return json;
  }

  /**
   * Get a specific section from cached data safely
   */
  function getSection(data, sectionId) {
    return data?.sections?.[sectionId] || null;
  }

  /**
   * Checks visibility flag — defaults to visible if not set
   */
  function isVisible(section) {
    if (!section) return false;
    return section.visible !== false;
  }

  /**
   * Sort sections by their order property
   */
  function sortedSections(sections) {
    return Object.entries(sections)
      .filter(([, sec]) => sec && sec.visible !== false)
      .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
      .map(([key]) => key);
  }

  return { load, getSection, isVisible, sortedSections };
})();