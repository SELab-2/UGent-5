from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.models import User
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from .schemas import ProjectCreate, ProjectResponse, ProjectUpdate
from .service import create_project, get_project, delete_project, update_project, get_projects_for_subject
from ..subject.service import is_teacher_of_subject
from . import exceptions

router = APIRouter(
    prefix="/subjects/{subject_id}/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[ProjectResponse])
async def list_projects_for_subject(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    # Optional: You may want to check if the user has access to the subject (e.g., is a teacher or a student of the subject)
    projects = await get_projects_for_subject(db, subject_id)
    if not projects:
        raise NoProjectsFoundException(subject_id)
    return projects


@router.post("/", response_model=ProjectResponse)
async def create_project_for_subject(
    subject_id: int,
    project_in: ProjectCreate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    if not await is_teacher_of_subject(db, user.id, subject_id):
        raise UnauthorizedToCreateProjectException()

    project = await create_project(db=db, project_in=project_in, user_id=user.id)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project_for_subject(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    project = await get_project(db, project_id)
    if not project:
        raise ProjectNotFoundException()
    return project


@router.delete("/{project_id}")
async def delete_project_for_subject(
    subject_id: int,
    project_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    if not await is_teacher_of_subject(db, user.id, subject_id):
        raise UnauthorizedToUpdateProjectException()

    await delete_project(db, project_id)
    return {"message": "Project deleted successfully"}


@router.patch("/{project_id}", response_model=ProjectResponse)
async def patch_project_for_subject(
    subject_id: int,
    project_id: int,
    project_update: ProjectUpdate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if the user is authorized to update the project
    if not await is_teacher_of_subject(db, user.id, subject_id):
        raise UnauthorizedToUpdateProjectException()

    updated_project = await update_project(db, project_id, project_update)
    if not updated_project:
        raise ProjectNotFoundException()
    return updated_project
