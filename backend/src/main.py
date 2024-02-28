from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from src.subject.router import router as subject_router
from src.user.router import router as user_router
import src.user.models as user_models
import src.subject.models as subject_models
from .database import engine

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="!secret")

app.include_router(subject_router)
app.include_router(user_router)

@app.get("/api")
async def root():
    return {"message": "Hello World"}
