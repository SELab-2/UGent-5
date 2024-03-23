import docker

async def build_image():
    client = docker.from_env()

    client.images.build(
        path='/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/', 
        dockerfile="/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/default_image.dockerfile",
        tag="default_image",
        forcerm=True
    )
    client.images.prune()


async def run_docker_tests_detatched():
    client = docker.from_env()
    container = client.containers.run(
        image='default_image',
        volumes={
            '/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_default/checks': {'bind': '/checks', 'mode': 'ro'},
            '/Users/pieterjanin/docker_example_bash/submission1': {'bind': '/submission', 'mode': 'ro'},
            '/Users/pieterjanin/docker_example_bash/out': {'bind': '/artifacts', 'mode': 'rw'}
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
