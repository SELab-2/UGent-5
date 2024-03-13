import docker

async def build_image():
    client = docker.from_env()

    client.images.build(path="/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_base", tag="docker_base", rm=True)
    client.images.build(path="/Users/pieterjanin/UGent-5/backend/src/docker_tests/docker_example", tag="docker_example", rm=True)
    client.images.prune()


async def run_docker_tests_detatched():
    client = docker.from_env()
    container = client.containers.run(
        image='docker_example',
        volumes={
            '/Users/pieterjanin/docker_example_bash/submission2/': {'bind': '/submission', 'mode': 'ro'},
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
    output = client.containers.run(image='docker_example', remove=True, stream=True)

    for log in output:
        print(log.decode('UTF-8'), end='')
