import os

from src import config


def get_checks_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "projects", uuid, *paths))
