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
