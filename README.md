English · [简体中文](./README.zh-CN.md)

# Wei · Personal Website

Zhongnan University of Economics and Law · undergraduate law student | personal showcase website.

Personal website of an undergraduate law student. It serves as a portfolio gateway: legal coursework and moot court case studies, community legal aid volunteering, and self-built tech projects — including a self-hosted poetry website with a PHP admin panel and a local LLM (Ollama/Qwen3) deployment. Pure static front-end (HTML/CSS/vanilla JS, zero framework dependencies) with an optional PHP admin backend; bilingual (CN/EN), PWA-ready.

## Overview

A modern, clean, responsive personal website for showcasing academic achievements, projects, and skills, aimed at potential employers, internship recruiters, and graduate advisors.

### Tech stack

- **HTML5** + **CSS3** + **vanilla JavaScript** (zero framework dependencies)
- **Tailwind CSS v3** — only for basic container and typography utilities
- **Font Awesome 6** — icon library
- Google Fonts **Inter** — typeface
- Dark/light mode — based on CSS custom properties and `prefers-color-scheme`

## Directory structure

```
personal-website/
├── index.html          # Main page
├── 404.html            # 404 error page
├── css/
│   └── style.css       # All custom styles
├── js/
│   ├── projects.js     # Project portfolio data
│   └── app.js          # Main script (navigation, theme, animations, forms, etc.)
├── images/             # Personal photos and project screenshots (WebP format)
└── README.md           # This file
```

## Features

- ✅ **Responsive design** — fits desktop, tablet, and mobile
- ✅ **Dark/light mode** — manual toggle with automatically saved preference
- ✅ **Smooth scrolling** — smooth transitions for all anchor links
- ✅ **Scroll-in animations** — fade-in effects driven by Intersection Observer
- ✅ **Project filtering** — dynamic filtering by category (coursework / personal / competitions / practice)
- ✅ **Project detail modal** — click a card to open the full details
- ✅ **Skill progress bar animation** — fills automatically when scrolled into view
- ✅ **Contact form validation** — real-time + on-submit double validation
- ✅ **Toast messages** — success/error feedback for form submissions
- ✅ **Back-to-top button** — appears after scrolling past 400px
- ✅ **Hamburger menu** — full-screen navigation on mobile
- ✅ **Sticky navbar** — background turns semi-transparent on scroll
- ✅ **Image lazy loading** — native `loading="lazy"`
- ✅ **Semantic HTML** — header / section / footer / nav, etc.
- ✅ **SEO meta tags** — Open Graph, description, keywords
- ✅ **Accessibility** — ARIA labels, keyboard navigation (Esc closes the modal)

## How to run

### Open locally (recommended)

This is a pure static website with no build step. Just open `index.html` in a browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### With a local server (optional, recommended for best results)

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using the VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

### Customizing content

1. **Personal info** — edit the name, school, major, bio, and other text in `index.html`
2. **Projects** — edit the `projectsData` array in `js/projects.js`
3. **Photos** — put photos (WebP format) into `images/` and update the placeholders in the HTML
4. **Resume file** — put the PDF resume into `images/` and update the download link's `href`
5. **Contact info** — update the email address and social media links
6. **Color theme** — edit the CSS variables under `:root` in `css/style.css`

## Admin panel (optional)

`admin/` is a PHP admin backend (guestbook messages, visitor statistics, inline content editing). It is **not required** and does not affect the static pages.

- Admin credentials are read from the local `admin/config.php`, which is not committed
- To deploy the panel: copy `admin/config.example.php` to `admin/config.php` and fill in your own username and bcrypt password hash
- Generate a hash: `php -r "echo password_hash('your-password', PASSWORD_BCRYPT);"`

## Deployment

### GitHub Pages (free)

1. Create a GitHub repository and push all files in this directory to the `main` branch
2. Go to the repository Settings → Pages
3. Set Source to "Deploy from branch", Branch to `main`, and the folder to `/ (root)`
4. Click Save, wait a few minutes, and the site is live at `https://<username>.github.io/<repo>/`

### Vercel (free)

1. Install the Vercel CLI: `npm i -g vercel`
2. Run in the project root: `vercel`
3. Or sign in at [vercel.com](https://vercel.com), import the project, and keep the default settings

### Alibaba Cloud OSS static hosting

1. Upload `images/`, `css/`, `js/`, and the HTML files to an OSS bucket
2. Enable static website hosting, set the index document to `index.html` and the 404 document to `404.html`
3. (Optional) bind a custom domain and configure CDN

## Performance

- All styles are minified and merged into a single `style.css` (about 8KB gzipped)
- JavaScript is split into a data layer (`projects.js`) and a logic layer (`app.js`) for maintainability
- Theme switching uses CSS variables with no extra HTTP requests
- Google Fonts and Font Awesome are loaded from a CDN with `preconnect`
- Images are recommended in WebP format to reduce size

## Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## License

MIT
