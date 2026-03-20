<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=140&section=header&text=Aditya%20Singh&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=65" width="100%" />

# Portfolio — Aditya Singh

**BSc IT Student · Web Developer · Security Researcher**

[![Live Demo](https://img.shields.io/badge/Live_Demo-6C5CE7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://adityasiig.github.io/Portfolio/)
[![GitHub](https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Adityasiig/Portfolio)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## Overview

A modern, design-heavy personal portfolio built with **pure HTML, CSS & JavaScript** — no frameworks, no build tools. Features a glassmorphism aesthetic with aurora-animated backgrounds, live GitHub contribution calendar, EmailJS-powered contact form, and a fully responsive layout that looks great in both dark and light modes.

---

## Features

### Design & UX
- **Aurora Animated Background** — Multi-layer gradient mesh with floating geometric shapes
- **Glassmorphism Cards** — Frosted-glass effect on project, skill, and certificate cards
- **Dark / Light Theme** — Smooth toggle with purple-lavender light palette, saved to `localStorage`
- **Scroll Animations** — Fade-in/slide-up via `IntersectionObserver`
- **3D Tilt Effect** — Cards tilt toward the cursor on hover
- **Magnetic Buttons** — Subtle follow-cursor effect on CTA buttons
- **Scroll Progress Bar** — Reading progress indicator pinned to the top
- **Custom Loading Screen** — Branded splash with animated progress bar
- **Flat-Design Developer Avatar** — Inline SVG portrait with dark/light mode theming

### Sections
- **Hero** — Animated typed subtitle, dynamic time-based greeting, "Currently Building" banner
- **About** — Bio, detail cards, inline SVG avatar, floating stat counters
- **Skills** — Bento-grid layout with progress bars and ring charts (Security, Web, Tools)
- **GitHub Activity** — Live contribution calendar fetched from API, purple-themed cells, auto-fills 12 months
- **Projects** — Featured project with code-editor window + secondary cards (WebVulnScanner, TaskFlow)
- **Certificates** — Vertical timeline with alternating cards, category colour badges, lightbox viewer
- **Contact** — EmailJS-powered form with loading state, success/error toast notifications

### Technical
- **EmailJS Integration** — Sends emails directly from the browser, no backend required
- **Live GitHub Calendar** — Fetches from `github-contributions-api.jogruber.de`, custom purple renderer
- **Typed.js** — Animated subtitle cycling through roles
- **Animated Stat Counters** — Numbers count up when scrolled into view
- **Dynamic Greeting** — Morning / Afternoon / Evening based on local time
- **Toast Notification System** — Success / error / info toasts with icons
- **Lightbox** — Click-to-expand certificate viewer with keyboard navigation
- **Fully Responsive** — Mobile-first, tested across all screen sizes

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Markup** | HTML5 (semantic) |
| **Styling** | CSS3 — Custom Properties, Grid, Flexbox, Keyframe Animations |
| **Scripts** | Vanilla JavaScript ES6+ |
| **Email** | EmailJS Browser SDK |
| **Animation** | Typed.js |
| **Fonts** | Inter · Space Grotesk · JetBrains Mono |
| **Icons** | Font Awesome 6 |
| **Data** | GitHub Contributions API (jogruber.de) |

---

## Projects Featured

| Project | Tech | Description |
|---------|------|-------------|
| **WebVulnScanner** | Python, Flask, Requests | Automated web vulnerability scanner — XSS, SQLi, header analysis, crawling |
| **TaskFlow** | HTML, CSS, JS | Minimal task manager with progress tracking and local storage |
| **Portfolio** | HTML, CSS, JS | This site — glassmorphism, aurora bg, live GitHub calendar |

---

## Project Structure

```
Portfolio/
├── index.html               # Single-page app entry point
├── README.md
└── public/
    ├── css/
    │   └── style.css        # All styles — dark/light theme, animations, layout
    ├── js/
    │   └── script.js        # Interactions, EmailJS, GitHub calendar, animations
    ├── images/
    │   ├── avatar.svg       # Inline developer avatar (SVG, theme-aware)
    │   ├── favicon.ico
    │   ├── favicon.png
    │   └── favicon.svg
    ├── files/
    │   └── cv.pdf           # Downloadable resume
    └── Certificates/
        └── [9 certificate images]
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Adityasiig/Portfolio.git

cd Portfolio

# Open directly in your browser — no build step needed
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

> No npm, no webpack, no dependencies to install. Just open and go.

---

## Contact

- **Email** — via the contact form on the site
- **GitHub** — [@Adityasiig](https://github.com/Adityasiig)
- **LinkedIn** — [Aditya Singh](https://linkedin.com/in/adityasiig)

---

<div align="center">

**Built with passion by Aditya Singh**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />

</div>
