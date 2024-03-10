from fastapi import HTTPException, status


class NotAuthorized(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        """Raised when user is not privileged enough to do this action"""
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class UnAuthenticated(HTTPException):
    def __init__(self, detail: str = "Login required"):
        """Raised when user not logged in"""
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
