import jwt
from src import config
from src.auth.schemas import Token
from datetime import datetime, timedelta, timezone


def create_jwt_token(user_id: str) -> Token:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        # TODO: don't hardcode this
        "exp": now + timedelta(weeks=1),
    }
    token = jwt.encode(
        payload, config.CONFIG.secret_key, algorithm=config.CONFIG.algorithm
    )
    return Token(token=token, token_type="bearer")
