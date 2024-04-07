from fastapi import APIRouter

from . import utils

router = APIRouter(
    prefix="/api/docker_test"
)


@router.get("/build")
async def test():
    utils.build_image("bla")
    return [{"success"}]
