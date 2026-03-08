.PHONY: install install-dev start lint fmt test

install:
	uv sync

install-dev:
	uv sync --group dev

start:
	uv run uvicorn aiworkspace.main:app --reload --host 0.0.0.0 --port 8000

lint:
	uv run ruff check src/

fmt:
	uv run ruff format src/

test:
	uv run pytest
