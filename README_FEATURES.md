New Features Overview

1) Related Content (Auto-links)
- Files: src/meta.ts, src/RelatedBlock.tsx
- Renders a compact block "Связано с этим" under cards. Uses dept + tags + title match.
- Inserted into roles and procedures cards; shows up to 6 items.

2) Versioning + Diff + What's New
- Files: src/data/versions.json, src/versioning.ts, src/WhatsNew.tsx, src/DiffPage.tsx
- Header button "Что нового" opens the feed; items link to a diff view.
- Shows a small "обновлено" badge for recently-updated roles.

3) Print Export (A4/PDF)
- Files: src/PrintSheet.tsx
- Route: /print?role=<id>. Button on Role page.
- Print styles applied via @media print; use browser Print to export to PDF.

4) Anonymous Voting (Useful/Not useful)
- Files: src/vote.ts, src/VoteWidget.tsx, workers/worker.js
- Adds a two-button widget with counters under cards.
- Backend: Cloudflare Worker + KV. Configure binding VOTES and deploy worker.js.
- Public API: POST /api/vote, GET /api/stats?ids=...
- Env: set VITE_VOTE_API_BASE to the Worker origin (e.g., https://your-worker.workers.dev).

Local Run
- npm i
- npm run dev
- Optionally set VITE_VOTE_API_BASE in .env.local to point at your Worker.

Deploy Worker (Cloudflare)
- Create KV namespace (e.g., VOTES) and bind it in wrangler.toml
- wrangler deploy workers/worker.js

Testing
- Related: open roles/procedures cards; block should show 3+ items.
- Versioning: "Что нового" shows entries; open diff for role:guard.
- Print: open /print?role=guard then print to PDF; layout stays within A4.
- Voting: click "Полезно/Не полезно"; counters increment; reload persists; second click with same anon_uid is ignored.

