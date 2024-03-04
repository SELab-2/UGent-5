from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.models import User
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from .schemas import ProjectCreate, ProjectResponse
from .service import create_project, get_project, delete_project, update_project
from ..subject.service import is_teacher_of_subject

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
        raise HTTPException(status_code=404, detail=f"No projects found for subject {subject_id}")
    return projects

@router.post("/", response_model=ProjectResponse)
async def create_project_for_subject(
    subject_id: int,
    project_in: ProjectCreate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    if not await is_teacher_of_subject(db, user.id, subject_id):
        raise HTTPException(status_code=403, detail="User is not authorized to create projects for this subject")

    project = await create_project(db=db, project_in=project_in, user_id=user.id)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project_for_subject(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    project = await get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}")
async def delete_project_for_subject(
    subject_id: int,
    project_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    if not await is_teacher_of_subject(db, user.id, subject_id):
        raise HTTPException(status_code=403, detail="User is not authorized to delete this project")

    await delete_project(db, project_id)
    return {"message": "Project deleted successfully"}






