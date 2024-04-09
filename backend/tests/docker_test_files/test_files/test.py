import os

from submission.submission import questionable_code


def main():
    with open(os.environ['CORRECT_PATH'], 'w') as correct, open(os.environ['FAILED_PATH'], 'w') as failed:

        correct.write("Eerste test geslaagd\n")

        try:
            questionable_code(os.path.join(os.environ['ARTIFACT_DIR'], "artifact.txt"))
            correct.write("Tweede test geslaagd\n")
        except:
            failed.write("Tweede test mislukt!\n")


if __name__ == "__main__":
    main()
