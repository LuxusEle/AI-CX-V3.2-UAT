# Deployment Plan for Nexus ERP

This document outlines the deployment strategy for the Nexus ERP application, covering both frontend and backend components, and a module-by-module deployment approach.

## 1. Frontend Deployment (Vercel)

The Next.js frontend application (`apps/web`) will be deployed on Vercel.

**Steps:**

*   **V1: Project Setup:** Create a new Vercel project and link it to the Git repository containing the `apps/web` directory.
*   **V2: Build Configuration:** Configure the Vercel project to correctly identify the Next.js application within the `apps/web` subdirectory.
    *   **Root Directory:** Set to `apps/web`.
    *   **Build Command:** `npm run build` or `yarn build` (depending on package manager used in `apps/web`).
    *   **Output Directory:** `.next`.
*   **V3: Environment Variables:** Configure necessary environment variables on Vercel, especially `NEXT_PUBLIC_API_URL` to point to the deployed backend API.
*   **V4: Custom Domains:** (Optional) Configure custom domains for the frontend application.
*   **V5: Continuous Deployment:** Vercel will automatically deploy new changes from the linked Git branch (e.g., `main` or `master`).

## 2. Backend Deployment (Docker & Kubernetes)

The FastAPI backend application (`apps/api`) will be containerized using Docker and deployed on Kubernetes.

**Steps:**

*   **D1: Dockerfile Creation:** Create a `Dockerfile` for the `apps/api` application to containerize it. This will include:
    *   Base image (e.g., `python:3.9-slim-buster`).
    *   Copying `requirements.txt` and installing dependencies.
    *   Copying application code.
    *   Exposing the application port.
    *   Defining the entrypoint command (e.g., `uvicorn src.main:app --host 0.0.0.0 --port 8000`).
*   **D2: Docker Image Build & Push:** Build the Docker image and push it to a container registry (e.g., Docker Hub, Google Container Registry, AWS ECR).
*   **K1: Kubernetes Manifests:** Create Kubernetes YAML manifests for deploying the backend. This will include:
    *   **Deployment:** Defines the desired state for the application (e.g., number of replicas, container image, resource limits).
    *   **Service:** Exposes the backend application within the Kubernetes cluster.
    *   **Ingress:** (Optional, for external access) Configures external access to the backend API.
    *   **ConfigMaps/Secrets:** For managing environment variables and sensitive information (e.g., `DATABASE_URL`, `JWT_SECRET`).
*   **K2: Database & Redis Deployment:** Deploy PostgreSQL and Redis (if not already managed externally) within the Kubernetes cluster using appropriate manifests or managed services.
*   **K3: Apply Manifests:** Apply the Kubernetes manifests to the cluster using `kubectl apply -f <manifests>`.
*   **K4: Monitoring & Logging:** Set up monitoring and logging for the backend services within Kubernetes.

## 3. Module-by-Module Deployment & Progress Tracking

A module-by-module deployment strategy will be adopted to manage the release of new features and updates. Progress will be tracked in a dedicated markdown file (e.g., `progress.md`) using checkboxes.

**Strategy:**

*   **M1: Feature Branching:** Each new module or significant feature (e.g., CRM pipeline) will be developed in a dedicated Git feature branch.
*   **M2: Independent Testing:** Modules will be independently tested before integration.
*   **M3: Staged Deployment:** New modules will be deployed to staging environments for further testing and validation before production.
*   **M4: Progress Tracking:** A `progress.md` file will be maintained in the root of the repository. This file will list all major modules and features with checkboxes to indicate their deployment status (e.g., `[ ] Planned`, `[-] In Progress`, `[x] Deployed`).
*   **M5: Rollback Plan:** A clear rollback plan will be established for each module deployment in case of issues.
