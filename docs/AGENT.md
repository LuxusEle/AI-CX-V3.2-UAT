# 'Sam' — Assistant

**Goal:** conversational shortcuts over ERP actions.

## Supported intents (deterministic for now)
- "update CRM stage to visit" → sets latest project's status to 'visit'
- "price the project <id>" → runs BOM pricing
- "split POs for project <id>" → creates POs grouped by vendor
- "start visit" / "going to visit" → logs a placeholder message

## How it works
- POST `/assistant` with `message`
- `services/agent.py` parses text and calls domain services
- Replace parser with an LLM later; keep the same tool functions
