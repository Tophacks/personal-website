# Nate Powell — Engineering Field Notes

A personal portfolio for product engineering, transit simulation, reinforcement learning, and computer vision.

**Live:** https://personal-website-ten-lyart.vercel.app/

## Design

The site is an editorial engineering studio rather than a page-flip presentation:

- An immediately readable hero with clear project and resume links.
- A keyboard-accessible, four-project interactive systems explorer (illustrative schematics, **not** production telemetry).
- Six detailed project cards, with category filters and links to source-backed case studies.
- An approach section, experience timeline, curiosity notes, and direct contact links.
- Responsive layouts, reduced-motion support, skip navigation, focus indicators, and progressive enhancements. Project content stays visible if JavaScript is disabled.
- A consistent visual language across the engineering case studies and resume page.

## Interactive engineering lab

`demos.html` hosts six self-contained experiments, linked from every portfolio project:
- TransitOps: four-stop simulation with fixed vs demand-triggered bus dispatch and side-by-side deterministic comparisons.
- NeuroSim: manual flight model porting the published fictional rocket constants and simplified 2D physics.
- TransitOps-M: depot reservation / docking / emergency-stop state transitions.
- Quadmates: fictional discovery filters and guarded study-request workflow.
- Staffflow: fictional hiring pipeline and server-template-inspired objective question scoring.
- Vision: bounded-buffer and frame-skip scheduling model (no camera or person detection).

`demo-core.js` holds testable browser ports of pure model logic; `demos.js` renders the interactions. No demo connects to a live database, authentication backend, staff/customer dataset, or trained model. **NeuroSim caveat:** the browser version adds illustrative RCS angular torque, because current published `env.py` records/penalizes RCS but does not actually apply it to the angular acceleration equation. No hardware safety claims or real deployment metrics are implied.

## Full NeuroSim 2.0 mission control

`neurosim-mission.html` is an independent, full-sized browser mission control application using `neurosim-engine.js`, a port of the public NeuroSim 2.0 Python environment's dynamics, vehicle/planet presets, touchdown and reward equations. It includes animated flight, manual keyboard/touch sliders, planet and vehicle selection, live telemetry, a flight-recorder graph, replay and CSV export. The published repository has no committed trained model weights and contains a known syntax issue, so the portfolio does **not** claim PPO inference or run arbitrary Python. The separate lightweight engineering-lab exhibit deliberately models an optional RCS torque, but the full mission-control page instead retains the Python environment's no-RCS-torque behavior.

## Original running applications

The TransitOps and TransitOps-M case studies lead with the actual application interfaces rather than replacing them with simplified visualizations.

- TransitOps embeds its independent Next.js/FastAPI deployment at `https://transitops-phi.vercel.app/` with a prominent direct-open link if iframe embedding is blocked by the host. The SUMO/TraCI WebSocket simulator requires its own optional service and cannot run from the static portfolio.
- TransitOps-M embeds `full/transitops-m.html`, copied from the actual `Tophacks/TransitOps-M/transitops_m/dashboard.html` and deliberately forced into the original offline/browser demonstration mode. The original JavaScript simulation controls are preserved. It is **not** connected to its Python API or physical bus controls.
- The lightweight adapted Engineering Lab demos remain available below these full project experiences.

## Development

Static HTML/CSS/JavaScript with no runtime framework and no build step.

Run locally:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/.

Run the checks locally (Node.js 22 recommended):

```bash
node --check script.js
node --test tests/*.test.mjs
```

GitHub Actions runs the same checks for commits and pull requests.

## Files

- `index.html` — fully accessible homepage content and project schematics
- `styles.css` — visual system, animations, and responsive layouts
- `media.js` and `assets/project-media/manifest.json` — project captures, recorded demos and accurately labeled source-derived fallback visuals
- `script.js` — accessible tab explorer, project filters, mobile nav, progress indicator
- `engineering.html` and `engineering.css` — evidence-led case-study index
- `projects/` — individual project case studies
- `resumes.html` — original PDFs and career profiles
- `assets/np-mark.svg` — monogram

## Editorial principles

Project diagrams are schematics, not screenshots or live monitoring. Performance claims appear only when the corresponding case study explains the experiment and limitations. Private source code, staff records, and applicant data are not disclosed.

## Next improvements

The GitHub Actions `Capture public project visuals` workflow records public, unauthenticated screenshots and brief walkthrough clips, then updates the media manifest. NeuroSim capture attempts to use the actual Pygame viewer; the older camera project retains a labeled source-derived diagram. If a site is unavailable or protected, the portfolio intentionally keeps a diagram instead of misrepresenting access. Periodically update case studies against repository changes.
