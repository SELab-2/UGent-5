from sqlalchemy.orm import Session
from . import models, schemas
from ..subject import models as subjectModels
from ..project import models as projectModels
from ..user import models as userModels


async def get_group_by_id(db: Session, group_id: int) -> models.Group:
    return db.get(models.Group, group_id)


async def get_groups_by_project(db: Session, project_id: int) -> list[models.Group]:
    return (db.query(models.Group).join(models.Project).
            filter(models.Group.project_id == project_id).all())


async def get_groups_by_user(db: Session, user_id: int) -> list[models.Group]:
    return (db.query(models.Group).join(models.StudentGroup).
            filter(models.StudentGroup.uid == user_id).all())


async def get_teachers_by_group(db: Session, group_id: int) -> list[userModels.User]:
    return (db.query(userModels.User).join(subjectModels.TeacherSubject).join(subjectModels.Subject)
            .join(projectModels.Project).join(models.Group)
            .filter(models.Group.id == group_id and models.Group.project_id == projectModels.Project.id
                    and projectModels.Project.subject_id == subjectModels.Subject.id).all()
            )


async def create_group(db: Session, group: schemas.GroupCreate) -> models.Group:
    db_group = models.Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


async def join_group(db: Session, team_id: int, user_id: str):
    insert_stmnt = models.StudentGroup.insert().values(
        team_id=team_id, uid=user_id)
    db.execute(insert_stmnt)
    db.commit()


async def leave_group(db: Session, team_id: int, user_id: str):
    db.query(models.StudentGroup).filter_by(
        team_id=team_id, uid=user_id).delete()
    db.commit()
