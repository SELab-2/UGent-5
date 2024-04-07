import os
import shutil

import docker

from src.project.utils import get_tests_path
from src.submission.utils import get_submission_path, get_artifacts_path, get_feedback_path


def touch(*paths: str):
    for path in paths:
        open(path, 'a').close()


def read_feedback_file(path: str) -> list[str]:
    with open(path, 'r') as f:
        test_feedback = f.readlines()
    return [line.strip() for line in test_feedback]


def launch_docker_tests(submission_uuid: str, tests_uuid: str):
    artifact_dir = get_artifacts_path(submission_uuid)
    os.makedirs(artifact_dir)

    # create files for test feedback
    feedback_dir = get_feedback_path(submission_uuid)
    os.makedirs(feedback_dir)
    touch(os.path.join(feedback_dir, "correct"), os.path.join(feedback_dir, "failed"))

    build_image(tests_uuid)  # this will not consume time if image is already built

    run_docker_tests(
        get_submission_path(submission_uuid),
        artifact_dir,
        feedback_dir,
        get_tests_path(tests_uuid),
    )

    print("correct: ", read_feedback_file(os.path.join(feedback_dir, "correct")))
    print("failed: ", read_feedback_file(os.path.join(feedback_dir, "failed")))

    # feedback is stored in the db
    shutil.rmtree(feedback_dir)


def build_image(checks_uuid: str):
    client = docker.from_env()
    checks_dir = get_tests_path(checks_uuid)

    # build custom docker image if dockerfile is present in checks directory
    if os.path.isfile(os.path.join(checks_dir, "Dockerfile")):
        path = checks_dir
        tag = checks_uuid
    else:
        path = "src/docker_tests/docker_default"
        tag = "default_image"

    client.images.build(
        path=path,
        tag=tag,
        forcerm=True
    )
    client.images.prune()  # cleanup dangling images


def run_docker_tests(submission_dir: str, artifact_dir: str, feedback_dir: str, tests_dir: str) -> str:
    client = docker.from_env()
    return client.containers.run(
        image='default_image',
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
