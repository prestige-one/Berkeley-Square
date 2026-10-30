# Berkeley Square — Next.js

Run `npm install`, then `npm run dev`. Open http://localhost:4174.

Production: `npm run build`, then `npm start`. Checks: `npm run check` and `npm test`.

App Router page and section components live in app/ and components/. Reusable React enquiry forms, menu and gallery live in components/Interactions.jsx. Server-side lead validation, signed tokens and portal delivery live in lib/ and pages/api/.

Project renders come from the supplied local images, now under public/images/ for Next.js. The specifically requested location map and project logo are under public/assets/source/. Outdated online project renders are excluded.

Classes, IDs, cookies and environment keys use bsq/BSQ prefixes. Portal credentials stay in ignored .env.local. Every lead sets project_interest to Berkeley Square on the server.

Brochure/factsheet actions submit document requests; no project PDFs were supplied.
