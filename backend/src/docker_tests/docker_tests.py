import os
import shutil
from pathlib import Path

import docker
from docker import DockerClient
from docker.errors import APIError
from docker.models.containers import Container
from sqlalchemy.ext.asyncio import AsyncSession

from src.docker_tests.utils import tests_path, submission_path, feedback_path, artifacts_path, to_async, touch
from src.submission.models import Status
from src.submission.schemas import TestResult
from src.submission.service import update_submission_status

# if a container exits with this code, the test failed (exit 0 means the test succeeded)
EXIT_TEST_FAILED = 10


def read_feedback_file(path: str) -> list[str]:
    with open(path, 'r') as f:
        test_feedback = f.readlines()
    return [line.strip() for line in test_feedback]


async def launch_docker_tests(
    submission_id: int,
    submission_uuid: str,
    tests_uuid: str,
    db: AsyncSession,
    client: DockerClient
):
    artifact_dir = artifacts_path(submission_uuid)
    os.makedirs(artifact_dir)

    # create files for test feedback
    feedback_dir = feedback_path(submission_uuid)
    os.makedirs(feedback_dir)
    touch(os.path.join(feedback_dir, "correct"), os.path.join(feedback_dir, "failed"))

    if using_default_docker_image(tests_uuid):
        # relative path independent of working dir (tests will break otherwise)
        # path = "./docker_default"
        path = os.path.join(Path(__file__).parent, "docker_default")
        image_tag = "default_image"
        tests_dir = tests_path(tests_uuid)

        # rebuild default image if changes were made
        await build_docker_image(path, image_tag, client)
    else:
        image_tag = tests_uuid
        tests_dir = None

    container = create_container(
        image_tag,
        submission_path(submission_uuid),
        artifact_dir,
        feedback_dir,
        tests_dir,
        client,
    )

    try:
        container.start()
        exit_code = (await wait_until_exit(container))['StatusCode']

        if exit_code == 0:
            status = Status.Accepted
        elif exit_code == EXIT_TEST_FAILED:
            status = Status.Rejected
        else:
            status = Status.Crashed

        test_results = []
        for line in read_feedback_file(os.path.join(feedback_dir, "correct")):
            test_results.append(TestResult(succeeded=True, value=line))
        for line in read_feedback_file(os.path.join(feedback_dir, "failed")):
            test_results.append(TestResult(succeeded=False, value=line))

        stdout = container.logs(stdout=True, stderr=False).decode("utf-8")
        stderr = container.logs(stdout=False, stderr=True).decode("utf-8")

    except APIError as e:
        status = Status.Crashed
        test_results = []
        stdout = None
        stderr = str(e)

    container.remove()

    await update_submission_status(
        db, submission_id, status, test_results,
        stdout=stdout if stdout else None,
        stderr=stderr if stderr else None,
    )

    await db.close()

    # feedback is stored in the db only
    shutil.rmtree(feedback_dir)


@to_async
def build_docker_image(path: str, tag: str, client: DockerClient):
    """Build a docker image from a directory where a file 'Dockerfile' is present"""
    client.images.build(
        path=path,
        tag=tag,
        forcerm=True
    )
    client.images.prune()  # cleanup dangling images


def remove_docker_image_if_exists(tag: str, client: DockerClient):
    try:
        client.images.remove(tag)
    except docker.errors.NotFound:
        pass

    client.images.prune()


def using_default_docker_image(tests_uuid: str) -> bool:
    return not os.path.isfile(os.path.join(tests_path(tests_uuid), "Dockerfile"))


def create_container(
    image_tag: str, submission_dir: str, artifact_dir: str, feedback_dir: str, tests_dir: str | None,
    client: DockerClient
) -> Container:
    volumes = {
        submission_dir: {'bind': '/submission', 'mode': 'ro'},
        artifact_dir: {'bind': '/artifacts', 'mode': 'rw'},
        feedback_dir: {'bind': '/feedback', 'mode': 'rw'},
    }

    # only mount test files for default image
    if tests_dir is not None:
        volumes[tests_dir] = {'bind': '/tests', 'mode': 'ro'}

    return client.containers.create(
        image=image_tag,
        volumes=volumes,
        environment={
            'SUBMISSION_DIR': '/submission',
            'ARTIFACT_DIR': '/artifacts',
            'CORRECT': '/feedback/correct',
            'FAILED': '/feedback/failed',
            'TESTS_DIR': '/tests',
            'EXIT_TEST_FAILED': EXIT_TEST_FAILED,
        },
        detach=True,
    )  # pyright: ignore


@to_async
def wait_until_exit(container: Container) -> dict:
    return container.wait()
