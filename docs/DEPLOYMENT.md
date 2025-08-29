# Deployment Options

## Frontend on Vercel
- Set `NEXT_PUBLIC_API_URL` to your API base.
- Add envs in Vercel dashboard.
- Ensure CORS in API allows your Vercel domain.

## Backend on Kubernetes (GKE/any K8s)
- Manifests: `k8s/backend-deployment.yml`, `k8s/backend-service.yml`, `k8s/ingress.yml`
- Use cert-manager for TLS with Let's Encrypt.
- Set secrets via Kubernetes Secrets; mount to env.
- Add HPA (HorizontalPodAutoscaler) later for scaling.

## Backend on Fly.io (simple)
- Build Docker; `fly launch`; set secrets with `fly secrets set`.
- Map 443; add LiteFS only if you need SQLite (you don't; you use Postgres).

## GitHub Actions
- Use `infra/ci-stub.yml` then extend with docker build/push + deploy steps.

## Avoid hydration errors (Next.js)
- Keep React 18 stable for now.
- Only mark components `use client` when necessary.
- Avoid relying on `window` at render time; guard with `typeof window !== 'undefined'`.
- Prefer data fetching in Server Components or route handlers; pass serialized props.

## Mock UI on Vercel
- Create a minimal Next.js (or static) frontend that calls your UAT API.
- Set `NEXT_PUBLIC_API_URL` in Vercel envs to point to the API base.
- Keep stateful operations on the API (safer). 
