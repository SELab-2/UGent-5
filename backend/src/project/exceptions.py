# exceptions.py

from fastapi import HTTPException

def NoProjectsFoundException(subject_id: int):
    return HTTPException(status_code=404, detail=f"No projects found for subject {subject_id}")

def UnauthorizedToCreateProjectException():
    return HTTPException(status_code=403, detail="User is not authorized to create projects for this subject")

def ProjectNotFoundException():
    return HTTPException(status_code=404, detail="Project not found")

def UnauthorizedToDeleteProjectException():
    return HTTPException(status_code=403, detail="User is not authorized to delete this project")

def UnauthorizedToUpdateProjectException():
    return HTTPException(status_code=403, detail="User is not authorized to update projects for this subject")
