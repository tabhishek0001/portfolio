// Main App Initialization
/* ============================================================
   APP.JS — Main Orchestrator
   Loads JSON → renders all sections → initializes interactions
   ============================================================ */

(async function init() {
  try {
    // ── 1. LOAD DATA ─────────────────────────────────────────
    const data = await DataLoader.load();

    // ── 2. THEME SETUP ────────────────────────────────────────
    const themeConfig = data.theme || {};
    ThemeManager.init(themeConfig.defaultMode || 'dark', themeConfig.allowToggle !== false);
    if (themeConfig.colors) ThemeManager.applyColors(themeConfig.colors);

    // ── 3. SEO ────────────────────────────────────────────────
    Renderer.renderSEO(data);

    // ── 4. RENDER ALL SECTIONS ────────────────────────────────
    Renderer.renderNavbar(data);
    Renderer.renderHero(data);
    Renderer.renderQuickSummary(data);
    Renderer.renderAbout(data);
    Renderer.renderCareerObjective(data);
    Renderer.renderStats(data);
    Renderer.renderSkills(data);
    Renderer.renderExperience(data);
    Renderer.renderProjects(data);
    Renderer.setProjectsRef(data.sections?.projects?.items || []);
    Renderer.renderCaseStudies(data);
    Renderer.renderAchievements(data);
    Renderer.renderEducation(data);
    Renderer.renderSubjects(data);
    Renderer.renderCertifications(data);
    Renderer.renderTraining(data);
    Renderer.renderServices(data);
    Renderer.renderPhilosophy(data);
    Renderer.renderValues(data);
    Renderer.renderCurrentFocus(data);
    Renderer.renderJourney(data);
    Renderer.renderTestimonials(data);
    Renderer.renderBlog(data);
    Renderer.renderResume(data);
    Renderer.renderContact(data);
    Renderer.renderFooter(data);

    // ── 5. SECTION VISIBILITY ─────────────────────────────────
    applySectionVisibility(data);

    // ── 6. ANIMATIONS & INTERACTIONS ─────────────────────────
    const settings = data.settings || {};

    Animations.initNavbar();
    Animations.initMobileMenu();
    Animations.initBackToTop();
    Animations.initSmoothScroll();

    if (settings.scrollReveal !== false) {
      Animations.initScrollReveal();
    }

    if (settings.enableCounters !== false) {
      Animations.initCounters();
    }

    if (settings.enableTypingAnimation !== false) {
      const typingTexts = data.personal?.typingTexts || [data.personal?.title];
      Animations.initTyping(typingTexts, 'typing-text');
    }

    // ── 7. MODAL ──────────────────────────────────────────────
    Renderer.initModal();

    // ── 8. CONTACT FORM & COPY ────────────────────────────────
    FormHandler.init();
    FormHandler.initCopyButtons();

    // ── 9. PROJECT FILTERS ────────────────────────────────────
    if (settings.enableProjectFilters !== false) {
      Filters.applyFilters();
    }

    // ── 10. PRELOADER HIDE ────────────────────────────────────
    Animations.hidePreloader();

    console.log('%c✓ Portfolio loaded successfully', 'color:#06b6d4;font-weight:bold;');

  } catch (err) {
    console.error('[Portfolio] Failed to load:', err);
    Animations.showError(
      'Portfolio content could not be loaded. Please check that data/portfolio-data.json exists and is valid JSON.\n\nIf testing locally, please use VS Code Live Server or a local server — direct file:// access blocks JSON fetch in most browsers.'
    );
  }
})();

/* ── SECTION VISIBILITY ─────────────────────────────────────── */
function applySectionVisibility(data) {
  const sections = data.sections || {};

  // Map section keys to DOM section IDs
  const sectionIdMap = {
    hero: 'hero',
    quickSummary: 'quick-summary',
    about: 'about',
    careerObjective: 'career-objective',
    stats: 'stats',
    skills: 'skills',
    experience: 'experience',
    projects: 'projects',
    caseStudies: 'case-studies',
    achievements: 'achievements',
    education: 'education',
    subjects: 'subjects',
    certifications: 'certifications',
    training: 'training',
    services: 'services',
    philosophy: 'philosophy',
    values: 'values',
    currentFocus: 'current-focus',
    journey: 'journey',
    testimonials: 'testimonials',
    blog: 'blog',
    resume: 'resume',
    contact: 'contact',
  };

  Object.entries(sectionIdMap).forEach(([key, domId]) => {
    const sec = sections[key];
    if (sec && sec.visible === false) {
      const el = document.getElementById(domId);
      if (el) el.style.display = 'none';
    }
  });
}