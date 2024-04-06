from fastapi import APIRouter

from . import utils

router = APIRouter(
    prefix="/docker_test"
)


@router.get("/build")
async def test():
    await utils.build_image()
    return [{"success"}]


@router.get("/")
async def test_detatched():
    await utils.run_docker_tests_detached()
    return [{"success"}]
