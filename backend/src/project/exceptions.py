from fastapi import HTTPException


def ProjectNotFoundException():
    return HTTPException(status_code=404, detail="Project not found")
