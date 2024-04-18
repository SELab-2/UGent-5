from fastapi import HTTPException


class ProjectNotFound(HTTPException):
    def __init__(self):
        """Raised when project not found in db"""
        super().__init__(status_code=404, detail="Project not found")


class TestsNotFound(HTTPException):
    def __init__(self):
        """Raised when tests not found in a project"""
        super().__init__(status_code=404, detail="Tests not found")
