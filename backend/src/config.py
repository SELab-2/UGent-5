from __future__ import annotations
from dotenv import load_dotenv
import os
from dataclasses import dataclass

load_dotenv()

@dataclass
class Config:
    api_url: str
    cas_server_url: str
    database_uri: str


CONFIG = Config(
    os.getenv("API_URL", "https://localhost:8000"),
    os.getenv("CAS_SERVER", "https://login.ugent.be"),
    os.getenv("DATABASE_URI", "CONNECtOON_STRING")
)
