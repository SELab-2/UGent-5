import os
import shutil

import docker

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

    image_tag = build_image(tests_uuid)  # this will not consume time if image is already built

    # TODO: zorgen dat tests niet gemount worden als custom docker image gemaakt wordt
    run_docker_tests(
        image_tag,
        submission_path(submission_uuid),
        artifact_dir,
        feedback_dir,
        tests_path(tests_uuid),
    )

    print("correct: ", read_feedback_file(os.path.join(feedback_dir, "correct")))
    print("failed: ", read_feedback_file(os.path.join(feedback_dir, "failed")))

    # feedback is stored in the db only
    shutil.rmtree(feedback_dir)


def build_image(tests_uuid: str):
    client = docker.from_env()
    tests_dir = tests_path(tests_uuid)

    # build custom docker image if dockerfile is present in tests directory
    if os.path.isfile(os.path.join(tests_dir, "Dockerfile")):
        path = tests_dir
        tag = tests_uuid
    else:
        path = "src/docker_tests/docker_default"  # todo werkt niet in tests
        tag = "default_image"

    client.images.build(
        path=path,
        tag=tag,
        forcerm=True
    )
    client.images.prune()  # cleanup dangling images
    return tag


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
            'CORRECT_PATH': '/feedback/correct',
            'FAILED_PATH': '/feedback/failed',
            'TESTS_DIR': '/tests',
        },
        detach=False,
        remove=True,
        stdout=True,
        stderr=True,
    )
