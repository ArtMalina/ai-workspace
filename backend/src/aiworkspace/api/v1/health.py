from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends

from aiworkspace.api.v1.schemas import HealthResponse
from aiworkspace.core.container import Container
from aiworkspace.services.health.service import HealthService

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
@inject
async def health_check(
    service: HealthService = Depends(Provide[Container.health_service]),
) -> HealthResponse:
    data = await service.check()
    return HealthResponse(**data)
