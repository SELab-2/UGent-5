from fastapi import HTTPException


class SubjectNotFound(HTTPException):
    def __init__(self):
        """Raised when subject not found in database"""
        super().__init__(status_code=404, detail="Subject not found")
