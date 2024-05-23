import os
from submission import main

correct_path = os.environ["CORRECT"]
failed_path = os.environ["FAILED"]
failed_exit_code = int(os.environ["EXIT_TEST_FAILED"])

test_cases = [
    (0, 0, 0),
    (1, 2, 3),
    (3, 4, 7),
    (5, 6, 11),
    (7, 8, 15),
    (9, 10, 19),
    (11, 12, 23),
    (13, 14, 27),
    (15, 16, 31),
    (17, 18, 35),
    (19, 20, 39)
]

def run_tests():
    has_failed = False
    with open(correct_path, "w") as correct, open(failed_path, "w") as failed:
        for test in test_cases:
            a, b, expected = test
            result = main.sum(a, b)
            if result == expected:
                correct.write(f"{a} {b} {expected}\n")
            else:
                failed.write(f"{a} {b} {expected}\n")
                has_failed = True
    if has_failed:
        exit(failed_exit_code)

if __name__ == "__main__":
    run_tests()
