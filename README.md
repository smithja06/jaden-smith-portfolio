# jaden-smith-portfolio

Personal engineering portfolio featuring software development, AI/ML, embedded systems, and interactive technical experiments. Built with React and TypeScript.

Visual direction: **Midnight Cobalt — Minimal Experimental Studio**. The portfolio comes first and the lab second: the homepage is calm, and pages get more interactive the deeper you go.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest) for the lab models + content integrity
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Routes

| Path | What |
| --- | --- |
| `/` | Hero + Signal Field, selected work, live 4×4 lab console, about teaser, contact |
| `/work` | Every project, with working category filters (`?filter=embedded` etc.) |
| `/work/:slug` | Case study template (problem → role → system → decisions → implementation → outcome) |
| `/lab` | **3D Lab**: an explorable WebGL facility (hub + 5 stations). Choosing a station flies the camera there, then opens its page. `?view=list` shows the accessible list view |
| `/lab/experience` · `/lab/projects` · `/lab/skills` · `/lab/education` · `/lab/contact` | Full-page sections with a 01–05 pager; Esc returns to the lab |
| `/lab/vision-matrix` | Experiment A: Vision → 4×4 LED matrix (presets, threshold / 4-level, smoothing, gain, ramp, local image) |
| `/lab/signal-playground` | Experiment B: waveform + noise + moving-average filter with computed readouts |
| `/about` | Narrative, timeline, practice areas, tools, approach |
| `/contact` | Redirects to `/#contact` |

## 3D Lab

`/lab` is built with three.js, React Three Fiber and drei, from procedural geometry only (no external models or textures). It lives in `src/lab3d/`:

```
lab3d/
  LabWorld.tsx            page: toolbar, station list, panels, workspace, fallbacks (no three.js imports)
  LabScene.tsx            the Canvas (lazy chunk): environment, hub, paths, stations, camera, bloom
  LabCameraController.tsx guided ~950 ms eased camera moves; orbit is disabled while moving
  CentralHub.tsx, SignalPaths.tsx, LabEnvironment.tsx, Station.tsx, StationPad.tsx (per-station platform shapes)
  stations/               five installations: projects gallery, experience racks, skills workstation, education desk, comms dish
  ui/                     StationNavigation, LabToolbar, LabFallback (list view)
  config/stations.ts      station metadata shared by the 3D world and the HTML list
  materials/labMaterials.ts shared materials + palette
```

- **Navigation:** click a model, or use the station list (keyboard and touch). The camera flies to the station (~950 ms), then its page opens at `/lab/<id>`. Desktop allows limited drag-to-orbit; zoom is via the toolbar.
- **Section pages:** `src/pages/lab/LabSectionPage.tsx` renders all five from `src/content/` (experience, projects, skills, education, site), so each fact lives in one place.
- **Fallbacks:** without WebGL, or if the scene errors, `/lab` renders the list view. The list is always one click away and never loads three.js.
- **Performance:** `PerformanceMonitor` lowers resolution when frame rate drops (nothing is displayed). "Effects: Low" disables bloom and contact shadows, and is the default on touch and small screens. Reduced-motion freezes ambient animation and makes camera moves instant.

## Editing content

All personal facts live in `src/content/`. Components never hard-code them.

- `site.ts`: name, email, résumé path, social links, hero copy
- `projects.ts`: projects and their case studies. **Add a project here** and it appears on `/work`, in the filters, and at `/work/<slug>`. Set `featuredOrder` to put it on the homepage (the first 4 by order are shown).
- `experience.ts`: timeline, practice areas, tools, approach

Any field set to `TODO_USER_CONTENT` is **hidden** in the UI, never rendered. Search for `TODO_USER_CONTENT` to see what's still missing. Résumé and email buttons only appear once real values are set (put the PDF at `public/resume.pdf` and set `resumeUrl: '/resume.pdf'`).

Cover art in `src/components/art/ProjectArt.tsx` is original SVG and is labelled "Concept visual". To use a real screenshot instead, add an image and set `conceptVisual: false`.

## Structure

```
src/
  content/      typed data: site, projects, experience (+ integrity tests)
  lab/          pure models (visionMatrix.ts, signal.ts + tests) and their UI
  components/   Nav, Layout/Footer, SignalField (hero canvas), ProjectCard, SystemDiagram, …
  pages/        one file per route (lazy-loaded except Home / 404)
  styles/       tokens.css (all colours/spacing), global.css, components.css
```

The experiment logic (`visionMatrix.ts`, `signal.ts`) is pure and UI-free, so it's unit-tested directly. The Signal Playground uses seeded, index-hashed noise, so results are repeatable.

## Accessibility & motion

Skip link, semantic landmarks, visible focus rings, `aria-current` in the nav, and a mobile menu with focus trap, Escape to close, and scroll lock. The LED grid supports arrow-key navigation, and every value is shown as text as well as colour. `prefers-reduced-motion` turns off continuous animation. The hero canvas and lab loops pause when offscreen or when the tab is hidden.

## Deploying

This is a static SPA, so every path must fall back to `index.html`:

- **Netlify**: `public/_redirects` is included.
- **Vercel**: `vercel.json` is included.
- **GitHub Pages**: copy `dist/index.html` to `dist/404.html` after building.

Once you have a domain, set `baseUrl` in `site.ts` and add a sitemap.
