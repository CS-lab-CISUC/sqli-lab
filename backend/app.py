import os
import psycopg
from flask import Flask

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

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
