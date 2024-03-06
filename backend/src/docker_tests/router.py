from fastapi import APIRouter

from . import service

router = APIRouter(
    prefix="/docker_test"
)

@router.get("/build")
async def test():
    await service.build_image()
    return [{"success"}]

@router.get("/")
async def test():
    await service.run_docker_tests_detatched()
    return [{"success"}]
