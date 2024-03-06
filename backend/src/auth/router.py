from typing import Optional

import src.user.service as user_service
from cas import CASClient
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from src import config
from src.auth.schemas import Token
from src.dependencies import get_db
from src.user.schemas import UserCreate
from starlette.requests import Request

from .service import create_jwt_token

router = APIRouter(
    prefix="/api", tags=["auth"], responses={404: {"description": "Not Found"}}
)

cas_client = CASClient(
    version=2,
    service_url=f"{config.CONFIG.api_url}/api/login",
    server_url=f"{config.CONFIG.cas_server_url}",
)


@router.get("/login", tags=["auth"], response_model=Token)
async def login(
    # request: Request,
    # next: Optional[str] = None,
    ticket: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # if request.session.get("user", None):
    #     # Already logged in
    #     return RedirectResponse(f"{config.CONFIG.frontend_url}/home")

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        return RedirectResponse(cas_login_url)

    user, attributes, _ = cas_client.verify_ticket(ticket)

    if not user or not attributes:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid CAS ticket"
        )
    else:  # Login successfully, redirect according `next` query parameter.
        # Check if user exists in database, else create one.
        if not await user_service.get_by_id(db, attributes["uid"]):
            await user_service.create_user(
                db,
                UserCreate(
                    given_name=attributes["givenname"],
                    uid=attributes["uid"],
                    mail=attributes["mail"],
                ),
            )

        jwt_token = create_jwt_token(attributes["uid"])
        return jwt_token


@router.get("/logout", tags=["auth"])
async def logout(request: Request):
    redirect_url = request.url_for("logout_callback")
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return RedirectResponse(cas_logout_url)


@router.get("/logout_callback", tags=["auth"])
async def logout_callback(request: Request):
    # redirect from CAS logout request after CAS logout successfully
    return HTMLResponse('Logged out from CAS. <a href="/login">Login</a>')
