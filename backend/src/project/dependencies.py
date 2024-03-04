from fastapi import Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from src.user.exceptions import NotAuthorized
from src.user.schemas import User
from src.subject.schemas import Subject
from src.subject.schemas import SubjectList


from . import service
# from .exceptions import SubjectNotFound
# from .schemas import Subject, SubjectList





async def retrieve_subjects(
    user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)
) -> SubjectList:
    teacher_subjects, student_subjects = await service.get_subjects(db, user.uid)
    return SubjectList(as_teacher=teacher_subjects, as_student=student_subjects)


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db),
):
    if not user.is_admin:
        teachers = await service.get_teachers(db, subject_id)
        if not list(filter(lambda teacher: teacher.id == user.uid, teachers)):
            raise NotAuthorized()
