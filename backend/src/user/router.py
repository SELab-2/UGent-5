from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.requests import Request
from fastapi import APIRouter, Depends
from typing import Optional
from cas import CASClient
from src import config
from src.dependencies import get_db
from .schemas import User, UserCreate
from . import service
from . import exceptions
from .dependencies import get_authenticated_user
from sqlalchemy.orm import Session

router = APIRouter()

cas_client = CASClient(
    version=2,
    service_url=f"{config.CONFIG.api_url}/login?next=%2Fprofile",
    server_url=f"{config.CONFIG.cas_server_url}",
)


@router.get("/login", tags=["auth"])
async def login(request: Request, next: Optional[str] = None,
                ticket: Optional[str] = None,
                db: Session = Depends(get_db)):

    if request.session.get("user", None):
        # Already logged in
        return RedirectResponse(request.url_for("profile"))

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        return RedirectResponse(cas_login_url)

    user, attributes, _ = cas_client.verify_ticket(ticket)

    if not user or not attributes:
        return HTMLResponse('Failed to verify ticket. <a href="/login">Login</a>')
    else:  # Login successfully, redirect according `next` query parameter.

        # Check if user exists in database, else create one.
        if not await service.get_by_id(db, attributes["uid"]):
            await service.create_user(db, UserCreate(
                given_name=attributes["givenname"],
                id=attributes["uid"]))

        if not next:
            return
        response = RedirectResponse(next)

        request.session["user"] = dict(user=attributes["uid"])
        return response


@router.get("/profile", tags=["auth"], response_model=User)
async def profile(request: Request, user: User = Depends(get_authenticated_user)):
    return user


@router.get("/logout", tags=["auth"])
async def logout(request: Request):
    redirect_url = request.url_for("logout_callback")
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return RedirectResponse(cas_logout_url)


@router.get("/logout_callback", tags=["auth"])
async def logout_callback(request: Request):
    # redirect from CAS logout request after CAS logout successfully
    request.session.pop("user", None)
    return HTMLResponse('Logged out from CAS. <a href="/login">Login</a>')
