import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from src.user.schemas import UserCreate

from src.user.service import set_admin
