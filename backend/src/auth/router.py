from sqlalchemy.ext.asyncio import AsyncSession
import src.user.service as user_service
from cas import CASClient
from fastapi import APIRouter, Depends, Request
from src import config
from src.auth.schemas import Authority, Token, TokenRequest
from src.dependencies import get_async_db
from src.user.schemas import UserCreate

from .exceptions import UnAuthenticated
from .utils import create_jwt_token

router = APIRouter(
    prefix="/api/auth", tags=["auth"], responses={404: {"description": "Not Found"}}
)

cas_client = CASClient(
    version=2,
    server_url=f"{config.CONFIG.cas_server_url}",
)


@router.get("/authority")
def authority() -> Authority:
    """
    Get CAS authority
    """
    return Authority(method="cas", authority=config.CONFIG.cas_server_url)


@router.post("/token")
async def token(
    request: Request,
    token_request: TokenRequest,
    db: AsyncSession = Depends(get_async_db),
) -> Token:
    """
    Get JWT token from CAS ticket
    """
    # No ticket provided
    if not token_request.ticket:
        raise UnAuthenticated(detail="No ticket provided")

    cas_client.service_url = f"{request.headers.get('origin')}{token_request.returnUrl}"
    user, attributes, _ = cas_client.verify_ticket(token_request.ticket)
    print(attributes)

    # Invalid ticket
    if not user or not attributes:
        raise UnAuthenticated(detail="Invalid CAS ticket")
    # Create user if not exists
    if not await user_service.get_by_id(db, attributes["uid"]):
        await user_service.create_user(
            db,
            UserCreate(
                given_name=attributes["givenname"],
                surname=attributes["surname"],
                uid=attributes["uid"],
                mail=attributes["mail"],
            ),
        )

    # Create JWT token
    jwt_token = create_jwt_token(attributes["uid"])
    return jwt_token
