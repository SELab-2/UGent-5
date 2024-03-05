import docker

async def build_image():
    client = docker.from_env()

    client.images.build(path="/Users/pieterjanin/docker_example_bash/", tag="docker_example")


def run_docker_tests():
    client = docker.from_env()
