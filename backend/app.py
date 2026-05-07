import os
import psycopg
from flask import Flask, request, jsonify

app = Flask(__name__)

DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]

def get_conn():
    return psycopg.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        dbname=DB_NAME,
    )

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                query = f"SELECT id, username, role FROM users WHERE username = '{username}' AND password = '{password}'"
                cur.execute(query)
                user = cur.fetchone()
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    if user:
        return jsonify({"message": "Login successful", "username": user[1], "role": user[2]})
    return jsonify({"message": "Invalid credentials"}), 401
