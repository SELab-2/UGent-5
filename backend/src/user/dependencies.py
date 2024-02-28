from sqlalchemy.orm import Session
from src.dependencies import get_db
from fastapi import Depends
from .schemas import User
from .exceptions import UserNotFound,UnAuthenticated
from starlette.requests import Request
import src.user.service as service


async def get_authenticated_user(request: Request,
                                db: Session = Depends(get_db)) -> User:
    user_id = request.session.get("user")
    if not user_id:
        raise UnAuthenticated()
    user = await service.get_by_id(db,user_id["user"])
    if not user:
        raise UserNotFound()

    return user

