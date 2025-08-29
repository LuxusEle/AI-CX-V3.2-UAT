# Error Handling & Observability

## Backend
- FastAPI global exception handlers (HTTPException, ValidationError, generic 500)
- Structured JSON logs with request id and user id where possible
- Sentry integration stub in `src/utils/logging.py`

## Frontend
- `app/error.tsx` as a global error boundary
- Toast errors for recoverable operations
- Show 401 → redirect to /login

## Celery
- Retries for transient failures
- Dead-letter queue or manual review for permanent failures
