from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.requests import Request
from fastapi import APIRouter, Depends
from typing import Optional
from cas import CASClient
from src import config
from .schemas import User
from .dependencies import get_authenticated_user

router = APIRouter()

cas_client = CASClient(
    version=2,
    service_url=f"{config.CONFIG.api_url}/login?next=%2Fprofile",
    server_url=f"{config.CONFIG.cas_server_url}",
)

@router.get("/login", tags=["auth"])
def login(request: Request, next: Optional[str] = None, ticket: Optional[str] = None):
    if request.session.get("user", None):
        # Already logged in
        return RedirectResponse(request.url_for("profile"))

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        return RedirectResponse(cas_login_url)

    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    if not user:
        return HTMLResponse('Failed to verify ticket. <a href="/login">Login</a>')
    else:  # Login successfully, redirect according `next` query parameter.
        if not next:
            return
        response = RedirectResponse(next)
        request.session["user"] = dict(user=attributes.ugentStudentID)
        return response

@router.get("/profile",tags=["auth"], response_model=User)
async def profile(request: Request, user: User = Depends(get_authenticated_user)):
    return user


@router.get("/logout",tags=["auth"])
def logout(request: Request):
    redirect_url = request.url_for("logout_callback")
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    print("CAS logout URL: %s", cas_logout_url)
    return RedirectResponse(cas_logout_url)


@router.get("/logout_callback",tags=["auth"])
def logout_callback(request: Request):
    # redirect from CAS logout request after CAS logout successfully
    request.session.pop("user", None)
    return HTMLResponse('Logged out from CAS. <a href="/login">Login</a>')
