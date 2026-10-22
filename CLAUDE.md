# CLAUDE.md

## Engineering workflow
For any engineering task in this repo (features, bug fixes, reviews, release prep),
follow the edith-engineering skill: run /edith-engineering and use the edith-* agents
as it directs. Skip it for trivial one-line edits.

## Stack
This site is plain HTML, CSS and JavaScript on GitHub Pages. There is no React,
no build step, no backend and no database. Ignore the edith agents' React,
Node/Python and PostgreSQL defaults here.

- `index.html`: all sections, text and links
- `css/styles.css`: all styles
- `js/main.js`: all behavior
- `assets/`: fonts, images, videos and the resume PDF
- Bootstrap 4 (CSS) and jQuery load from a CDN in `index.html`

See `README.md` for previewing locally and GitHub Pages setup.

## Rules
- Keep asset paths relative (`assets/img/...`, not `/assets/img/...`).
- Don't add a build step, framework or package manager unless asked.
- Never push or deploy. Publishing to GitHub Pages is the owner's call.
