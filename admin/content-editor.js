/* ============================================================
   CONTENT EDITOR JS
   Load JSON → Edit → Validate → Download
   ============================================================ */

const Editor = (() => {
  let parsedData = null;
  const DATA_PATH = '../data/portfolio-data.json';

  // ── INIT ───────────────────────────────────────────────────
  async function init() {
    await loadJSON();
    initSidebar();
    initToolbar();
    initColorPickers();
    initLiveValidation();
  }

  // ── LOAD JSON ──────────────────────────────────────────────
  async function loadJSON() {
    try {
      const res = await fetch(DATA_PATH + '?t=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      parsedData = json;
      setEditorValue(JSON.stringify(json, null, 2));
      setStatus('JSON loaded successfully', 'ok');
    } catch (err) {
      setStatus('Could not auto-load JSON. Paste it manually in the Full JSON Editor.', 'warning');
      setEditorValue('{\n  // Paste your portfolio-data.json content here\n}');
    }
  }

  // ── EDITOR VALUE ───────────────────────────────────────────
  function setEditorValue(text) {
    const ta = document.getElementById('json-editor');
    if (ta) {
      ta.value = text;
      updateCharCount(text);
    }
  }

  function getEditorValue() {
    return document.getElementById('json-editor')?.value || '';
  }

  // ── VALIDATION ─────────────────────────────────────────────
  function validateJSON(text) {
    try {
      const parsed = JSON.parse(text);
      parsedData = parsed;
      showError('');
      setStatus('Valid JSON — ' + Object.keys(parsed).length + ' top-level keys', 'ok');
      return true;
    } catch (e) {
      showError('JSON Error: ' + e.message);
      setStatus('Invalid JSON — fix errors before downloading', 'error');
      return false;
    }
  }

  function initLiveValidation() {
    const ta = document.getElementById('json-editor');
    if (!ta) return;
    let debounce;
    ta.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const val = ta.value.trim();
        if (val) {
          validateJSON(val);
          updateCharCount(val);
        }
      }, 500);
    });
  }

  function updateCharCount(text) {
    const el = document.getElementById('json-char-count');
    if (el) el.textContent = text.length.toLocaleString() + ' characters';
  }

  function showError(msg) {
    const el = document.getElementById('json-error-msg');
    if (el) el.textContent = msg;
  }

  function setStatus(msg, type) {
    const el = document.getElementById('json-status');
    if (!el) return;
    const dot = el.querySelector('.status-dot');
    el.childNodes[1].textContent = ' ' + msg;
    if (dot) {
      dot.className = 'status-dot';
      if (type === 'error') dot.classList.add('error');
      if (type === 'warning') dot.classList.add('warning');
    }
  }

  // ── SIDEBAR NAV ─────────────────────────────────────────────
  function initSidebar() {
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        switchPanel(panel);

        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const titleMap = {
          json: 'Full JSON Editor',
          personal: 'Personal Information',
          theme: 'Theme & Colors',
          sections: 'Section Visibility',
          stats: 'Stats & Numbers',
          projects: 'Projects',
          skills: 'Skills',
          help: 'How To Use',
        };
        const titleEl = document.getElementById('panel-title');
        if (titleEl) titleEl.textContent = titleMap[panel] || panel;
      });
    });
  }

  function switchPanel(id) {
    document.querySelectorAll('.editor-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (panel) panel.classList.add('active');

    // Load panel-specific data
    if (id === 'personal') loadPersonalPanel();
    if (id === 'theme') loadThemePanel();
    if (id === 'sections') loadSectionsPanel();
    if (id === 'stats') loadStatsPanel();
    if (id === 'projects') loadProjectsPanel();
    if (id === 'skills') loadSkillsPanel();
  }

  // ── TOOLBAR ACTIONS ─────────────────────────────────────────
  function initToolbar() {
    document.getElementById('btn-format')?.addEventListener('click', formatJSON);
    document.getElementById('btn-minify')?.addEventListener('click', minifyJSON);
    document.getElementById('btn-reset')?.addEventListener('click', resetJSON);
    document.getElementById('btn-download')?.addEventListener('click', downloadJSON);
    document.getElementById('btn-apply-personal')?.addEventListener('click', applyPersonal);
    document.getElementById('btn-apply-theme')?.addEventListener('click', applyTheme);
    document.getElementById('btn-apply-sections')?.addEventListener('click', applySections);
    document.getElementById('btn-apply-stats')?.addEventListener('click', applyStats);
    document.getElementById('btn-add-stat')?.addEventListener('click', addStatRow);
  }

  function formatJSON() {
    const val = getEditorValue();
    try {
      const pretty = JSON.stringify(JSON.parse(val), null, 2);
      setEditorValue(pretty);
      setStatus('JSON formatted', 'ok');
    } catch (e) {
      showError('Cannot format: ' + e.message);
    }
  }

  function minifyJSON() {
    const val = getEditorValue();
    try {
      const mini = JSON.stringify(JSON.parse(val));
      setEditorValue(mini);
      setStatus('JSON minified', 'ok');
    } catch (e) {
      showError('Cannot minify: ' + e.message);
    }
  }

  function resetJSON() {
    if (!confirm('Reset to the version loaded from file? Unsaved changes will be lost.')) return;
    loadJSON();
  }

  function downloadJSON() {
    const val = getEditorValue();
    if (!validateJSON(val)) {
      alert('Please fix JSON errors before downloading.');
      return;
    }
    const blob = new Blob([JSON.stringify(JSON.parse(val), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded! Replace data/portfolio-data.json on your hosting.', 'ok');
  }

  // ── COLOR PICKERS ───────────────────────────────────────────
  function initColorPickers() {
    const primaryPicker = document.getElementById('qe-primary-picker');
    const primaryText = document.getElementById('qe-primary');
    const accentPicker = document.getElementById('qe-accent-picker');
    const accentText = document.getElementById('qe-accent');
    const cpPrimary = document.querySelector('.cp-primary');
    const cpAccent = document.querySelector('.cp-accent');

    primaryPicker?.addEventListener('input', () => {
      if (primaryText) primaryText.value = primaryPicker.value;
      if (cpPrimary) cpPrimary.style.background = primaryPicker.value;
    });
    primaryText?.addEventListener('input', () => {
      if (/^#[0-9a-f]{6}$/i.test(primaryText.value)) {
        if (primaryPicker) primaryPicker.value = primaryText.value;
        if (cpPrimary) cpPrimary.style.background = primaryText.value;
      }
    });
    accentPicker?.addEventListener('input', () => {
      if (accentText) accentText.value = accentPicker.value;
      if (cpAccent) cpAccent.style.background = accentPicker.value;
    });
    accentText?.addEventListener('input', () => {
      if (/^#[0-9a-f]{6}$/i.test(accentText.value)) {
        if (accentPicker) accentPicker.value = accentText.value;
        if (cpAccent) cpAccent.style.background = accentText.value;
      }
    });
  }

  // ── PERSONAL PANEL ──────────────────────────────────────────
  function loadPersonalPanel() {
    if (!parsedData) return;
    const p = parsedData.personal || {};
    const s = parsedData.site || {};
    setValue('qe-name', p.name);
    setValue('qe-title', p.title);
    setValue('qe-tagline', p.tagline);
    setValue('qe-email', p.email);
    setValue('qe-phone', p.phone);
    setValue('qe-location', p.location);
    setValue('qe-resume', s.resumePath);
    setValue('qe-availability', p.availability);
    setValue('qe-bio', p.bio);

    const linkedin = (parsedData.socialLinks || []).find(s => s.id === 'linkedin');
    setValue('qe-linkedin', linkedin?.url);
    setValue('qe-portfolio', parsedData.site?.url);
  }

  function applyPersonal() {
    if (!parsedData) { alert('Load or paste JSON first.'); return; }

    if (!parsedData.personal) parsedData.personal = {};
    if (!parsedData.site) parsedData.site = {};

    parsedData.personal.name        = getValue('qe-name');
    parsedData.personal.title       = getValue('qe-title');
    parsedData.personal.tagline     = getValue('qe-tagline');
    parsedData.personal.email       = getValue('qe-email');
    parsedData.personal.phone       = getValue('qe-phone');
    parsedData.personal.location    = getValue('qe-location');
    parsedData.personal.availability= getValue('qe-availability');
    parsedData.personal.bio         = getValue('qe-bio');
    parsedData.site.resumePath      = getValue('qe-resume');
    parsedData.site.url             = getValue('qe-portfolio');

    const linkedinLink = (parsedData.socialLinks || []).find(s => s.id === 'linkedin');
    if (linkedinLink) linkedinLink.url = getValue('qe-linkedin');

    setEditorValue(JSON.stringify(parsedData, null, 2));
    setStatus('Personal info updated', 'ok');
    flashBtn('btn-apply-personal');
  }

  // ── THEME PANEL ─────────────────────────────────────────────
  function loadThemePanel() {
    if (!parsedData?.theme) return;
    const t = parsedData.theme;

    const modeEl = document.getElementById('qe-mode');
    if (modeEl) modeEl.value = t.defaultMode || 'dark';

    const toggleEl = document.getElementById('qe-allow-toggle');
    if (toggleEl) toggleEl.value = String(t.allowToggle !== false);

    const primary = t.colors?.primary || '#2563eb';
    const accent  = t.colors?.accent  || '#06b6d4';

    setValue('qe-primary', primary);
    setValue('qe-accent', accent);

    const pp = document.getElementById('qe-primary-picker');
    const ap = document.getElementById('qe-accent-picker');
    if (pp) pp.value = primary;
    if (ap) ap.value = accent;

    const cpP = document.querySelector('.cp-primary');
    const cpA = document.querySelector('.cp-accent');
    if (cpP) cpP.style.background = primary;
    if (cpA) cpA.style.background = accent;
  }

  function applyTheme() {
    if (!parsedData) { alert('Load or paste JSON first.'); return; }

    if (!parsedData.theme) parsedData.theme = {};
    if (!parsedData.theme.colors) parsedData.theme.colors = {};

    parsedData.theme.defaultMode = document.getElementById('qe-mode')?.value || 'dark';
    parsedData.theme.allowToggle = document.getElementById('qe-allow-toggle')?.value === 'true';
    parsedData.theme.colors.primary = getValue('qe-primary');
    parsedData.theme.colors.accent  = getValue('qe-accent');

    setEditorValue(JSON.stringify(parsedData, null, 2));
    setStatus('Theme updated', 'ok');
    flashBtn('btn-apply-theme');
  }

  // ── SECTIONS PANEL ──────────────────────────────────────────
  const SECTION_LABELS = {
    hero: 'Hero',
    quickSummary: 'Quick Summary',
    about: 'About Me',
    careerObjective: 'Career Objective',
    stats: 'Stats / Impact',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    caseStudies: 'Case Studies',
    achievements: 'Achievements',
    education: 'Education',
    subjects: 'Favourite Subjects',
    certifications: 'Certifications',
    training: 'Training / Internships',
    services: 'Services',
    philosophy: 'Work Philosophy',
    values: 'Values',
    currentFocus: 'Current Focus',
    journey: 'Journey Timeline',
    testimonials: 'Testimonials',
    blog: 'Blog / Insights',
    resume: 'Resume',
    contact: 'Contact',
  };

  function loadSectionsPanel() {
    if (!parsedData?.sections) return;
    const grid = document.getElementById('section-toggles');
    if (!grid) return;

    grid.innerHTML = Object.entries(SECTION_LABELS).map(([key, label]) => {
      const isVisible = parsedData.sections[key]?.visible !== false;
      return `
        <div class="toggle-item">
          <span class="toggle-label">${label}</span>
          <label class="toggle-switch">
            <input type="checkbox" data-section="${key}" ${isVisible ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
      `;
    }).join('');
  }

  function applySections() {
    if (!parsedData) { alert('Load or paste JSON first.'); return; }

    document.querySelectorAll('[data-section]').forEach(checkbox => {
      const key = checkbox.dataset.section;
      if (parsedData.sections[key]) {
        parsedData.sections[key].visible = checkbox.checked;
      }
    });

    setEditorValue(JSON.stringify(parsedData, null, 2));
    setStatus('Section visibility updated', 'ok');
    flashBtn('btn-apply-sections');
  }

  // ── STATS PANEL ─────────────────────────────────────────────
  function loadStatsPanel() {
    if (!parsedData?.sections?.stats?.items) return;
    const list = document.getElementById('stats-editor-list');
    if (!list) return;

    list.innerHTML = '';
    parsedData.sections.stats.items.forEach((stat, i) => {
      list.appendChild(buildStatRow(stat, i));
    });
  }

  function buildStatRow(stat, index) {
    const row = document.createElement('div');
    row.className = 'stat-editor-item';
    row.dataset.index = index;
    row.innerHTML = `
      <div>
        <label>Value</label>
        <input type="number" class="stat-value-input" value="${stat.value || 0}" step="any" />
      </div>
      <div>
        <label>Label</label>
        <input type="text" class="stat-label-input" value="${stat.label || ''}" />
      </div>
      <div>
        <label>Suffix</label>
        <input type="text" class="stat-suffix-input" value="${stat.suffix || ''}" />
      </div>
      <div>
        <label>Description</label>
        <input type="text" class="stat-desc-input" value="${stat.description || ''}" />
      </div>
      <button class="stat-remove-btn" data-index="${index}" title="Remove this stat">✕</button>
    `;
    row.querySelector('.stat-remove-btn').addEventListener('click', () => {
      parsedData.sections.stats.items.splice(index, 1);
      loadStatsPanel();
    });
    return row;
  }

  function addStatRow() {
    if (!parsedData?.sections?.stats) return;
    parsedData.sections.stats.items.push({
      value: 0, suffix: '+', label: 'New Stat', description: 'Description', icon: 'star', prefix: ''
    });
    loadStatsPanel();
  }

  function applyStats() {
    if (!parsedData?.sections?.stats?.items) return;
    const rows = document.querySelectorAll('.stat-editor-item');
    rows.forEach((row, i) => {
      const stat = parsedData.sections.stats.items[i];
      if (!stat) return;
      const val = row.querySelector('.stat-value-input')?.value;
      stat.value    = val ? parseFloat(val) : 0;
      stat.label    = row.querySelector('.stat-label-input')?.value || '';
      stat.suffix   = row.querySelector('.stat-suffix-input')?.value || '';
      stat.description = row.querySelector('.stat-desc-input')?.value || '';
    });

    setEditorValue(JSON.stringify(parsedData, null, 2));
    setStatus('Stats updated', 'ok');
    flashBtn('btn-apply-stats');
  }

  // ── PROJECTS PANEL ───────────────────────────────────────────
  function loadProjectsPanel() {
    if (!parsedData?.sections?.projects?.items) return;
    const list = document.getElementById('projects-editor-list');
    if (!list) return;

    list.innerHTML = parsedData.sections.projects.items.map(proj => {
      const statusClass = proj.status === 'Live' ? 'status-live' : proj.status === 'Ongoing' ? 'status-ongoing' : 'status-work';
      return `
        <div class="project-editor-item">
          <div class="proj-header">
            <span class="proj-name">${proj.name}</span>
            <span class="proj-status ${statusClass}">${proj.status}</span>
          </div>
          <div class="proj-type">${proj.type}</div>
          <div class="proj-tech">
            ${(proj.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          ${proj.url ? `<a href="${proj.url}" target="_blank" style="font-size:0.8rem;color:var(--accent);margin-top:4px;display:inline-block;">↗ ${proj.url}</a>` : ''}
        </div>
      `;
    }).join('');
  }

  // ── SKILLS PANEL ─────────────────────────────────────────────
  function loadSkillsPanel() {
    if (!parsedData?.sections?.skills?.categories) return;
    const list = document.getElementById('skills-editor-list');
    if (!list) return;

    const levelColor = {
      Experienced: 'background:rgba(37,99,235,0.15);color:#60a5fa;',
      Comfortable: 'background:rgba(6,182,212,0.15);color:#22d3ee;',
      Practicing:  'background:rgba(16,185,129,0.15);color:#34d399;',
      Improving:   'background:rgba(245,158,11,0.15);color:#fbbf24;',
      Learning:    'background:rgba(249,115,22,0.15);color:#fb923c;',
    };

    list.innerHTML = parsedData.sections.skills.categories.map(cat => `
      <div class="skill-cat-editor">
        <div class="skill-cat-name">${cat.title}</div>
        <div class="skill-tags">
          ${(cat.skills || []).map(s => `
            <span class="skill-tag" style="${levelColor[s.level] || ''}">${s.name} · ${s.level}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ── HELPERS ──────────────────────────────────────────────────
  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  function getValue(id) {
    return document.getElementById(id)?.value?.trim() || '';
  }

  function flashBtn(id) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = '✓ Applied!';
    btn.style.background = 'rgba(16,185,129,0.2)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 1800);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Editor.init());