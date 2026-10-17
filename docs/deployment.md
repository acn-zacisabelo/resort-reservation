# Cloudflare Pages deployment

GitHub source: https://github.com/acn-zacisabelo/resort-reservation

Cloudflare project: `resort`. Production branch: `main`. Build command: `npm run build`. Output folder: `dist`.

Cloudflare assigned `resort-f0c.pages.dev` when creating the project because the requested `resort.pages.dev` hostname was already taken. Publication is pending the owner's choice of address. No reservation backend is configured.

## Verification and deployment

```sh
npm test
npm run check
npm run build
npx wrangler@4.151.1 pages deploy dist --project-name resort --branch main
```

This project uses direct upload. Git pushes alone do not trigger deployments. Authenticate with your own Cloudflare account before deploying; credentials are not stored in this repository.
