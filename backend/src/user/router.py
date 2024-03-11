from fastapi import APIRouter, Depends
from .schemas import User
from .dependencies import get_authenticated_user

router = APIRouter(
    prefix="/api/user", tags=["user"], responses={404: {"description": "Not Found"}}
)


@router.get("/profile", response_model=User)
async def profile(user=Depends(get_authenticated_user)):
    return user
