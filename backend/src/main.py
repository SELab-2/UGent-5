from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from src import config
from src.auth.router import router as auth_router
from src.docker_tests.router import router as docker_router
from src.group.router import router as group_router
from src.project.router import router as project_router
from src.subject.router import router as subject_router
from src.submission.router import router as submission_router
from src.user.router import router as user_router

app = FastAPI(
    title="Apollo API",
)

app.add_middleware(SessionMiddleware, secret_key="!secret")

origins = [config.CONFIG.frontend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api")
async def root():
    return {
        "docs": "/api/docs",
        "authentication": auth_router.prefix,
        "profile": f"{user_router.prefix}/me",
        "subjects": subject_router.prefix,
        "projects": project_router.prefix,
        "groups": group_router.prefix,
    }

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(subject_router)
app.include_router(project_router)
app.include_router(group_router)
app.include_router(submission_router)
app.include_router(docker_router)
