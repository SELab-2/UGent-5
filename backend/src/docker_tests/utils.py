import docker

from src.submission.schemas import Submission
from src.submission.utils import get_submission_path, get_artifacts_path


def launch_docker_tests(submission: Submission):
    submission_dir = get_submission_path(submission.files_uuid)
    artifact_dir = get_artifacts_path(submission.files_uuid)
    run_docker_tests_detatched(submission_dir, artifact_dir)


async def build_image():
    client = docker.from_env()

    client.images.build(
        path='/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/',
        dockerfile="/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/default_image.dockerfile",
        tag="default_image",
        forcerm=True
    )
    client.images.prune()


async def run_docker_tests_detatched(submission_dir: str, artifact_dir: str):
    checks_dir = '/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/checks'
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
