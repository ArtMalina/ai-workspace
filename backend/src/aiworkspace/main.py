from contextlib import asynccontextmanager
from typing import AsyncIterator

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from aiworkspace.api.router import api_router
from aiworkspace.core.config import settings
from aiworkspace.core.container import Container
from aiworkspace.core.logging import setup_logging


def create_app() -> FastAPI:
    setup_logging()

    container = Container()
    container.wire()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        logger.info(f"Starting {settings.app_name} v{settings.app_version}")
        yield
        logger.info("Shutting down...")

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    app.container = container  # type: ignore[attr-defined]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    return app


app = create_app()


def main() -> None:
    uvicorn.run(
        "aiworkspace.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()
