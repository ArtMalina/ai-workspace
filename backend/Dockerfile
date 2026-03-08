FROM python:3.12-slim

# Copy uv binary from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Install dependencies (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --frozen

# Copy source
COPY src/ ./src/

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "aiworkspace.main:app", "--host", "0.0.0.0", "--port", "8000"]
