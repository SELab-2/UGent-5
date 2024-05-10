from typing import Generator, Any

import docker
from docker import DockerClient
from docker.errors import DockerException

from src.docker_tests.exceptions import DockerDeamonNotFound


def get_docker_client() -> Generator[DockerClient, Any, None]:
    """Creates docker client, which is closed afterwards"""
    client = docker.DockerClient(base_url='unix://var/run/docker.sock')

    try:
        yield client
    finally:
        client.close()
