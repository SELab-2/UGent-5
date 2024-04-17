import time


def questionable_code(path):
    time.sleep(0.5)

    with open(path, "w") as f:
        f.write("Artifact gegenereerd!")
