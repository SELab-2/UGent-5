import asyncio
import os
import shutil
from pathlib import Path

import docker
from docker.errors import ContainerError
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import AsyncSessionLocal
from src.dependencies import get_async_db
from src.docker_tests.utils import tests_path
from src.submission.models import Status
from src.submission.schemas import Submission
from src.submission.service import update_submission_status
from src.submission.utils import submission_path, artifacts_path, feedback_path


def touch(*paths: str):
    for path in paths:
        open(path, 'a').close()


def read_feedback_file(path: str) -> list[str]:
    with open(path, 'r') as f:
        test_feedback = f.readlines()
    return [line.strip() for line in test_feedback]


async def launch_docker_tests(submission: Submission, tests_uuid: str):
    artifact_dir = artifacts_path(submission.files_uuid)
    os.makedirs(artifact_dir)

    # create files for test feedback
    feedback_dir = feedback_path(submission.files_uuid)
    os.makedirs(feedback_dir)
    touch(os.path.join(feedback_dir, "correct"), os.path.join(feedback_dir, "failed"))

    # TODO: zorgen dat tests niet gemount worden als custom docker image gemaakt wordt
    # TODO: failed of succeeded afhankelijk van exit code, zodat tests optioneel kunnen zijn

    if os.path.isfile(os.path.join(tests_path(tests_uuid), "Dockerfile")):
        image_tag = tests_uuid
    else:
        # relative path independent of working dir (tests will break otherwise)
        path = os.path.join(Path(__file__).parent, "docker_default")  # path = "./docker_default"
        image_tag = "default_image"

        build_docker_image(path, image_tag)  # todo

    try:
        logs = await asyncio.to_thread(run_docker_tests,
            image_tag,
            submission_path(submission.files_uuid),
            artifact_dir,
            feedback_dir,
            tests_path(tests_uuid),
        )
        status = Status.Accepted
    except ContainerError as e:
        status = Status.Rejected
        print(e.stderr)  # todo

    # print(logs.decode('utf-8'))  # todo

    correct = read_feedback_file(os.path.join(feedback_dir, "correct"))
    failed = read_feedback_file(os.path.join(feedback_dir, "failed"))

    async with AsyncSessionLocal() as db:
        await update_submission_status(db, submission.id, status, correct, failed)

    # feedback is stored in the db only
    shutil.rmtree(feedback_dir)


def build_docker_image(path: str, tag: str):
    """Build a docker image from a directory where a file 'Dockerfile' is present"""
    client = docker.from_env()
    client.images.build(
        path=path,
        tag=tag,
        forcerm=True
    )
    client.images.prune()  # cleanup dangling images


def run_docker_tests(image_tag: str, submission_dir: str, artifact_dir: str, feedback_dir: str, tests_dir: str) -> str:
    client = docker.from_env()
    return client.containers.run(
        image=image_tag,
        volumes={
            submission_dir: {'bind': '/submission', 'mode': 'ro'},
            artifact_dir: {'bind': '/artifacts', 'mode': 'rw'},
            feedback_dir: {'bind': '/feedback', 'mode': 'rw'},
            tests_dir: {'bind': '/tests', 'mode': 'ro'},
        },
        environment={
            'SUBMISSION_DIR': '/submission',
            'ARTIFACT_DIR': '/artifacts',
            'CORRECT': '/feedback/correct',
            'FAILED': '/feedback/failed',
            'TESTS_DIR': '/tests',
        },
        detach=False,
        remove=True,
        stdout=True,
        stderr=True,
    )
