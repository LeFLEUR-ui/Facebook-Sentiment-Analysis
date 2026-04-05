def extract_comments(text):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    results = []
    i = 0

    while i < len(lines):
        line = lines[i]

        if re.match(r"^\d+[hd]$", line) or line in ["Reply", "Edited"]:
            i += 1
            continue

        if i + 1 < len(lines) and not re.match(r"^\d+[hd]$", lines[i + 1]) and lines[i + 1] not in ["Reply", "Edited"]:
            name = line
            comment_lines = []
            i += 1
            while i < len(lines) and not re.match(r"^\d+[hd]$", lines[i]) and lines[i] not in ["Reply", "Edited"] and not re.match(r"^[A-Za-z\s]+$", lines[i]):
                comment_lines.append(lines[i])
                i += 1

            if not comment_lines and i < len(lines):
                comment_lines.append(lines[i])
                i += 1

            results.append((name, " ".join(comment_lines).strip()))
        else:
            i += 1

    return results

if __name__ == "__main__":
    import re

    print("Paste your Facebook comment text (end input with an empty line):")
    lines = []
    while True:
        line = input()
        if line == "":
            break
        lines.append(line)

    text = "\n".join(lines)
    comments = extract_comments(text)

    print("\nExtracted Comments:\n")
    for name, comment in comments:
        print(f"Name: {name}")
        print(f"Comment: {comment}\n{'-'*40}")