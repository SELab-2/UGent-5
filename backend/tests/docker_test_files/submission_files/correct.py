import time
import sys


def questionable_code(path):
    time.sleep(0.5)
    print("hello stdout")
    print("hello stderr", file=sys.stderr)

    with open(path, "w") as f:
        f.write("Artifact gegenereerd!")
