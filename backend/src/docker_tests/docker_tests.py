import os
import shutil
from pathlib import Path

import docker
from docker.errors import ContainerError

from src.docker_tests.utils import tests_path
from src.submission.utils import submission_path, artifacts_path, feedback_path


def touch(*paths: str):
    for path in paths:
        open(path, 'a').close()


def read_feedback_file(path: str) -> list[str]:
    with open(path, 'r') as f:
        test_feedback = f.readlines()
    return [line.strip() for line in test_feedback]


def launch_docker_tests(submission_uuid: str, tests_uuid: str):
    artifact_dir = artifacts_path(submission_uuid)
    os.makedirs(artifact_dir)

    # create files for test feedback
    feedback_dir = feedback_path(submission_uuid)
    os.makedirs(feedback_dir)
    touch(os.path.join(feedback_dir, "correct"), os.path.join(feedback_dir, "failed"))

    # TODO: zorgen dat tests niet gemount worden als custom docker image gemaakt wordt

    if os.path.isfile(os.path.join(tests_path(tests_uuid), "Dockerfile")):
        image_tag = tests_uuid
    else:
        # relative path independent of working dir (tests will break otherwise)
        path = os.path.join(Path(__file__).parent, "docker_default")  # path = "./docker_default"
        image_tag = "default_image"

        build_docker_image(path, image_tag)  # todo

    try:
        logs = run_docker_tests(
            image_tag,
            submission_path(submission_uuid),
            artifact_dir,
            feedback_dir,
            tests_path(tests_uuid),
        )
    except ContainerError as e:
        print(e.stderr)  # todo

    print(logs.decode('utf-8'))

    print("correct: ", read_feedback_file(os.path.join(feedback_dir, "correct")))
    print("failed: ", read_feedback_file(os.path.join(feedback_dir, "failed")))

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
