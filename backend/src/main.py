from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from src.subject.router import router as subject_router
from src.user.router import router as user_router
from src.project.router import router as project_router
from src.auth.router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from src import config

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="!secret")

origins = [config.CONFIG.frontend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subject_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(auth_router)


@app.get("/api")
async def root():
    return {"message": "Hello World"}
