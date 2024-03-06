import jwt
from src import config
from src.auth.schemas import Token


def create_jwt_token(user_id: str) -> Token:
    payload = {
        "sub": user_id,
        # "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
    }
    token = jwt.encode(
        payload, config.CONFIG.secret_key, algorithm=config.CONFIG.algorithm
    )
    return Token(token=token, token_type="bearer")
