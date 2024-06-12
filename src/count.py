import os


def count_lines_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        return sum(1 for _ in file)


def count_lines_in_directory(directory):
    total_lines = 0
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if ".pio" in file_path:
                print(file_path)
                continue
            total_lines += count_lines_in_file(file_path)
    return total_lines


if __name__ == "__main__":
    current_directory = os.getcwd()
    total_lines = count_lines_in_directory(current_directory)
    print(f"Total lines in all documents: {total_lines}")
