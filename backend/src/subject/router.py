from fastapi import APIRouter

router = APIRouter(
    prefix = "/subject",
    tags = ["subject"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_subjects():
    pass

@router.get("/{subject_id}")
async def get_subject(subject_id: str):
    pass

@router.put("/{subject_id}")
async def update_subject(subject_id: str):
    pass
