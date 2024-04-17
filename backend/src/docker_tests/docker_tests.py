import asyncio
import os
import shutil
from pathlib import Path

import docker
from docker.models.containers import Container
from sqlalchemy.ext.asyncio import AsyncSession

from src.docker_tests.utils import tests_path, submission_path, feedback_path, artifacts_path
from src.submission.models import Status, ResultType
from src.submission.schemas import TestResult
from src.submission.service import update_submission_status


# if a container exits with this code, the test failed (exit 0 means the test succeeded)
EXIT_TEST_FAILED = 10


def touch(*paths: str):
    for path in paths:
        open(path, 'a').close()


def read_feedback_file(path: str) -> list[str]:
    with open(path, 'r') as f:
        test_feedback = f.readlines()
    return [line.strip() for line in test_feedback]


async def launch_docker_tests(db: AsyncSession, submission_id: int, submission_uuid: str, tests_uuid: str):
    artifact_dir = artifacts_path(submission_uuid)
    os.makedirs(artifact_dir)

    # create files for test feedback
    feedback_dir = feedback_path(submission_uuid)
    os.makedirs(feedback_dir)
    touch(os.path.join(feedback_dir, "correct"), os.path.join(feedback_dir, "failed"))

    # TODO: zorgen dat tests niet gemount worden als custom docker image gemaakt wordt

    if using_default_docker_image(tests_uuid):
        # relative path independent of working dir (tests will break otherwise)
        # path = "./docker_default"
        path = os.path.join(Path(__file__).parent, "docker_default")
        image_tag = "default_image"

        # rebuild default image if changes were made
        await asyncio.to_thread(build_docker_image, path, image_tag)
    else:
        image_tag = tests_uuid

    test_results = []
    container = run_docker_tests(
        image_tag,
        submission_path(submission_uuid),
        artifact_dir,
        feedback_dir,
        tests_path(tests_uuid),
    )
    exit_code = (await asyncio.to_thread(container.wait))['StatusCode']

    if exit_code == 0:
        status = Status.Accepted
    elif exit_code == EXIT_TEST_FAILED:
        status = Status.Rejected
    else:
        status = Status.Crashed

    test_results.append(TestResult(type=ResultType.StdOut,
                        value=container.logs(stdout=True, stderr=False)))
    test_results.append(TestResult(type=ResultType.StdErr,
                        value=container.logs(stdout=False, stderr=True)))

    container.remove()

    for line in read_feedback_file(os.path.join(feedback_dir, "correct")):
        test_results.append(TestResult(type=ResultType.OK, value=line))
    for line in read_feedback_file(os.path.join(feedback_dir, "failed")):
        test_results.append(TestResult(type=ResultType.Failed, value=line))

    await update_submission_status(db, submission_id, status, test_results)
    await db.close()

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


def using_default_docker_image(tests_uuid: str) -> bool:
    return not os.path.isfile(os.path.join(tests_path(tests_uuid), "Dockerfile"))


def run_docker_tests(
    image_tag: str, submission_dir: str, artifact_dir: str, feedback_dir: str, tests_dir: str
) -> Container:
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
            'EXIT_TEST_FAILED': EXIT_TEST_FAILED,
        },
        detach=True,
        stdout=True,
        stderr=True,
    )  # pyright: ignore
