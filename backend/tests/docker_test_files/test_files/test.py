import os

from submission.submission import questionable_code


def main():
    with open(os.environ['CORRECT'], 'w') as correct, open(os.environ['FAILED'], 'w') as failed:
        correct.write("Eerste test geslaagd\n")

        try:
            questionable_code(os.path.join(os.environ['ARTIFACT_DIR'], "artifact.txt"))
            correct.write("Tweede test geslaagd\n")

        except RuntimeError:
            failed.write("Tweede test mislukt!\n")
            exit(-1)


if __name__ == "__main__":
    main()
