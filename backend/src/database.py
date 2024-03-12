from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from src import config

SQLALCHEMY_DATABASE_URL = config.CONFIG.database_uri

# TODO: migrate full codebase to async
engine = create_engine(SQLALCHEMY_DATABASE_URL)
async_engine = create_async_engine(SQLALCHEMY_DATABASE_URL[:len(
    "postgresql")] + "+asyncpg" + SQLALCHEMY_DATABASE_URL[len("postgresql"):])

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
AsyncSessionLocal = async_sessionmaker(async_engine, autoflush=False)

Base = declarative_base()
