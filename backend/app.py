import os
from datetime import datetime, timezone, timedelta
from functools import wraps

import jwt
import psycopg
from flask import Flask, request, jsonify

app = Flask(__name__)

DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_GOAT_USER = os.environ["DB_GOAT_USER"]
DB_GOAT_PASSWORD = os.environ["DB_GOAT_PASSWORD"]
DB_LEVEL2_USER = os.environ["DB_LEVEL2_USER"]
DB_LEVEL2_PASSWORD = os.environ["DB_LEVEL2_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-prod")

def get_conn():
    return psycopg.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME,
    )

def get_conn_goat():
    return psycopg.connect(
        host=DB_HOST, user=DB_GOAT_USER, password=DB_GOAT_PASSWORD, dbname=DB_NAME,
    )

def get_conn_level2():
    return psycopg.connect(
        host=DB_HOST, user=DB_LEVEL2_USER, password=DB_LEVEL2_PASSWORD, dbname=DB_NAME,
    )

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
        token = auth[7:]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = payload
        return f(*args, **kwargs)
    return decorated


# LEVEL 1

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                query = f"SELECT id, username, role FROM jumentususers WHERE username = '{username}' AND password = '{password}'"
                cur.execute(query)
                user = cur.fetchone()
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if user:
        token = jwt.encode(
            {
                "sub": user[1],
                "role": user[2],
                "exp": datetime.now(timezone.utc) + timedelta(hours=12),
            },
            JWT_SECRET,
            algorithm="HS256",
        )
        return jsonify({"message": "Login successful", "username": user[1], "role": user[2], "token": token})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/entradas", methods=["GET"])
@require_auth
def entradas():
    search = request.args.get("search", "")
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                query = f"SELECT id, nome, secao, data, confidencial FROM entradas WHERE nome LIKE '%{search}%' AND confidencial = 0"
                cur.execute(query)
                rows = cur.fetchall()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify([{"id": r[0], "nome": r[1], "secao": r[2], "data": r[3], "confidencial": r[4]} for r in rows])

@app.route("/api/transfers", methods=["GET"])
@require_auth
def transfers():
    search = request.args.get("search", "")
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                query = f"SELECT * FROM transfers WHERE nome LIKE '%{search}%'"
                cur.execute(query)
                rows = cur.fetchall()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify([{"id": r[0], "nome": r[1], "origem": r[2], "destino": r[3], "valor": r[4]} for r in rows])

@app.route("/api/perfil", methods=["GET"])
@require_auth
def perfil():
    player_id = request.args.get("id", "")
    try:
        with get_conn_goat() as conn:
            with conn.cursor() as cur:
                query = f"SELECT id, nome FROM transfers WHERE id = {player_id}"
                cur.execute(query)
                row = cur.fetchone()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    if row:
        return jsonify({"encontrado": True})
    return jsonify({"encontrado": False})


# LEVEL 2

@app.route("/api/bilhete", methods=["GET"])
def bilhete():
    codigo = request.args.get("codigo", "")
    try:
        with get_conn_level2() as conn:
            with conn.cursor() as cur:
                query = f"SELECT id FROM bilhetes WHERE codigo = '{codigo}' AND disponivel = TRUE"
                cur.execute(query)
                row = cur.fetchone()
    except Exception as e:
        return jsonify({"disponivel": False}), 500
    return jsonify({"disponivel": row is not None})

@app.route("/api/reservar", methods=["POST"])
def reservar():
    data = request.get_json(silent=True) or {}
    nome = data.get("nome", "")
    codigo = data.get("codigo", "")
    if not nome or not codigo:
        return jsonify({"error": "Nome e código são obrigatórios"}), 400
    try:
        with get_conn_level2() as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO reservas (nome, codigo) VALUES (%s, %s)", (nome, codigo))
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro"}), 500
    return jsonify({"message": f"Reserva registada para {nome}."})

@app.route("/api/ver-reserva", methods=["GET"])
def ver_reserva():
    codigo = request.args.get("codigo", "")
    try:
        with get_conn_level2() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT nome FROM reservas WHERE codigo = %s LIMIT 1", (codigo,))
                row = cur.fetchone()
                if not row:
                    return jsonify({"error": "Reserva não encontrada"}), 404
                nome = row[0]
                query = f"SELECT b.setor FROM bilhetes b JOIN reservas r ON b.codigo = r.codigo WHERE r.nome = '{nome}'"
                cur.execute(query)
                row2 = cur.fetchone()
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro"}), 500
    return jsonify({"setor": row2[0] if row2 else None})
