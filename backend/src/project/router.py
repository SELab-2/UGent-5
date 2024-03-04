from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.user.schemas import User
from src.user.dependencies import get_authenticated_user, get_db
from .schemas import ProjectCreate, ProjectResponse
from .service import create_project
from ..subject.service import is_teacher_of_subject

router = APIRouter(
    prefix="/subject/{subject_id}",
    tags=["subject_overview"],
    responses={404: {"description": "Not found"}},
)

@router.post("/subjects/{subject_id}/projects/create")
async def create_project(
    subject_id: int,
    project_in: ProjectCreate,
    user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db)
):
    # Check if the user is a teacher of the subject
    if not await is_teacher_of_subject(db, user.uid, subject_id):
        raise HTTPException(status_code=403, detail="User is not authorized to create projects for this subject")

    project = create_project(db=db, project_in=project_in, user_id=user.id)
    return project

@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(models.Project, project_id)
    return project

