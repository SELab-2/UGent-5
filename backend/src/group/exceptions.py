from fastapi import HTTPException


class GroupNotFound(HTTPException):
    def __init__(self):
        """Raised when group not found in database"""
        super().__init__(status_code=404, detail="Group not found")

class NotAuthorized(HTTPException):
    def __init__(self):
        """Raised when user is not privileged enough to do this action"""
        super().__init__(status_code=403, detail="Not Authorized")