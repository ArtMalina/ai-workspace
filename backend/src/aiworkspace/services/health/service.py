from aiworkspace.core.config import Settings
from aiworkspace.domain.protocols import LoggerProtocol


class HealthService:
    def __init__(self, settings: Settings, logger: LoggerProtocol) -> None:
        self._settings = settings
        self._logger = logger

    async def check(self) -> dict[str, str]:
        self._logger.debug("Health check requested")
        return {
            "status": "ok",
            "app": self._settings.app_name,
            "version": self._settings.app_version,
        }
