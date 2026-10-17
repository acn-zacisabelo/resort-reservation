# Hansy's Resort

A responsive, Airbnb-inspired resort website. No dependencies or credentials required. Node.js 20+ is recommended.

```sh
npm run dev
npm test
npm run check
npm run build
```

Development: http://localhost:5173. Set `PORT` to change the port. `npm run build` creates a static `dist/` directory for hosting. To preview it locally in PowerShell: `$env:SERVE_DIST='1'; npm start`.

## Before launch

Deployment setup and commands are documented in [docs/deployment.md](docs/deployment.md).

All property descriptions, room capacities, amenities, prices, and stock photos are illustrative. Replace `src/stays.js`, the photos in `public/images/`, and the sample copy in `index.html` with Hansy's verified information. The inquiry form validates dates and generates a downloadable inquiry summary locally. It does not send messages, check live availability, take payment, or reserve a room. No personal information is stored by the site; only saved room IDs are kept in browser local storage.

## Files

- `index.html`: page structure and accessible dialogs.
- `src/styles.css`: responsive visual system.
- `src/main.js`: interface interactions and inquiry preview.
- `src/booking.js`: date validation and stay filtering.
- `src/stays.js`: clearly labeled sample room data.
- `tests/booking.test.js`: booking and filtering tests.
- `server.js`: local static server.
- `scripts/build.js`: dependency-free static build.

Photography: illustrative resort stock photography from Unsplash. See `public/images/credits.md`. No claim of ownership or affiliation with Airbnb.

The coastal hero is AI-generated concept photography; its prompt is recorded in `docs/image-prompts.md`. Fonts and photos are hosted locally. No runtime packages were added.

## Browser verification

`tests/browser-smoke.js` contains a Playwright CLI `run-code` function. With the local site already open in a Playwright CLI session, pass the file contents (trim the trailing semicolon) to `playwright-cli -s=<session> run-code` to exercise the UI. Create `output/playwright/` before running; it saves desktop and mobile screenshots there. This optional check requires Playwright CLI, which is not a runtime dependency.
