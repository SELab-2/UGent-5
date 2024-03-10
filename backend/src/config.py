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


env = {
    "frontend_url": os.getenv("FRONTEND_URL", ""),
    "cas_server_url": os.getenv("CAS_SERVER", ""),
    "database_uri": os.getenv("DATABASE_URI", ""),
    "secret_key": os.getenv("SECRET_KEY", ""),
    "algorithm": os.getenv("ALGORITHM", ""),
}

for key, value in env.items():
    if value == "":
        raise ValueError(f"Environment variable {key} is not set")

CONFIG = Config(
    frontend_url=env["frontend_url"],
    cas_server_url=env["cas_server_url"],
    database_uri=env["database_uri"],
    secret_key=env["secret_key"],
    algorithm=env["algorithm"],
)
