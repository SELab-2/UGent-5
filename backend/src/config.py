from __future__ import annotations

import dataclasses
from dataclasses import dataclass

import yaml


@dataclass
class Config:
    api_url: str = "http://localhost:8000"
    cas_server_url: str = "http://localhost:8001"

    def read(self, config_file) -> Config:
        with open(config_file, "r") as file:
            user_config = yaml.safe_load(file)
            for field in dataclasses.fields(Config):
                user_value = user_config.get(field.name, getattr(self, field.name))
                setattr(self, field.name, user_value)
        return self


CONFIG = Config()
