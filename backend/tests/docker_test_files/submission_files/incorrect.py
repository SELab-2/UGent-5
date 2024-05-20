import sys


def questionable_code(path):
    print("hello stdout")
    print("hello stderr", file=sys.stderr)

    return "wrong"
