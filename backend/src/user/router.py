from fastapi import APIRouter, Depends

from .dependencies import get_authenticated_user, retrieve_subjects
from .schemas import SubjectList, User

router = APIRouter(
    prefix="/api/users", tags=["user"], responses={404: {"description": "Not Found"}}
)


@router.get("/me")
async def profile(user=Depends(get_authenticated_user)) -> User:
    """
    Get information about the current user
    """
    return user


@router.get("/me/subjects")
async def subjects(subjects: SubjectList = Depends(retrieve_subjects)) -> SubjectList:
    """
    Get the subjects of the current user
    """
    return subjects
