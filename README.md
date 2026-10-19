# Aditya Ajay Singh / Portfolio

A portfolio for security, telecom infrastructure, and software engineering.
The visual direction follows the profile README: flowing white and silver
artwork, a dark silhouette, generous space, serif headlines, and a restrained
monochrome palette. Dark mode uses the supplied inverted wallpaper and matching
dark surfaces throughout, including project previews and the footer.

**Source branch for this redesign: `fixes`.**

## Run locally

This is a static website. There is no framework, dependency installation,
compilation, or build step required to run or deploy it.

```sh
python -m http.server 4180 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4180/).

## The experience

- System-aware light and dark themes, remembered after a manual choice.
- An artwork-led introduction, engineering practice, and production context.
- Six selected projects, filterable by telecom, security, and products.
- Theme-matched project previews and CV / Android app downloads.
- A grouped engineering toolkit and a live, lazy-loaded GitHub calendar.
- Nine credentials, with show-more controls and a native, keyboard-accessible
  certificate dialog. Full-size images load when a credential is opened.
- An EmailJS contact form with field validation, a loading state, success and
  failure feedback, and a direct-email fallback. The SDK loads only on submit.
- Mobile navigation, visible keyboard focus, a skip link, reduced-motion support,
  and readable content with JavaScript disabled.
- Gentle hero-artwork drift, staggered entrances, a drawn signal illustration,
  and animated project-filter rearrangement. The artwork pauses offscreen and in
  background tabs. Reduced motion disables animation, including active filter
  transitions; rapid filter changes are applied immediately without a queue.

Projects described as system or interface sketches are illustrative diagrams,
not claims of live operational metrics. Health Tracker and TaskFlow retain the
existing app preview assets. Glyph Toys is explicitly marked as simulation-tested
and not yet tested on physical hardware.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Content, metadata, structured data, and accessible page structure |
| `public/css/main.css` | Shared layout and complete light/dark design system |
| `public/js/script.js` | Theme, navigation, filters, dialog, form, and activity |
| `public/images/flow/` | Hero artwork, social cover, and vector ribbon detail |
| `public/Certificates/` | Existing credential images |
| `public/files/cv.pdf` | Existing downloadable CV |
| `public/apk/` | Existing Android app downloads |
| `tools/verify-flow.cjs` | Local browser checks |

The light hero artwork is reused from the GitHub profile redesign. The dark
wallpaper is the user-supplied image, copied without changing its pixels; CSS
rotates and positions it in the cover. Typography is native HTML, not baked
into the website hero. The original social cover is reused from the profile.
Display typography uses Georgia, body copy uses system fonts, and small labels
use the existing self-hosted Space Mono font. No font or icon CDN is required.

## Browser checks

The verification script uses Playwright against the running local server:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tools/verify-flow.cjs
```

Optional environment variables:

- `PORTFOLIO_URL`: preview URL (default `http://127.0.0.1:4180/`).
- `PORTFOLIO_NODE_MODULES`: existing dependency directory.
- `PORTFOLIO_BROWSER_PATH`: installed Chromium executable.
- `PORTFOLIO_ARTIFACTS`: screenshot directory (default `tools/artifacts/`, ignored).

Checks cover desktop, tablet, and 320/390-pixel layouts; light/dark artwork and
theme persistence; project filters; all certificate images and dialog keyboard
behavior; mobile navigation; form validation and mocked success/failure;
calendar rendering and unavailable-data fallback; motion reveals; and content
without JavaScript. Email delivery is mocked and its API is blocked during the
form checks. The suite does not send messages or confirm actual inbox delivery.

The contribution calendar still uses the existing public GitHub Contributions
API. If either required year cannot load, the page links directly to GitHub
instead of showing an incomplete or fabricated count. Existing EmailJS public
configuration is retained; no private credentials are stored here.

## Hosting

The site remains compatible with the repository's existing GitHub Pages setup
and project path `/Portfolio/`. All local URLs are relative. The canonical URL,
sitemap, CV, certificates, app downloads, and existing external project links
are preserved. Deployment settings are not changed by this redesign.
