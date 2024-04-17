from fastapi import HTTPException


class TestsNotFound(HTTPException):
    def __init__(self):
        """Raised when tests not found in a project"""
        super().__init__(status_code=404, detail="Tests not found")
