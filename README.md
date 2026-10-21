# Portfolio 2027

Personal portfolio for Aaron G. Trevino. It is plain HTML, CSS, and JavaScript. There is no build step.

## Files

| File | What it does |
|---|---|
| `index.html` | The page: every section, all the text, and all the links |
| `css/styles.css` | All styles: fonts, layout, colors, animations |
| `js/main.js` | Behavior: side menu highlighting, hover videos, scroll effects |
| `assets/` | Fonts, images, videos, and the resume PDF |

Two libraries load from a CDN in `index.html`: Bootstrap 4 (CSS) and jQuery. You need an internet connection to preview the site.

## Preview on your computer

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

The page reloads each time you save a file.

## Page sections

`index.html` has four main sections. Each has an `id` that the side menu links to.

| Section | `id` |
|---|---|
| Home (hero) | `home` |
| Projects (four project panels) | `projects` |
| Resume | `resume` |
| Contact | `contact` |

## Host on GitHub Pages

1. In this repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`, then select **Save**.

The site appears at `https://agtrevino.github.io/` after a minute or two.

## Notes

- Keep asset paths relative (for example `assets/img/...`, not `/assets/img/...`). This keeps the site working wherever GitHub Pages serves it from, including a subfolder.
- The project videos play only while you hover a panel. The code for this is in `js/main.js` (`videoPlayback`).
