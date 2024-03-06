import docker

async def build_image():
    client = docker.from_env()

    client.images.build(path="/Users/pieterjanin/docker_example_bash/", tag="docker_example", rm=True)


async def run_docker_tests_detatched():
    client = docker.from_env()
    container = client.containers.run(
        image='docker_example',
        volumes={
            '/Users/pieterjanin/docker_example_bash/submission2/': {'bind': '/runner/submission', 'mode': 'ro'},
            '/Users/pieterjanin/docker_example_bash/out': {'bind': '/runner/out', 'mode': 'rw'}
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
