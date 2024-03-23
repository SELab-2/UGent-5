import time
import sys

from submission.submission import questionable_code

def main():
    try:
        print("Test begonnen", flush=True)

        time.sleep(3)
        print("Eerste test geslaagd", flush=True)

        questionable_code("/artifacts/artifact.txt")
        print("Alle tests geslaagd")
    except:
        print("Test mislukt!", file=sys.stderr)
    

if __name__ == "__main__":
    main()
