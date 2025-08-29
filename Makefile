SHELL := /bin/bash

.PHONY: dev api web stop logs migrate seed fmt lint test

dev:
	docker compose up --build -d

stop:
	docker compose down

logs:
	docker compose logs -f --tail=200

api:
	docker compose exec api bash

web:
	docker compose exec web sh

migrate:
	docker compose exec api alembic upgrade head

seed:
	docker compose exec api python -m scripts.seed_demo

fmt:
	docker compose exec api ruff check --fix . || true
	docker compose exec api black . || true

lint:
	docker compose exec api ruff check . || true

test:
	docker compose exec api pytest -q || true

protect:
	python scripts/protect.py

test-protect:
	BASE_REF=$(shell git rev-parse HEAD~1) python scripts/protect.py
