import sys
import time


def questionable_code(path):
    time.sleep(0.5)
    print("hello stdout")
    print("hello stderr", file=sys.stderr)

    raise RuntimeError()
