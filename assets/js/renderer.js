// Dynamic Section Renderer
/* ============================================================
   RENDERER — Builds all DOM sections from portfolio-data.json
   Pure functions. No hardcoded content.
   ============================================================ */

const Renderer = (() => {

  /* ── ICON SVG HELPER ────────────────────────────────────────── */
  const ICONS = {
    code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    'code-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    'trending-up': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    award: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    target: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    server: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    layers: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    plug: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"/></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    database: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
    'git-branch': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    'book-open': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    'graduation-cap': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'user-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
    'mouse-pointer': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>`,
    'dollar-sign': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    layout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    'maximize-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    repeat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    coffee: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
    brain: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
    'message-square': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    'bar-chart-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    'credit-card': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="22" height="16" x="1" y="4" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    'git-pull-request': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>`,
    'shopping-cart': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    'layout-dashboard': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91A16 16 0 0 0 14 15.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    'message-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
    'external-link': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    'chevron-up': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
    'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  };

  function icon(name, size = 20) {
    const svg = ICONS[name] || ICONS['code'];
    return svg.replace(/width="24" height="24"/, `width="${size}" height="${size}"`);
  }

  /* ── SAFE TEXT ──────────────────────────────────────────────── */
  function safe(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── SEO META TAGS ──────────────────────────────────────────── */
  function renderSEO(data) {
    const seo = data.seo || {};
    const personal = data.personal || {};

    document.title = seo.title || `${personal.name} | Portfolio`;

    setMeta('description', seo.description);
    setMeta('keywords', (seo.keywords || []).join(', '));
    setMeta('author', seo.author || personal.name);

    // OG
    if (seo.openGraph) {
      const og = seo.openGraph;
      setMetaProperty('og:title', og.title);
      setMetaProperty('og:description', og.description);
      setMetaProperty('og:image', og.image);
      setMetaProperty('og:url', og.url || data.site?.url);
      setMetaProperty('og:type', og.type || 'website');
    }

    // Twitter
    if (seo.twitter) {
      const tw = seo.twitter;
      setMetaName('twitter:card', tw.card || 'summary_large_image');
      setMetaName('twitter:title', tw.title);
      setMetaName('twitter:description', tw.description);
      setMetaName('twitter:image', tw.image);
    }

    // JSON-LD Schema
    if (seo.schema) {
      const s = seo.schema;
      const schema = {
        '@context': 'https://schema.org',
        '@type': s.type || 'Person',
        name: s.name,
        jobTitle: s.jobTitle,
        url: s.url,
        email: s.email,
        telephone: s.telephone,
        address: s.address ? { '@type': 'PostalAddress', ...s.address } : undefined,
        sameAs: s.sameAs,
        alumniOf: s.alumniOf,
        knowsAbout: s.knowsAbout,
        description: s.description,
      };
      let ld = document.getElementById('json-ld-schema');
      if (!ld) {
        ld = document.createElement('script');
        ld.id = 'json-ld-schema';
        ld.type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(schema, null, 2);
    }
  }

  function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
  }

  function setMetaProperty(property, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }

  function setMetaName(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
  }

  /* ── NAVBAR ─────────────────────────────────────────────────── */
  function renderNavbar(data) {
    const nav = data.navigation || [];
    const personal = data.personal || {};
    const resume = data.site?.resumePath || '#';

    const logoEl = document.getElementById('nav-logo');
    if (logoEl) logoEl.textContent = personal.name || 'Portfolio';

    const linksEl = document.getElementById('nav-links');
    const mobileEl = document.getElementById('mobile-menu');

    const sorted = nav.filter(n => n.visible !== false).sort((a, b) => a.order - b.order);

    if (linksEl) {
      linksEl.innerHTML = sorted.map(item => `
        <a class="nav-link" href="${safe(item.href)}" aria-label="${safe(item.label)}">${safe(item.label)}</a>
      `).join('');
    }

    if (mobileEl) {
      mobileEl.innerHTML = sorted.map(item => `
        <a class="mobile-nav-link" href="${safe(item.href)}">${safe(item.label)}</a>
      `).join('') + `
        <a class="btn btn-primary btn-sm" href="${safe(resume)}" download style="margin-top:0.5rem;">
          ${icon('download', 16)} Download Resume
        </a>
      `;
    }
  }

  /* ── HERO SECTION ───────────────────────────────────────────── */
  function renderHero(data) {
    const p = data.personal || {};
    const hero = data.sections?.hero || {};
    const site = data.site || {};

    const wrap = document.getElementById('hero-content');
    if (!wrap) return;

    const badges = (hero.badges || []).map(b => `
      <span class="hero-badge">${icon(b.icon, 14)} ${safe(b.text)}</span>
    `).join('');

    const ctas = (hero.cta || []).map(c => {
      const attrs = c.download ? 'download' : '';
      const target = c.target ? `target="${safe(c.target)}" rel="noopener noreferrer"` : '';
      return `
        <a href="${safe(c.href)}" class="btn btn-${safe(c.style)}" ${attrs} ${target}>
          ${icon(c.icon || 'code', 18)} ${safe(c.label)}
        </a>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="hero-content reveal">
        <div class="hero-status">
          <span class="hero-status-dot"></span>
          ${safe(p.status || 'Available for Opportunities')}
        </div>
        <div class="hero-greeting">Hello, World!</div>
        <h1 class="hero-name">Hi, I'm<br><span class="text-gradient">${safe(p.name)}</span></h1>
        <div class="hero-typing-wrapper">
          <span class="hero-typing-label">I am a</span>
          <span class="hero-typing-text" id="typing-text"></span>
          <span class="hero-typing-cursor" aria-hidden="true"></span>
        </div>
        <p class="hero-tagline">${safe(p.tagline)}</p>
        <div class="hero-badges">${badges}</div>
        <div class="hero-cta">${ctas}</div>
      </div>
      <div class="hero-card-wrapper reveal-right">
        ${buildDevCard(p)}
        ${buildCodeCard(p)}
      </div>
    `;
  }

  function buildDevCard(p) {
      const profileImage = p.profileImage ? safe(p.profileImage) : '';
      const fallbackInitial = safe((p.firstName || p.name || 'A')[0]);
    
      const avatarHtml = profileImage
        ? `
          <div class="dev-avatar dev-avatar-img-wrap">
            <img 
              src="${profileImage}" 
              alt="${safe(p.name || 'Profile image')}" 
              class="dev-avatar-img"
              loading="lazy"
            >
          </div>
        `
        : `<div class="dev-avatar">${fallbackInitial}</div>`;
    
      return `
        <div class="dev-card">
          <div class="dev-card-top">
            ${avatarHtml}
            <div>
              <div class="dev-card-name">${safe(p.name)}</div>
              <div class="dev-card-role">${safe(p.title)}</div>
            </div>
          </div>
    
          <div class="dev-info-rows">
            <div class="dev-info-row">
              <span class="dev-info-label">${icon('map-pin', 14)} Location</span>
              <span class="dev-info-value">${safe(p.location)}</span>
            </div>
    
            <div class="dev-info-row">
              <span class="dev-info-label">${icon('mail', 14)} Email</span>
              <span class="dev-info-value">
                <a href="mailto:${safe(p.email)}" style="color:var(--clr-accent);">
                  ${safe(p.email)}
                </a>
              </span>
            </div>
    
            <div class="dev-info-row">
              <span class="dev-info-label">${icon('target', 14)} Focus</span>
              <span class="dev-info-value">${safe(p.currentFocusShort)}</span>
            </div>
    
            <div class="dev-info-row">
              <span class="dev-info-label">${icon('briefcase', 14)} Open For</span>
              <span class="dev-info-value"><strong>${safe(p.availability)}</strong></span>
            </div>
          </div>
        </div>
      `;
    }

  function buildCodeCard(p) {
    return `
      <div class="code-card">
        <div class="code-card-header">
          <div class="code-dots">
            <span class="code-dot"></span>
            <span class="code-dot"></span>
            <span class="code-dot"></span>
          </div>
          <span class="code-filename">developer.json</span>
        </div>
        <span class="code-line"><span class="code-keyword">const</span> <span class="code-value">developer</span> = {</span>
        <span class="code-line">  <span class="code-key">"name"</span>: <span class="code-string">"${safe(p.name)}"</span>,</span>
        <span class="code-line">  <span class="code-key">"role"</span>: <span class="code-string">"Full Stack Developer"</span>,</span>
        <span class="code-line">  <span class="code-key">"stack"</span>: [<span class="code-string">"PHP"</span>, <span class="code-string">"MySQL"</span>, <span class="code-string">"JS"</span>],</span>
        <span class="code-line">  <span class="code-key">"users"</span>: <span class="code-num">20000</span>,  <span class="code-comment">// yearly</span></span>
        <span class="code-line">  <span class="code-key">"mindset"</span>: <span class="code-string">"Learn by Building"</span>,</span>
        <span class="code-line">  <span class="code-key">"openTo"</span>: <span class="code-string">"Opportunities"</span></span>
        <span class="code-line">};</span>
      </div>
    `;
  }

  /* ── QUICK SUMMARY ──────────────────────────────────────────── */
  function renderQuickSummary(data) {
    const sec = data.sections?.quickSummary;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('quick-summary');
    if (!el) return;

    const header = el.querySelector('.section-header');
    if (header) {
      header.querySelector('.section-title').textContent = sec.title;
      header.querySelector('.section-subtitle').textContent = sec.subtitle;
    }

    const grid = document.getElementById('summary-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((item, i) => `
      <div class="summary-card reveal delay-${Math.min(i+1, 6)}">
        <div class="summary-icon">${icon(item.icon, 18)}</div>
        <div>
          <div class="summary-label">${safe(item.label)}</div>
          <div class="summary-value">${safe(item.value)}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── ABOUT ──────────────────────────────────────────────────── */
  function renderAbout(data) {
    const sec = data.sections?.about;
    const p = data.personal || {};
    if (!sec || sec.visible === false) return;

    const bioEl = document.getElementById('about-bio');
    if (bioEl) {
      bioEl.innerHTML = (p.bio || '').split('\n\n').map(para => `<p>${safe(para)}</p>`).join('');
    }

    const valuesEl = document.getElementById('about-values');
    if (valuesEl) {
      valuesEl.innerHTML = (sec.values || []).map(v => `
        <span class="value-chip">${icon(v.icon, 14)} ${safe(v.label)}</span>
      `).join('');
    }

    const diffEl = document.getElementById('about-differentiators');
    if (diffEl) {
      diffEl.innerHTML = (sec.differentiators || []).map((d, i) => `
        <div class="diff-card reveal delay-${Math.min(i+1, 6)}">
          <div class="diff-icon">${icon(d.icon, 18)}</div>
          <div>
            <div class="diff-title">${safe(d.title)}</div>
            <div class="diff-desc">${safe(d.description)}</div>
          </div>
        </div>
      `).join('');
    }
  }

  /* ── CAREER OBJECTIVE ───────────────────────────────────────── */
  function renderCareerObjective(data) {
    const sec = data.sections?.careerObjective;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('objective-text');
    if (el) el.textContent = sec.content;
  }

  /* ── STATS ──────────────────────────────────────────────────── */
  function renderStats(data) {
    const sec = data.sections?.stats;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('stats-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((s, i) => `
      <div class="stat-card reveal delay-${Math.min(i+1, 6)}">
        <div class="stat-icon">${icon(s.icon, 20)}</div>
        <div class="stat-value"
          data-count="${s.value}"
          data-suffix="${safe(s.suffix || '')}"
          data-prefix="${safe(s.prefix || '')}"
        >${safe(s.prefix)}${s.value}${safe(s.suffix)}</div>
        <div class="stat-label">${safe(s.label)}</div>
        <div class="stat-desc">${safe(s.description)}</div>
      </div>
    `).join('');
  }

  /* ── SKILLS ─────────────────────────────────────────────────── */
  function renderSkills(data) {
    const sec = data.sections?.skills;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    grid.innerHTML = (sec.categories || []).map((cat, ci) => `
      <div class="skill-category-card reveal delay-${Math.min(ci+1, 6)}">
        <div class="skill-cat-header">
          <div class="skill-cat-icon">${icon(cat.icon, 20)}</div>
          <div class="skill-cat-title">${safe(cat.title)}</div>
        </div>
        <div class="skills-list">
          ${(cat.skills || []).map(skill => `
            <div class="skill-item">
              <span class="skill-name">${safe(skill.name)}</span>
              <span class="badge level-${safe(skill.level.toLowerCase())}">${safe(skill.level)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Legend
    const legend = document.getElementById('skills-legend');
    if (legend) {
      const levels = ['Experienced', 'Comfortable', 'Practicing', 'Improving', 'Learning'];
      legend.innerHTML = levels.map(l => `
        <span class="badge level-${l.toLowerCase()}">${l}</span>
      `).join('');
    }
  }

  /* ── EXPERIENCE ─────────────────────────────────────────────── */
  function renderExperience(data) {
    const sec = data.sections?.experience;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('experience-timeline');
    if (!el) return;

    el.innerHTML = (sec.items || []).map((exp, i) => `
      <div class="timeline-item reveal">
        <div class="timeline-dot ${exp.status === 'Current' ? 'active' : ''}"></div>
        <div class="exp-card">
          <div class="exp-card-header">
            <div>
              <div class="exp-role">${safe(exp.role)}</div>
              <div class="exp-company">${safe(exp.company)}</div>
            </div>
            <div class="exp-meta">
              <span class="exp-duration">${safe(exp.duration)}</span>
              <span class="exp-type-badge">${safe(exp.type)}</span>
            </div>
          </div>
          <p class="exp-summary">${safe(exp.summary)}</p>
          <div class="exp-details">
            <div>
              <h5>Responsibilities</h5>
              <ul>${(exp.responsibilities || []).map(r => `<li>${safe(r)}</li>`).join('')}</ul>
            </div>
            <div>
              <h5>Impact</h5>
              <ul>${(exp.impact || []).map(r => `<li>${safe(r)}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="exp-tech">
            ${(exp.tech || []).map(t => `<span class="badge badge-blue">${safe(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ── PROJECTS ───────────────────────────────────────────────── */
  function renderProjects(data) {
    const sec = data.sections?.projects;
    if (!sec || sec.visible === false) return;

    // Filters
    Filters.initFilters(sec.filters || ['All'], 'project-filters');
    Filters.initSearch('project-search');
    Filters.setProjects(sec.items || []);

    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map(proj => buildProjectCard(proj)).join('');

    // Modal open on card click
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // don't intercept link clicks
        const id = card.dataset.id;
        const project = (sec.items || []).find(p => p.id === id);
        if (project) openProjectModal(project);
      });
    });
  }

  function buildProjectCard(proj) {
    const isFeatured = proj.featured;
    const statusClass = {
      'Live': 'status-live',
      'Ongoing': 'status-ongoing',
      'Work Experience Project': 'status-work-experience',
    }[proj.status] || 'status-live';

    const catStr = (proj.categories || []).join(', ').toLowerCase();
    const techStr = (proj.tech || []).join(', ').toLowerCase();

    const imagePath = proj.image ? safe(proj.image) : "assets/images/projects/placeholder.png";
    const projectName = proj.name ? safe(proj.name) : "Project";
    const projectStatus = proj.status ? safe(proj.status) : "Project";
    
    const imageHtml = `
      <div class="project-image">
        <img
          src="${imagePath}"
          alt="${projectName} preview"
          loading="lazy"
          class="project-preview-image"
          onerror="this.onerror=null; this.src='assets/images/projects/placeholder.png';"
        >
    
        ${projectStatus ? `
          <span class="project-status ${statusClass}">
            ${projectStatus}
          </span>
        ` : ""}
    
        ${isFeatured ? `
          <span class="project-featured-badge">
            ${icon("star", 12)} Featured
          </span>
        ` : ""}
      </div>
    `;

    const metricsHtml = proj.metrics?.length
      ? `<div class="project-metrics">${proj.metrics.map(m => `
          <span class="metric-chip"><strong>${safe(m.value)}</strong> ${safe(m.label)}</span>
        `).join('')}</div>`
      : '';

    const actionsHtml = `
      <div class="project-actions">
        ${proj.url ? `<a href="${safe(proj.url)}" class="project-link-btn primary" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
          ${icon('external-link', 14)} View Live
        </a>` : ''}
        <button class="project-link-btn secondary" onclick="event.stopPropagation(); window.Renderer.openProjectModalById('${safe(proj.id)}')">
          ${icon('folder', 14)} Details
        </button>
      </div>
    `;

    return `
      <div class="project-card ${isFeatured ? 'featured' : ''} reveal"
        data-id="${safe(proj.id)}"
        data-categories="${catStr}"
        data-name="${safe(proj.name).toLowerCase()}"
        data-tech="${techStr}"
        data-type="${safe(proj.type).toLowerCase()}"
        data-featured="${isFeatured ? 'true' : 'false'}"
        role="article"
        aria-label="${safe(proj.name)} project"
        tabindex="0">
        ${imageHtml}
        <div class="project-body">
          <div class="project-categories">
            ${(proj.categories || []).map(c => `<span class="badge badge-cyan">${safe(c)}</span>`).join('')}
          </div>
          <h3 class="project-name">${safe(proj.name)}</h3>
          <div class="project-type">${safe(proj.role || proj.type)}</div>
          <p class="project-desc">${safe(proj.shortDescription)}</p>
          ${metricsHtml}
          <div class="project-tech">
            ${(proj.tech || []).map(t => `<span class="badge badge-blue">${safe(t)}</span>`).join('')}
          </div>
          ${actionsHtml}
        </div>
      </div>
    `;
  }

  let _projectsData = null;

  function openProjectModalById(id) {
    if (!_projectsData) return;
    const project = _projectsData.find(p => p.id === id);
    if (project) openProjectModal(project);
  }

  function openProjectModal(proj) {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;

    const body = overlay.querySelector('.modal-body');
    const imageEl = overlay.querySelector('.modal-image');

    if (imageEl) {
      if (proj.image) {
        imageEl.innerHTML = `
          <img 
            src="${safe(proj.image)}" 
            alt="${safe(proj.name)}" 
            loading="lazy"
          >
        `;
    
        const img = imageEl.querySelector("img");
    
        img.addEventListener("error", function () {
          imageEl.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;opacity:0.3;">
              ${icon("folder", 48)}
            </div>
          `;
        });
      } else {
        imageEl.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;opacity:0.3;">
            ${icon("folder", 48)}
          </div>
        `;
      }
    }

    if (body) {
      const metricsHtml = proj.metrics?.length
        ? `<div class="modal-section">
            <h4>Metrics & Impact</h4>
            <div class="modal-metrics">
              ${proj.metrics.map(m => `<span class="modal-metric"><strong>${safe(m.value)}</strong> ${safe(m.label)}</span>`).join('')}
            </div>
          </div>`
        : '';

      const learningHtml = proj.learning
        ? `<div class="modal-section">
            <h4>What I Learned</h4>
            <div class="modal-learning">${safe(proj.learning)}</div>
          </div>`
        : '';

      body.innerHTML = `
        <div class="project-categories">${(proj.categories || []).map(c => `<span class="badge badge-cyan">${safe(c)}</span>`).join('')}</div>
        <h2 class="modal-title">${safe(proj.name)}</h2>
        <div class="modal-type">${safe(proj.role || proj.type)} — <span style="color:var(--text-muted)">${safe(proj.status)}</span></div>

        <div class="modal-section">
          <h4>About This Project</h4>
          <p class="modal-desc">${safe(proj.detailedDescription)}</p>
        </div>

        ${proj.features?.length ? `
        <div class="modal-section">
          <h4>Key Features</h4>
          <div class="modal-features">
            ${proj.features.map(f => `<span class="modal-feature-item">${safe(f)}</span>`).join('')}
          </div>
        </div>` : ''}

        ${metricsHtml}

        <div class="modal-section">
          <h4>Tech Stack</h4>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            ${(proj.tech || []).map(t => `<span class="badge badge-blue">${safe(t)}</span>`).join('')}
          </div>
        </div>

        ${learningHtml}

        ${proj.url ? `<div style="margin-top:1.5rem;">
          <a href="${safe(proj.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            ${icon('external-link', 18)} Visit Live Project
          </a>
        </div>` : ''}
      `;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-close')?.focus();
  }

  function initModal() {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-close')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  function closeModal() {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── CASE STUDIES ───────────────────────────────────────────── */
  function renderCaseStudies(data) {
    const sec = data.sections?.caseStudies;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('case-studies-content');
    if (!el) return;

    el.innerHTML = (sec.items || []).map(cs => `
      <div class="case-study-card reveal">
        <div class="case-study-header">
          <h3 class="case-study-title">${safe(cs.title)}</h3>
          <div class="project-tech">
            ${(cs.tech || []).map(t => `<span class="badge badge-blue">${safe(t)}</span>`).join('')}
          </div>
        </div>
        <div class="case-grid">
          <div class="case-section">
            <h4>The Problem</h4>
            <p>${safe(cs.problem)}</p>
          </div>
          <div class="case-section">
            <h4>The Goal</h4>
            <p>${safe(cs.goal)}</p>
          </div>
          <div class="case-section">
            <h4>My Role</h4>
            <p>${safe(cs.role)}</p>
          </div>
          <div class="case-section">
            <h4>Challenges</h4>
            <ul>${(cs.challenges || []).map(c => `<li>${safe(c)}</li>`).join('')}</ul>
          </div>
          <div class="case-section">
            <h4>Solution</h4>
            <p>${safe(cs.solution)}</p>
          </div>
          <div class="case-section">
            <h4>Impact</h4>
            <ul>${(cs.impact || []).map(i => `<li>${safe(i)}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="modal-section" style="margin-top:1.5rem;">
          <h4>What I Learned</h4>
          <div class="modal-learning">${safe(cs.learning)}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── ACHIEVEMENTS ───────────────────────────────────────────── */
  function renderAchievements(data) {
    const sec = data.sections?.achievements;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((a, i) => `
      <div class="achievement-card reveal delay-${Math.min(i+1, 6)}">
        <div class="achievement-icon">${icon(a.icon, 22)}</div>
        <div>
          <div class="achievement-title">${safe(a.title)}</div>
          <div class="achievement-desc">${safe(a.description)}</div>
          <span class="achievement-category">${safe(a.category)}</span>
          ${a.proof ? `<a href="${safe(a.proof)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-accent" style="margin-top:0.75rem;display:inline-flex;font-size:0.75rem;">${icon('external-link', 14)} View</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* ── EDUCATION ──────────────────────────────────────────────── */
  function renderEducation(data) {
    const sec = data.sections?.education;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('education-grid');
    if (grid) {
      grid.innerHTML = (sec.items || []).map(edu => `
        <div class="edu-card ${edu.current ? 'current' : ''} reveal">
          <div class="edu-icon">${icon(edu.icon || 'graduation-cap', 22)}</div>
          <div class="edu-degree">${safe(edu.degree)}</div>
          ${edu.branch ? `<div class="edu-branch">${safe(edu.branch)}</div>` : ''}
          ${edu.institute ? `<div class="edu-institute">${safe(edu.institute)}</div>` : ''}
          ${edu.duration ? `<div style="font-size:0.8125rem;color:var(--text-muted);margin-top:4px;">${safe(edu.duration)}</div>` : ''}
          ${edu.grade ? `<span class="edu-grade">${safe(edu.grade)}</span>` : ''}
          ${edu.status === 'Pursuing' && !edu.grade ? `<span class="edu-grade" style="background:rgba(37,99,235,0.1);border-color:rgba(37,99,235,0.3);color:var(--clr-primary);">${safe(edu.status)}</span>` : ''}
        </div>
      `).join('');
    }

    const summary = document.getElementById('education-summary');
    if (summary) summary.textContent = sec.summary || '';
  }

  /* ── SUBJECTS ───────────────────────────────────────────────── */
  function renderSubjects(data) {
    const sec = data.sections?.subjects;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('subjects-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((s, i) => `
      <div class="subject-card reveal delay-${Math.min(i+1, 6)}">
        <div class="subject-icon">${icon(s.icon, 24)}</div>
        <div class="subject-name">${safe(s.name)}</div>
        <div class="subject-why">${safe(s.whyILikeIt)}</div>
        <div class="subject-applied">
          <strong>Where I Applied It</strong>
          ${safe(s.whereApplied)}
        </div>
      </div>
    `).join('');
  }

  /* ── CERTIFICATIONS ─────────────────────────────────────────── */
  function renderCertifications(data) {
    const sec = data.sections?.certifications;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    const visible = (sec.items || []).filter(c => c.visible !== false);

    grid.innerHTML = visible.map((c, i) => `
      <div class="cert-card reveal delay-${Math.min(i+1, 6)}">
        <div class="cert-header">
          <div class="cert-icon">${icon('award', 20)}</div>
          <div>
            <div class="cert-title">${safe(c.title)}</div>
            <div class="cert-issuer">${safe(c.issuer)}</div>
          </div>
        </div>
        <div class="cert-category">${safe(c.category)}</div>
        <div class="cert-desc">${safe(c.description)}</div>
        ${c.credentialLink ? `<a href="${safe(c.credentialLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-accent" style="margin-top:auto;">${icon('external-link', 14)} View Credential</a>` : ''}
      </div>
    `).join('');
  }

  /* ── TRAINING ───────────────────────────────────────────────── */
  function renderTraining(data) {
    const sec = data.sections?.training;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('training-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((t, i) => `
      <div class="training-card reveal delay-${Math.min(i+1, 6)}">
        <span class="training-type-badge">${safe(t.type)}</span>
        <div class="training-title">${safe(t.title)}</div>
        <div class="training-desc">${safe(t.description)}</div>
        <div class="training-skills">
          ${(t.skills || []).map(s => `<span class="badge badge-cyan">${safe(s)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  /* ── SERVICES ───────────────────────────────────────────────── */
  function renderServices(data) {
    const sec = data.sections?.services;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((s, i) => `
      <div class="service-card reveal delay-${Math.min((i % 6) + 1, 6)}">
        <div class="service-icon">${icon(s.icon, 26)}</div>
        <div class="service-title">${safe(s.title)}</div>
        <div class="service-desc">${safe(s.description)}</div>
      </div>
    `).join('');
  }

  /* ── PHILOSOPHY ─────────────────────────────────────────────── */
  function renderPhilosophy(data) {
    const sec = data.sections?.philosophy;
    if (!sec || sec.visible === false) return;

    const mainEl = document.getElementById('philosophy-main');
    if (mainEl) mainEl.textContent = sec.mainLine;

    const flowEl = document.getElementById('process-flow');
    if (!flowEl) return;

    flowEl.innerHTML = (sec.process || []).map(step => `
      <div class="process-step reveal">
        <div class="process-num">${icon(step.icon, 24)}</div>
        <div class="process-step-label">${safe(step.title)}</div>
        <div class="process-step-desc">${safe(step.description)}</div>
      </div>
    `).join('');
  }

  /* ── VALUES ─────────────────────────────────────────────────── */
  function renderValues(data) {
    const sec = data.sections?.values;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('values-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((v, i) => `
      <div class="value-card reveal delay-${Math.min(i+1, 6)}">
        <div class="value-icon">${icon(v.icon, 24)}</div>
        <div class="value-label">${safe(v.label)}</div>
        <div class="value-desc">${safe(v.description)}</div>
      </div>
    `).join('');
  }

  /* ── CURRENT FOCUS ──────────────────────────────────────────── */
  function renderCurrentFocus(data) {
    const sec = data.sections?.currentFocus;
    if (!sec || sec.visible === false) return;

    const grid = document.getElementById('focus-grid');
    if (!grid) return;

    grid.innerHTML = (sec.items || []).map((f, i) => `
      <div class="focus-card reveal delay-${Math.min(i+1, 6)}">
        <div class="focus-icon">${icon(f.icon, 20)}</div>
        <div>
          <div class="focus-title">${safe(f.title)}</div>
          <div class="focus-desc">${safe(f.description)}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── JOURNEY ────────────────────────────────────────────────── */
  function renderJourney(data) {
    const sec = data.sections?.journey;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('journey-timeline');
    if (!el) return;

    el.innerHTML = (sec.items || []).map((item, i) => {
      const isOdd = i % 2 === 0;
      const contentHtml = `
        <div class="journey-content">
          <div class="journey-year">${safe(item.year)}</div>
          <div class="journey-title">${safe(item.title)}</div>
          <div class="journey-desc">${safe(item.description)}</div>
        </div>
      `;
      const dotHtml = `
        <div class="journey-dot journey-dot-wrap">
          <div class="journey-dot-inner">${icon(item.icon, 20)}</div>
        </div>
      `;
      return `
        <div class="journey-item reveal">
          ${isOdd ? contentHtml : '<div class="journey-empty"></div>'}
          ${dotHtml}
          ${isOdd ? '<div class="journey-empty"></div>' : contentHtml}
        </div>
      `;
    }).join('');
  }

  /* ── TESTIMONIALS ───────────────────────────────────────────── */
  function renderTestimonials(data) {
    const sec = data.sections?.testimonials;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('testimonials-content');
    if (!el) return;

    const visible = (sec.items || []).filter(t => t.visible !== false);
    if (!visible.length) {
      el.innerHTML = `<div class="testimonials-placeholder">${safe(sec.placeholder || 'Recommendations will be added soon.')}</div>`;
      return;
    }

    el.innerHTML = visible.map(t => `
      <div class="card reveal">
        <p style="font-style:italic;color:var(--text-secondary);margin-bottom:1rem;">"${safe(t.message)}"</p>
        <div style="font-weight:700;">${safe(t.name)}</div>
        <div style="font-size:0.875rem;color:var(--text-muted);">${safe(t.role)}${t.company ? `, ${safe(t.company)}` : ''}</div>
      </div>
    `).join('');
  }

  /* ── BLOG ───────────────────────────────────────────────────── */
  function renderBlog(data) {
    const sec = data.sections?.blog;
    if (!sec || sec.visible === false) return;

    const el = document.getElementById('blog-content');
    if (!el) return;

    if (!sec.items?.length) {
      el.innerHTML = `<div class="blog-placeholder">${safe(sec.placeholder || 'Articles coming soon.')}</div>`;
    }
  }

  /* ── RESUME ─────────────────────────────────────────────────── */
  function renderResume(data) {
    const sec = data.sections?.resume;
    const site = data.site || {};
    if (!sec || sec.visible === false) return;

    const highlights = document.getElementById('resume-highlights');
    if (highlights) {
      highlights.innerHTML = (sec.highlights || []).map(h => `
        <div class="resume-highlight">${safe(h)}</div>
      `).join('');
    }

    const resumePath = sec.resumePath || site.resumePath || '#';
    const dlBtn = document.getElementById('resume-download');
    const viewBtn = document.getElementById('resume-view');

    if (dlBtn) dlBtn.href = resumePath;
    if (viewBtn) viewBtn.href = resumePath;
  }

  /* ── CONTACT ────────────────────────────────────────────────── */
  function renderContact(data) {
    const sec = data.sections?.contact;
    const p = data.personal || {};
    if (!sec || sec.visible === false) return;

    const introEl = document.getElementById('contact-intro');
    if (introEl) introEl.textContent = sec.intro;

    const cardsEl = document.getElementById('contact-cards');
    if (cardsEl) {
      cardsEl.innerHTML = `
        <div class="contact-card" data-copy="${safe(p.email)}" data-copy-label="Email copied!" title="Click to copy email">
          <div class="contact-card-icon">${icon('mail', 20)}</div>
          <div>
            <div class="contact-card-label">Email</div>
            <div class="contact-card-value">${safe(p.email)}</div>
          </div>
          <span class="contact-card-action">Copy</span>
        </div>
        <div class="contact-card" data-copy="${safe(p.phone)}" data-copy-label="Phone copied!" title="Click to copy phone">
          <div class="contact-card-icon">${icon('phone', 20)}</div>
          <div>
            <div class="contact-card-label">Phone</div>
            <div class="contact-card-value">${safe(p.phone)}</div>
          </div>
          <span class="contact-card-action">Copy</span>
        </div>
        <a class="contact-card" href="https://linkedin.com/in/tabhishek0001" target="_blank" rel="noopener noreferrer">
          <div class="contact-card-icon">${icon('linkedin', 20)}</div>
          <div>
            <div class="contact-card-label">LinkedIn</div>
            <div class="contact-card-value">tabhishek0001</div>
          </div>
          <span class="contact-card-action">${icon('external-link', 14)}</span>
        </a>
        <div class="contact-card">
          <div class="contact-card-icon">${icon('map-pin', 20)}</div>
          <div>
            <div class="contact-card-label">Location</div>
            <div class="contact-card-value">${safe(p.location)}</div>
          </div>
        </div>
      `;
    }

    // Build form fields
    const formEl = document.getElementById('contact-form-fields');
    if (formEl) {
      formEl.innerHTML = (sec.formFields || []).map(f => {
        if (f.type === 'textarea') {
          return `
            <div class="form-group">
              <label class="form-label" for="field-${f.id}">${safe(f.label)}${f.required ? ' *' : ''}</label>
              <textarea class="form-textarea" id="field-${f.id}" name="${f.id}" placeholder="${safe(f.placeholder)}" rows="${f.rows || 5}" ${f.required ? 'required' : ''}></textarea>
              <div class="form-error" id="error-${f.id}"></div>
            </div>
          `;
        }
        return `
          <div class="form-group">
            <label class="form-label" for="field-${f.id}">${safe(f.label)}${f.required ? ' *' : ''}</label>
            <input class="form-input" type="${f.type}" id="field-${f.id}" name="${f.id}" placeholder="${safe(f.placeholder)}" ${f.required ? 'required' : ''}>
            <div class="form-error" id="error-${f.id}"></div>
          </div>
        `;
      }).join('');
    }
  }

  /* ── FOOTER ─────────────────────────────────────────────────── */
  function renderFooter(data) {
    const sec = data.sections?.footer;
    const p = data.personal || {};
    const social = data.socialLinks || [];
    const nav = data.navigation || [];

    const nameEl = document.getElementById('footer-name');
    if (nameEl) nameEl.textContent = p.name;

    const titleEl = document.getElementById('footer-title');
    if (titleEl) titleEl.textContent = p.title;

    const taglineEl = document.getElementById('footer-tagline');
    if (taglineEl) taglineEl.textContent = sec?.tagline || '';

    const linksEl = document.getElementById('footer-links');
    if (linksEl) {
      const quickLinks = sec?.quickLinks || [];
      const filtered = nav.filter(n => quickLinks.includes(n.label) && n.visible !== false);
      linksEl.innerHTML = filtered.map(n => `
        <a class="footer-link" href="${safe(n.href)}">${safe(n.label)}</a>
      `).join('');
    }

    const socialEl = document.getElementById('footer-social');
    if (socialEl) {
      socialEl.innerHTML = social.filter(s => s.visible !== false).map(s => `
        <a class="footer-social-link" href="${safe(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${safe(s.label)}">
          ${icon(s.icon, 16)} ${safe(s.label)}
        </a>
      `).join('');
    }

    const copyEl = document.getElementById('footer-copy');
    if (copyEl) {
      copyEl.textContent = `© ${new Date().getFullYear()} ${safe(p.name)}. ${sec?.copyright || 'All rights reserved.'}`;
    }
  }

  /* ── PUBLIC API ─────────────────────────────────────────────── */
  function setProjectsRef(projects) { _projectsData = projects; }

  return {
    renderSEO,
    renderNavbar,
    renderHero,
    renderQuickSummary,
    renderAbout,
    renderCareerObjective,
    renderStats,
    renderSkills,
    renderExperience,
    renderProjects,
    renderCaseStudies,
    renderAchievements,
    renderEducation,
    renderSubjects,
    renderCertifications,
    renderTraining,
    renderServices,
    renderPhilosophy,
    renderValues,
    renderCurrentFocus,
    renderJourney,
    renderTestimonials,
    renderBlog,
    renderResume,
    renderContact,
    renderFooter,
    openProjectModalById,
    initModal,
    setProjectsRef,
    icon,
  };
})();

// Expose for inline onclick handlers
window.Renderer = Renderer;