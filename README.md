# Abhishek Kumar — Personal Portfolio

A complete, premium, enterprise-grade dynamic portfolio system built for **Abhishek Kumar**, Full Stack Web Developer. Every section, every text, every project, every skill, and every setting is controlled by a single JSON file — no rebuild needed to make changes.

---

## Credits

Designed and built as a personal brand portfolio for **Abhishek Kumar**.  
Portfolio URL: [abhishek.docsansar.com](https://abhishek.docsansar.com){:target="_blank"}  
Main Project: [Doc Sansar](https://www.docsansar.com){:target="_blank"}  
Contact: [abhishek@docsansar.com](mailto:abhishek@docsansar.com){:target="_blank"}

---

## Features

- **100% Dynamic** — all content driven from `data/portfolio-data.json`
- **Dark / Light Mode** — toggle with preference saved in `localStorage`
- **Typing Animation** — hero section role cycling
- **Animated Counters** — stats animate on scroll into view
- **Project Filtering & Search** — filter by category, search by name or tech
- **Project Detail Modal** — full project info in an accessible dialog
- **Scroll Reveal Animations** — smooth, staggered section reveals
- **Sticky Navbar** — active link highlighting on scroll
- **Mobile Hamburger Menu** — full responsive navigation
- **Copy to Clipboard** — email and phone copy buttons
- **Contact Form** — client-side validated with mailto fallback
- **SEO Ready** — dynamic meta tags, Open Graph, Twitter Card, JSON-LD schema
- **Accessible** — semantic HTML5, ARIA labels, keyboard navigation, focus states
- **Performance** — lazy-loaded images, debounced search, no heavy dependencies
- **Optional Content Editor** — visual JSON editor in `admin-optional/`
- **Hostinger / cPanel Ready** — pure static files, no backend needed

---

## Folder Structure

```
portfolio/
│
├── index.html                    ← Main portfolio page
├── README.md                     ← This file
├── sitemap.xml                   ← XML sitemap for SEO
├── robots.txt                    ← Search engine directives
│
├── data/
│   └── portfolio-data.json       ← ALL content lives here
│
├── assets/
│   ├── css/
│   │   ├── style.css             ← Main styles, design system
│   │   ├── responsive.css        ← Responsive breakpoints
│   │   └── themes.css            ← Dark/light theme variables
│   │
│   ├── js/
│   │   ├── app.js                ← Main orchestrator, entry point
│   │   ├── data-loader.js        ← JSON fetch and caching
│   │   ├── renderer.js           ← All DOM rendering functions
│   │   ├── animations.js         ← Scroll reveal, counters, typing
│   │   ├── filters.js            ← Project filtering and search
│   │   ├── form-handler.js       ← Contact form + copy buttons
│   │   └── theme-manager.js      ← Dark/light mode management
│   │
│   ├── images/
│   │   ├── profile-placeholder.png
│   │   ├── hero-illustration.png
│   │   ├── og-image.png          ← Social share image (1200×630px)
│   │   ├── favicon.png           ← Favicon (32×32 or 64×64px)
│   │   └── projects/
│   │       ├── docsansar-preview.png
│   │       ├── unclejee-store-preview.png
│   │       ├── khabai-tech-system-preview.png
│   │       └── utility-tools-preview.png
│   │
│   ├── documents/
│   │   └── Abhishek-Kumar-Resume.pdf
│   │
│   └── icons/
│
└── admin-optional/
    ├── content-editor.html       ← Visual JSON editor tool
    ├── content-editor.css
    └── content-editor.js
```

---

## How the Dynamic System Works

The portfolio loads `data/portfolio-data.json` on page load using the Fetch API. JavaScript renders every section from the JSON structure. No content is hardcoded in HTML (except structural containers).

**Flow:**
1. Browser loads `index.html` → shows preloader
2. `app.js` calls `DataLoader.load()` → fetches `portfolio-data.json`
3. `ThemeManager.init()` applies theme from JSON default or saved preference
4. `Renderer.*` functions build each section from JSON data
5. `Animations.*` initializes scroll reveal, counters, typing
6. Preloader fades out → portfolio is visible

If JSON fails to load, a friendly error message guides the user on how to fix it.

---

## How to Edit Content

### The Golden Rule
**Only edit `data/portfolio-data.json`.** The website reflects all changes automatically.

### Using the Optional Content Editor
Open `admin-optional/content-editor.html` in your browser (via a local server). It provides:
- Full JSON editor with live validation
- Quick edit panels for personal info, theme, section visibility, stats, projects
- Format / Minify JSON buttons
- Download updated JSON button

After downloading, upload the new file to replace `data/portfolio-data.json` on your hosting.

---

## Common Tasks

### Add a New Project

Find `sections.projects.items` in `portfolio-data.json` and add:

```json
{
  "id": "my-new-project",
  "name": "My New Project",
  "slug": "my-new-project",
  "type": "Web App",
  "categories": ["Web App"],
  "url": "https://example.com",
  "github": "",
  "status": "Live",
  "featured": false,
  "role": "Developer",
  "image": "assets/images/projects/my-new-project-preview.png",
  "shortDescription": "A short description of what this project does.",
  "detailedDescription": "A longer, detailed description for the modal popup.",
  "features": [
    "Feature one",
    "Feature two"
  ],
  "tech": ["PHP", "MySQL", "Bootstrap"],
  "metrics": [
    { "label": "Users", "value": "500+" }
  ],
  "learning": "What I learned from this project."
}
```

It will automatically appear in the Projects section and be filterable.

---

### Add a New Skill

Find `sections.skills.categories` and locate the right category. Add to its `skills` array:

```json
{ "name": "New Skill", "level": "Practicing", "color": "green" }
```

**Valid levels:** `Experienced` | `Comfortable` | `Practicing` | `Improving` | `Learning`

To add a new **skill category**, add a new object to the `categories` array:

```json
{
  "id": "new-category",
  "title": "New Category",
  "icon": "code",
  "skills": [
    { "name": "Skill Name", "level": "Comfortable", "color": "cyan" }
  ]
}
```

---

### Add a New Certificate

Find `sections.certifications.items` and add:

```json
{
  "id": "new-cert",
  "title": "Certificate Title",
  "issuer": "Issuing Organization",
  "category": "Category Name",
  "date": "2025",
  "credentialLink": "https://link-to-credential.com",
  "image": "",
  "description": "What this certification covers.",
  "visible": true
}
```

---

### Hide or Show a Section

Find the section in `sections` and set:

```json
"visible": false
```

Example — hide the Blog section:
```json
"blog": {
  "visible": false,
  ...
}
```

Set to `true` to show it again. Changes take effect immediately on next page load.

---

### Reorder Sections

Each section has an `"order"` property. Lower numbers appear first. Change the order values:

```json
"about": { "order": 3, ... }
"stats": { "order": 5, ... }
```

Note: The HTML section elements are in a fixed visual order in `index.html`. The `order` property primarily controls future dynamic ordering if enabled. For full reordering, adjust the section sequence in `index.html` directly — it takes less than 2 minutes since sections are clearly commented.

---

### Change Theme Colors

Find `theme.colors` in JSON:

```json
"theme": {
  "defaultMode": "dark",
  "allowToggle": true,
  "colors": {
    "primary": "#2563eb",
    "accent": "#06b6d4"
  }
}
```

Change `primary` and `accent` to any valid hex color. The theme manager applies these as CSS variable overrides on load.

To change the default mode, set `"defaultMode": "light"` or `"dark"`.

---

### Replace the Resume

1. Upload your new PDF to `assets/documents/`
2. Update `site.resumePath` and `sections.resume.resumePath` in JSON:

```json
"site": {
  "resumePath": "assets/documents/Your-New-Resume.pdf"
}
```

---

### Replace Profile / Project Images

Images are referenced by path in JSON:
- Profile: `personal.profileImage`
- Project images: `sections.projects.items[n].image`
- OG image: `site.ogImage`

Upload your images to the `assets/images/` folder and update the paths in JSON accordingly.

For best results:
- **Profile image:** 400×400px, square, PNG or WebP
- **Project previews:** 800×500px, 16:9 ratio, PNG or WebP
- **OG image:** 1200×630px, PNG

---

### Update SEO

Find `seo` in JSON:

```json
"seo": {
  "title": "Your Page Title | Role",
  "description": "Your meta description (150-160 chars recommended).",
  "keywords": ["keyword1", "keyword2"],
  "openGraph": {
    "title": "OG Title",
    "description": "OG Description",
    "image": "assets/images/og-image.png",
    "url": "https://yoursite.com"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Twitter Title",
    "description": "Twitter Description",
    "image": "assets/images/og-image.png"
  }
}
```

---

### Add a Testimonial

Find `sections.testimonials.items` and add:

```json
{
  "name": "Person Name",
  "role": "Their Role",
  "company": "Their Company",
  "message": "What they said about you.",
  "image": "",
  "link": "",
  "visible": true
}
```

When `items` is empty, a placeholder message is shown automatically.

---

### Add a Blog Post Preview

Find `sections.blog.items` and add:

```json
{
  "id": "post-1",
  "title": "Article Title",
  "excerpt": "Short summary of the article.",
  "category": "Web Development",
  "date": "2025-06-01",
  "url": "https://link-to-article.com",
  "visible": true
}
```

When `items` is empty, a "coming soon" placeholder is shown.

---

### Add a Navigation Link

Find `navigation` array and add:

```json
{
  "id": "new-section",
  "label": "New Section",
  "href": "#new-section",
  "visible": true,
  "order": 11
}
```

Make sure the corresponding `section` element in `index.html` has `id="new-section"`.

---

### Add a Social Link

Find `socialLinks` array and add:

```json
{
  "id": "github",
  "label": "GitHub",
  "url": "https://github.com/yourusername",
  "icon": "github",
  "visible": true
}
```

Available icons (used in renderer): `linkedin`, `globe`, `mail`, `message-circle`, `github`, `twitter`, `youtube`, `instagram`.

---

### Change Typing Animation Texts

Find `personal.typingTexts`:

```json
"typingTexts": [
  "Full Stack Web Developer",
  "Your Custom Role",
  "Another Descriptive Title"
]
```

Each string appears in sequence in the hero typing animation.

---

### Toggle Section Animations

Find `settings` in JSON:

```json
"settings": {
  "showPreloader": true,
  "enableAnimations": true,
  "enableProjectSearch": true,
  "enableProjectFilters": true,
  "enableDarkMode": true,
  "enableTypingAnimation": true,
  "enableCounters": true,
  "scrollReveal": true
}
```

Set any to `false` to disable that feature.

---

## How to Test Locally

Because `portfolio-data.json` is fetched via the Fetch API, you need a local server. Opening `index.html` directly as `file://` will block the fetch request in most browsers.

**Option 1 — VS Code Live Server (Recommended)**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Your browser opens at `http://127.0.0.1:5500`

**Option 2 — Node.js**
```bash
cd portfolio
npx serve .
```
Opens at `http://localhost:3000`

**Option 3 — Python**
```bash
cd portfolio
python -m http.server 8000
```
Opens at `http://localhost:8000`

**Option 4 — PHP**
```bash
cd portfolio
php -S localhost:8000
```

---

## How to Deploy on Hostinger / cPanel

1. Log in to your Hostinger / cPanel account
2. Open **File Manager**
3. Navigate to `public_html/` (or your subdomain folder, e.g. `abhishek.docsansar.com/`)
4. Upload all portfolio files maintaining the folder structure:
   ```
   public_html/
   ├── index.html
   ├── robots.txt
   ├── sitemap.xml
   ├── data/
   │   └── portfolio-data.json
   ├── assets/
   │   ├── css/
   │   ├── js/
   │   ├── images/
   │   └── documents/
   └── admin-optional/   ← optional, can be omitted from live hosting
   ```
5. Make sure `portfolio-data.json` is uploaded to the `data/` folder
6. Visit your domain — the portfolio loads dynamically

**Important:** Do NOT upload the `admin-optional/` folder to your live hosting unless you want it accessible. It is a local development tool only.

---

## How to Use the Optional Content Editor

1. Make sure you are running a local server (see above)
2. Open `http://localhost:PORT/admin-optional/content-editor.html`
3. The editor will auto-load your current `portfolio-data.json`
4. Use the sidebar panels to make quick edits, or edit the raw JSON directly
5. Click **⬇ Download JSON** to download the updated file
6. Upload the downloaded `portfolio-data.json` to replace the existing file on your hosting

The editor does NOT save to the file directly (not possible on static hosting). It downloads the file — you upload it manually. This keeps the system simple, secure, and hosting-independent.

---

## Troubleshooting

### JSON Loading Error / Blank Portfolio
- **Cause:** Opening `index.html` directly as `file://` in a browser
- **Fix:** Use a local server (see Testing section above)

### Changes Not Appearing
- **Cause:** Browser cache
- **Fix:** Hard refresh with `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### JSON Validation Error in Editor
- **Cause:** Invalid JSON syntax (missing comma, extra comma, unclosed bracket)
- **Fix:** Use the Format button to auto-format, read the error message carefully, or paste into [jsonlint.com](https://jsonlint.com) for detailed error location

### Images Not Showing
- **Cause:** Wrong file path in JSON or image not uploaded
- **Fix:** Check that the path in JSON matches exactly where the image is on the server. Paths are case-sensitive on Linux hosting.

### Dark Mode Not Switching
- **Cause:** `theme.allowToggle` is set to `false` in JSON
- **Fix:** Set `"allowToggle": true` in `theme` section

### Typing Animation Not Working
- **Cause:** `personal.typingTexts` is empty or `settings.enableTypingAnimation` is `false`
- **Fix:** Add at least one string to `typingTexts` array and ensure `enableTypingAnimation` is `true`

### Contact Form Not Sending
- The form uses a **mailto: fallback** — it opens the user's default email client with the message pre-filled. There is no server-side form processing. For server-side email, integrate a service like [Formspree](https://formspree.io){:target="_blank"} or [EmailJS](https://emailjs.com){:target="_blank"} and update `form-handler.js`.

---

## Customization Guide

### Adding a New CSS Section Style
Open `assets/css/style.css` and add your styles. Follow the existing BEM-inspired naming pattern:
```css
/* ── MY NEW SECTION ────── */
#my-section { background: var(--bg-surface); }
.my-section-grid { display: grid; ... }
.my-section-card { background: var(--bg-card); ... }
```

### Adding a New Renderer Function
Open `assets/js/renderer.js` and add your function to the `Renderer` object:
```js
function renderMySection(data) {
  const sec = data.sections?.mySection;
  if (!sec || sec.visible === false) return;
  const el = document.getElementById('my-section-content');
  if (!el) return;
  el.innerHTML = (sec.items || []).map(item => `<div>${safe(item.title)}</div>`).join('');
}
```
Then add to the `return` block and call it from `app.js`.

### Adding a New Icon
The `icon()` function in `renderer.js` contains all SVG icons as an `ICONS` object. Add a new entry:
```js
'my-icon': `<svg ...>...</svg>`,
```
Then reference it as `"icon": "my-icon"` in JSON.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (custom properties, grid, flexbox) |
| Scripts | Vanilla JavaScript (ES6+) |
| Content | JSON (data/portfolio-data.json) |
| Fonts | Google Fonts (Syne, DM Sans, JetBrains Mono) |
| Hosting | Hostinger / any static host |
| Dependencies | **Zero** external JS libraries |

---

## File Reference

| File | Purpose |
|------|---------|
| `index.html` | Main page structure and script loading |
| `data/portfolio-data.json` | All portfolio content and configuration |
| `assets/css/style.css` | Main design system, components, layout |
| `assets/css/responsive.css` | Mobile, tablet, desktop breakpoints |
| `assets/css/themes.css` | Dark/light theme variable overrides |
| `assets/js/app.js` | Entry point — orchestrates all modules |
| `assets/js/data-loader.js` | Fetch and cache JSON data |
| `assets/js/renderer.js` | Build all DOM sections from JSON |
| `assets/js/animations.js` | Scroll reveal, counters, typing, navbar |
| `assets/js/filters.js` | Project filter tabs and search |
| `assets/js/form-handler.js` | Contact form validation and copy buttons |
| `assets/js/theme-manager.js` | Dark/light mode toggle and persistence |
| `admin-optional/content-editor.html` | Visual JSON editor (local use only) |
| `robots.txt` | Search engine crawl directives |
| `sitemap.xml` | XML sitemap for SEO indexing |

---

*Built with passion for real-world web solutions.*
