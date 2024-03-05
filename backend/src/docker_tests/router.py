from fastapi import APIRouter

from . import service

router = APIRouter(
    prefix="/docker_test"
)

@router.get("/build")
async def test():
    await service.build_image()
    return [{"sucess"}]

@router.get("/")
async def test():
    success = service.run_docker_tests()
    return [{"brol": "brol"}]
