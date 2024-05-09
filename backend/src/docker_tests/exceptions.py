from fastapi import HTTPException


class DockerDeamonNotFound(HTTPException):
    def __init__(self):
        """Raised when unable to instantiate docker client"""
        super().__init__(status_code=500, detail="Docker deamon not found or not running")
