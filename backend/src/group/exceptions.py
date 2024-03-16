from fastapi import HTTPException


class GroupNotFound(HTTPException):
    def __init__(self):
        """Raised when group is not found in database"""
        super().__init__(status_code=404, detail="Group not found")


class AlreadyInGroup(HTTPException):
    def __init__(self):
        """Raised when person is already in group"""
        super().__init__(status_code=403, detail="Already in Group")
