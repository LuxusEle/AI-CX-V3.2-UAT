# Engineering & Release Rules (AI CX)

- UAT-passed modules are **frozen**; edits require a Change Request (CR), tests, and approval.
- Tenant isolation, JWT-only auth (prod), Postgres RLS, audit logging, and signed URLs are **mandatory**.
- Progressive delivery: Mock on Vercel → safe AI tool calls → per-module rollout → lock stable modules.
- Handover discipline: top-of-file headers must describe what/reads/writes/logic/caveats.
