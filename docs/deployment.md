# Cloudflare Pages deployment

GitHub source: https://github.com/acn-zacisabelo/resort-reservation

Cloudflare project: `hansys-resort`. Production branch: `main`. Build command: `npm run build`. Output folder: `dist`.

Production URL: https://hansys-resort.pages.dev. The owner approved this address after Cloudflare reported the original `resort.pages.dev` hostname was taken. No reservation backend is configured.

## Verification and deployment

```sh
npm test
npm run check
npm run build
npx wrangler@4.151.1 pages deploy dist --project-name hansys-resort --branch main
```

This project uses direct upload. Git pushes alone do not trigger deployments. Authenticate with your own Cloudflare account before deploying; credentials are not stored in this repository.
