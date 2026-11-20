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
| `/` | Hero, About, Featured projects (3 flagships), Experience (3 roles), Lab preview, Contact. Everything else lives on the Lab pages |
| `/work/:id` | Case-study template. Only filled-in sections render (problem, what I built, team, architecture, decisions, validation, limitations, media…) |
| `/experience/:id` | Full page for a role, e.g. `/experience/rbc` with its seven initiatives |
| `/work`, `/projects` | Redirect to the searchable archive at `/lab/projects#archive` (`?q=esp32&category=embedded-biomedical`) |
| `/lab` | **3D Lab**: an explorable WebGL facility (hub + 5 stations). Choosing a station flies the camera there and shows a short intro panel (one line, 2–3 highlights, one link to the full page). `?view=list` shows the accessible list view |
| `/lab/experience` · `/lab/projects` · `/lab/skills` · `/lab/education` · `/lab/contact` | The complete sections (full archive, all roles, every skill, awards, coursework) with a 01–05 pager; Esc returns to the lab |
| `/lab/vision-matrix` | Experiment A: Vision → 4×4 LED matrix (presets, threshold / 4-level, smoothing, gain, ramp, local image) |
| `/lab/signal-playground` | Experiment B: waveform + noise + moving-average filter with computed readouts |
| `/about` | Biography, focus areas, full timeline |
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

- **Navigation:** click a model, or use the station list (keyboard and touch). The camera flies to the station (~950 ms) and its intro panel (`ui/StationPanel.tsx`, content in `config/stations.ts`) offers the full page at `/lab/<id>`; Esc returns to the overview. Desktop allows limited drag-to-orbit; zoom is via the toolbar.
- **Section pages:** `src/pages/lab/LabSectionPage.tsx` renders all five from `src/content/` (experience, projects, skills, education, site), so each fact lives in one place.
- **Fallbacks:** without WebGL, or if the scene errors, `/lab` renders the list view. The list is always one click away and never loads three.js.
- **Performance:** `PerformanceMonitor` lowers resolution when frame rate drops (nothing is displayed). "Effects: Low" disables bloom and contact shadows, and is the default on touch and small screens. Reduced-motion freezes ambient animation and makes camera moves instant.

## Editing content

All personal facts live in `src/content/`. Components never hard-code them, and each fact has exactly one record.

| File | Holds |
| --- | --- |
| `projects/*.ts` | All 30 projects, one file per category (`ai-software`, `embedded-biomedical`, `web-creative`, `experiments`). `projects/index.ts` has labels, search and lookups |
| `featured.ts` | The six flagships for the Projects page, in order (references, not copies). `onHomepage: true` picks the three on the homepage; `homepageExperienceIds` picks the three roles |
| `experience.ts` | Every role, team and competition, grouped technical / leadership / other |
| `education.ts` | Schools, awards (received vs. candidate vs. certification), coursework by discipline |
| `skills.ts` | Skill groups, plus `coreSkills` (the 8–12 shown first). Names are canonical: projects list them in `tech`, and the Skills explorer derives "where it was used" from that (`relations.ts`) |
| `site.ts` | Contact details, socials, résumé, bio, hero copy |
| `types.ts` | The shapes of all of the above |

Any field set to `TODO_USER_CONTENT` is **hidden** in the UI, never rendered. Search for `TODO_USER_CONTENT` to see what's still missing. Each record's `todo` list (never rendered) notes what details are outstanding.

**Add a project:** append a record to the right `projects/<category>.ts` file with a new `id` and the next `inventory` number. It appears in the archive, search, filters, Skills explorer and at `/work/<id>`. Every name in `tech` must exist in `skills.ts` (a test checks this). To feature it, add `{ kind: 'project', id }` to `featured.ts` (keep it to six); add `onHomepage: true` to show it on the homepage (keep it to three).

**Add links:** fill the `evidence` slots (`repo`, `demo`, `video`, `report`, or `other: [{ label, href }]`). External links must start with `https://`; internal pages start with `/`. Slots left as `TODO_USER_CONTENT` stay hidden.

**Add photos, videos or PDFs:** put the files in `public/media/projects/<project-id>/` and list them in the project's `media` array, e.g. `{ kind: 'image', src: '/media/projects/custodyos/dashboard.png', alt: 'custodyOS custody timeline view', caption: '…' }`. Kinds: `image`, `video` (optional `poster`), `diagram`, `pdf`. A Media section appears automatically. Use real project media only. RBC records are `restricted` and must stay artifact-free (a test enforces it).

**Link a simulator:** register the experiment in `src/lab3d/config/stations.ts` (`experiments`, plus a route in `App.tsx`), then set `simulation: { id, label }` on the project to show its button. `plannedSimulation` records future ideas without rendering anything.

Cover art in `src/components/art/ProjectArt.tsx` is original SVG and is labelled "Illustration" so it can't be mistaken for a screenshot.

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
