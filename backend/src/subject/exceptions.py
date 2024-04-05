from fastapi import HTTPException


class SubjectNotFound(HTTPException):
    def __init__(self):
        """Raised when subject not found in database"""
        super().__init__(status_code=404, detail="Subject not found")

class AlreadyRegistered(HTTPException):
    def __init__(self):
        """"Raised when student wants to register to already joined subject"""
        super().__init__(status_code=403, detail="Already registered to subject")

class AlreadyInstructor(HTTPException):
    def __init__(self):
        """"Raised when user is already an instructor"""
        super().__init__(status_code=403, detail="Already instructor to subject")
