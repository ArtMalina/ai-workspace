from dependency_injector import containers, providers
from loguru import logger as _logger

from aiworkspace.core.config import Settings
from aiworkspace.services.health.service import HealthService


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        packages=["aiworkspace.api"],
    )

    config = providers.Singleton(Settings)

    logger = providers.Object(_logger)

    health_service = providers.Factory(
        HealthService,
        settings=config,
        logger=logger,
    )
