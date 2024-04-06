import docker

from src.project.utils import get_checks_path
from src.submission.utils import get_submission_path, get_artifacts_path


def launch_docker_tests(submission_uuid: str, checks_uuid: str):
    submission_dir = get_submission_path(submission_uuid)
    artifact_dir = get_artifacts_path(submission_uuid)
    checks_dir = get_checks_path(checks_uuid)
    run_docker_tests_detached(submission_dir, artifact_dir, checks_dir)


async def build_image():
    client = docker.from_env()

    client.images.build(
        path='/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/',
        dockerfile="/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/default_image.dockerfile",
        tag="default_image",
        forcerm=True
    )
    client.images.prune()


def run_docker_tests_detached(submission_dir: str, artifact_dir: str, checks_dir: str):
    client = docker.from_env()
    container = client.containers.run(
        image='default_image',
        volumes={
            checks_dir: {'bind': '/checks', 'mode': 'ro'},
            submission_dir: {'bind': '/submission', 'mode': 'ro'},
            artifact_dir: {'bind': '/artifacts', 'mode': 'rw'}
        },
        detach=True,
        remove=True,
    )
    output = container.logs(stream=True)

    for log in output:
        print(log.decode('UTF-8'), end='')


async def run_docker_tests():
    client = docker.from_env()
    output = client.containers.run(image='default_image', remove=True, stream=True)

    for log in output:
        print(log.decode('UTF-8'), end='')
