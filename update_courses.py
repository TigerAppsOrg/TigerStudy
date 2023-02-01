from database import reset_classes
from sys import argv, exit

if __name__ == "__main__":
    if len(argv) != 2:
        print("Missing netID argument: python update_courses.py netID")
        exit(1)

    netid = argv[1]
    reset_classes(netid)
