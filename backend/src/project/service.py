from sqlalchemy.orm import Session
from . import models, schemas

async def create_project(db: Session, project_in: ProjectCreate, user_id: str) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=project_in.subject_id
        description=project_in.description
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project
