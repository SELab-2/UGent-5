import src.user.service as user_service
from cas import CASClient
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from src import config
from src.auth.schemas import Token, TokenRequest
from src.dependencies import get_db
from src.user.schemas import UserCreate

from .service import create_jwt_token

router = APIRouter(
    prefix="/api", tags=["auth"], responses={404: {"description": "Not Found"}}
)

cas_client = CASClient(
    version=2,
    # service_url=f"{config.CONFIG.frontend_url}/login",
    server_url=f"{config.CONFIG.cas_server_url}",
)


@router.get("/authority", tags=["auth"])
def authority():
    return {"method": "cas", "authority": config.CONFIG.cas_server_url}


@router.post("/token", tags=["auth"], response_model=Token)
async def token(
    request: Request,
    token_request: TokenRequest,
    db: Session = Depends(get_db),
):
    if not token_request.ticket:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No ticket provided"
        )

    cas_client.service_url = f"{request.headers.get('origin')}{token_request.returnUrl}"
    user, attributes, _ = cas_client.verify_ticket(token_request.ticket)

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
