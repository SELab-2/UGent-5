import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    frontend_url: str
    cas_server_url: str
    database_uri: str
    secret_key: str
    algorithm: str


CONFIG = Config(
    frontend_url=os.getenv("FRONTEND_URL", "https://localhost:8000"),
    cas_server_url=os.getenv("CAS_SERVER", "https://localhost:8001"),
    database_uri=os.getenv("DATABASE_URI", "CONNECTION_STRING"),
    secret_key=os.getenv("SECRET_KEY", "test"),
    algorithm=os.getenv("ALGORITHM", "HS256"),
)
