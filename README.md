<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Aditya%20Singh&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=65&desc=Portfolio%20Website&descSize=20&descAlignY=82&descColor=ccbbff" width="100%" />

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=22&duration=3000&pause=800&color=6C5CE7&center=true&vCenter=true&width=600&lines=BSc+IT+Student+%F0%9F%8E%93;Web+Developer+%F0%9F%92%BB;Security+Researcher+%F0%9F%94%90;Building+cool+things+on+the+web+%F0%9F%9A%80)](https://git.io/typing-svg)

<br/>

[![Live Demo](https://img.shields.io/badge/%F0%9F%8C%90_Live_Demo-6C5CE7?style=for-the-badge&logoColor=white)](https://adityasiig.github.io/Portfolio/)
[![Portfolio Repo](https://img.shields.io/badge/GitHub-Portfolio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Adityasiig/Portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Aditya_Singh-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/adityasiig)

<br/>

![Profile Views](https://komarev.com/ghpvc/?username=Adityasiig&color=6c5ce7&style=flat-square&label=Profile+Views)

</div>

---

## 🧑‍💻 About

A fast, dark, type-led personal portfolio built with **pure HTML, CSS & JavaScript**. No frameworks, no build tools. Self-hosted variable fonts (Space Grotesk + JetBrains Mono), a single emerald accent, real project screenshots, a live GitHub contribution calendar, an EmailJS contact form and a fully responsive layout.

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🎨 Design & UX**
- Dark, single-accent design system (emerald on near-black)
- Space Grotesk + JetBrains Mono, self-hosted variable fonts
- Real screenshots of the live apps on the project cards
- Scroll reveals via `IntersectionObserver` (reduced-motion aware)
- Certificate grid with keyboard-accessible lightbox
- Show-more toggle keeps the certificate wall short

</td>
<td width="50%">

**⚙️ Technical Highlights**
- EmailJS contact form, no backend
- Live GitHub contribution calendar (custom renderer)
- Zero scroll listeners: IntersectionObserver everywhere
- Inline form validation with ARIA error wiring
- Toast notification system
- Self-hosted icon subset (CSS masks, no icon CDN)
- Mobile-first, fully responsive

</td>
</tr>
</table>

**📄 Sections**

| Section | Description |
|---------|-------------|
| **Hero** | Type-led headline, availability status, fact strip |
| **About** | Bio and a facts rail (education, specialty, learning) |
| **Skills** | Four grouped columns of plain, honest lists |
| **GitHub Activity** | Live contribution calendar, 12 months rolling |
| **Projects** | Featured scanner with real code + app cards with live screenshots |
| **Certificates** | 3-column grid, show-more toggle, lightbox viewer |
| **Contact** | EmailJS form with loading state and toast feedback |

---

## 🛠️ Tech Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EmailJS](https://img.shields.io/badge/EmailJS-FF6B35?style=for-the-badge&logo=maildotru&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

</div>

| Category | Details |
|----------|---------|
| **Markup** | HTML5 (semantic) |
| **Styling** | CSS3 — Custom Properties, Grid, Flexbox, Keyframe Animations |
| **Scripts** | Vanilla JavaScript ES6+ |
| **Email** | EmailJS Browser SDK |
| **Fonts** | Space Grotesk · JetBrains Mono (self-hosted variable) |
| **Icons** | Self-hosted CSS-mask subset |
| **Data** | GitHub Contributions API (jogruber.de) |

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=Adityasiig&show_icons=true&theme=tokyonight&border_color=6c5ce7&title_color=6c5ce7&icon_color=a29bfe&hide_border=false&count_private=true" height="170" />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Adityasiig&layout=compact&theme=tokyonight&border_color=6c5ce7&title_color=6c5ce7&hide_border=false" height="170" />

<br/>

<img src="https://github-readme-streak-stats.herokuapp.com/?user=Adityasiig&theme=tokyonight&border=6c5ce7&ring=6c5ce7&fire=a29bfe&currStreakLabel=a29bfe" height="170" />

</div>

---

## 🚀 Projects Featured

| Project | Tech | Description |
|---------|------|-------------|
| **WebVulnScanner** | Python · Flask · Requests | Automated web vulnerability scanner — XSS, SQLi, header analysis, crawling |
| **TaskFlow** | HTML · CSS · JS | Minimal task manager with progress tracking and local storage |
| **Portfolio** | HTML · CSS · JS | This site: dark type-led design, live GitHub calendar |

---

## 📁 Project Structure

```
Portfolio/
├── index.html               # Single-page app entry point
├── robots.txt
├── sitemap.xml
├── README.md
└── public/
    ├── css/
    │   ├── main.css         # The whole design system
    │   └── icons.css        # Self-hosted icon subset (CSS masks)
    ├── js/
    │   └── script.js        # Nav, reveals, lightbox, form, GitHub calendar
    ├── fonts/               # Space Grotesk + JetBrains Mono (woff2)
    ├── images/
    │   ├── profile.jpg      # Social-card image (og:image / twitter:image)
    │   ├── projects/        # Real screenshots of the live apps
    │   ├── favicon.ico
    │   ├── favicon.png
    │   └── favicon.svg
    ├── files/
    │   └── cv.pdf           # Downloadable resume
    ├── apk/
    │   ├── taskflow.apk         # Android build, linked from the project card
    │   └── health-tracker.apk
    └── Certificates/
        ├── thumbs/          # 560px WebP — what the grid actually loads
        └── full/            # 1600px WebP — opened in the lightbox
```

## ⚡ Getting Started

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

## 📬 Contact

<div align="center">

[![Email](https://img.shields.io/badge/Contact_Form-6C5CE7?style=for-the-badge&logo=gmail&logoColor=white)](https://adityasiig.github.io/Portfolio/#contact)
[![GitHub](https://img.shields.io/badge/@Adityasiig-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Adityasiig)
[![LinkedIn](https://img.shields.io/badge/Aditya_Singh-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/adityasiig)

</div>

---

<div align="center">

**Built with passion by Aditya Singh**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%" />

</div>
