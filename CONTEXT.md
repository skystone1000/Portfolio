# Portfolio — Project Context

## Overview
Aditya Mahajan's personal portfolio showcasing work, experience, and projects. Includes a games section with browser-based games.

**Type:** Static web app  
**Language / framework:** Vanilla HTML / CSS / JavaScript  
**Package manager:** None  
**Deployment:** GitHub Pages at adityamahajan.in

## Entry points
- `index.html` — Main portfolio (hero, about, experience, skills, projects, YouTube, contact)
- `games.html` — Games hub page
- `tic-tac-toe.html` — Fully playable Tic Tac Toe browser game

## Folder structure
```
Portfolio/
├── includes/
│   ├── header.html   # Shared CSS (1430 lines) + nav + mobile nav partial
│   ├── footer.html   # Shared footer element + scroll-to-top button + all shared JS
│   └── loader.js     # data-include loader: fetch → DOMParser → inject style/html/script
├── index.html        # Portfolio page body; uses data-include for header + footer
├── games.html        # Games hub; uses data-include for header + footer
├── tic-tac-toe.html  # Game page; uses data-include for header + footer
├── CNAME             # adityamahajan.in
└── README.md
```

## Include system (key architecture)
Every HTML page follows this pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- font/icon links -->
  <script defer src="./includes/loader.js"></script>
</head>
<body data-page="<page-id>">
  <div data-include="./includes/header.html"></div>
  <!-- page content -->
  <div data-include="./includes/footer.html"></div>
</body>
</html>
```

`loader.js` on DOMContentLoaded:
1. Fetches each `[data-include]` URL in parallel
2. Injects `<style>` tags from the fetched doc into `<head>`
3. Sets the placeholder div's `innerHTML` to the fetched body HTML
4. Collects all `<script>` tags and re-executes them after ALL includes are injected (scripts injected via innerHTML don't execute; must create new `<script>` elements)
5. On index.html (pathname ends with `/` or `/index.html`), strips `index.html` prefix from nav href attributes so anchor links work without a page reload
6. Adds `.active` to the nav link whose `data-page` attribute matches `document.body.dataset.page`
7. Dispatches `includes-loaded` CustomEvent

**Important:** The site requires HTTP (not `file://`) to work — use `python -m http.server 8000` or VS Code Live Server for local development.

## Shared stylesheet (`includes/main.css`)
- Full CSS design system (~1429 lines): variables, reset, nav, hero, sections, responsive breakpoints
- Linked directly in each page's `<head>` — loads as a blocking stylesheet, eliminating FOUC completely
- No JavaScript involved in CSS delivery

## Shared header (`includes/header.html`)
- Nav HTML only (24 lines): `<nav id="nav">` + `.mob-nav` mobile overlay
- Logo links to `index.html`, section links use `index.html#section` format, Games link has `data-page="games"`

## Shared footer (`includes/footer.html`)
Contains all shared JS with null guards for index-only elements:
- Particle canvas animation (`#c` → null guarded)
- Nav scroll listener — adds `.scrolled` to `nav` on scroll; on non-index pages adds `.scrolled` immediately (no canvas)
- Mobile nav toggle (burger / mob-nav / mob-close)
- IntersectionObserver scroll reveal (`.rv` → `.on`)
- Skill bar fill animation (`.sk-card` → null guarded)
- Project category filter (`.fbtn`/`.pc` → null guarded)
- Contact form handler (`#cform` → null guarded)

## Page IDs (`data-page` on `<body>`)
| Page | data-page |
|------|-----------|
| index.html | `home` |
| games.html | `games` |
| tic-tac-toe.html | `games` |

## Key dependencies
- Google Fonts: Inter (300–800)
- Google Material Icons Round
- No npm packages, no build step

## Data flow
Static pages → loader.js fetches includes → nav + CSS injected → shared JS runs → page interactive

## Coding conventions
- All CSS is embedded in `includes/header.html` and page-specific `<style>` blocks
- No TypeScript, no linting (plain HTML/CSS/JS)
- Responsive breakpoints: 900px (layout shift) and 640px (mobile nav)

## Known issues / TODOs
- Implement new games (Memory Cards, 2048, Snake — placeholder cards exist in games.html)
- Local development requires an HTTP server (`file://` fetch blocked by CORS)

## Architecture decision record (ADR)
| Decision | Rationale | Date |
|----------|-----------|------|
| `data-include` + fetch loader | Zero build tooling; works with GitHub Pages static hosting | 2026-04-25 |
| Defer scripts until all includes are injected | Footer JS references nav elements from header include; must wait for DOM | 2026-04-25 |
| Null guards in footer.html scripts | Canvas, skill bars, project filter, contact form only exist on index.html | 2026-04-25 |

## Feature changelog
| Feature / change | Files affected | Date |
|-----------------|---------------|------|
| Implemented data-include system | includes/loader.js (new), includes/header.html, includes/footer.html, index.html, games.html, tic-tac-toe.html | 2026-04-25 |
| Added games hub + Tic Tac Toe game | games.html, tic-tac-toe.html | prior |

---
Last updated: 2026-04-25 — includes system implementation
