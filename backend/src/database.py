from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from src import config

SQLALCHEMY_DATABASE_URL = config.CONFIG.database_uri

engine = create_engine(SQLALCHEMY_DATABASE_URL)
async_engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL[: len("postgresql")]
    + "+asyncpg"
    + SQLALCHEMY_DATABASE_URL[len("postgresql"):]
)

AsyncSessionLocal = async_sessionmaker(async_engine, autoflush=False)

Base = declarative_base()
