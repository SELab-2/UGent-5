from fastapi import HTTPException


class UserNotFound(HTTPException):
    def __init__(self):
        """Raised when user not found in database"""
        super().__init__(status_code=404, detail="User not found")


class UnAuthenticated(HTTPException):
    def __init__(self):
        """Raised when user not logged in"""
        super().__init__(status_code=403, detail="Login required")


class NotAuthorized(HTTPException):
    def __init__(self):
        """Raised when user is not privileged enough to do this action"""
        super().__init__(status_code=403, detail="Not Authorized")
