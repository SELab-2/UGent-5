from fastapi import HTTPException


class SubmissionNotFound(HTTPException):
    def __init__(self):
        """Raised when submission not found in database"""
        super().__init__(status_code=404, detail="Submission not found")