DROP TABLE IF EXISTS unsuspecting_table;
DROP TABLE IF EXISTS segredos;
DROP TABLE IF EXISTS bilhetes;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS entradas;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS jumentususers;

CREATE TABLE jumentususers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member'
);

INSERT INTO jumentususers (username, password, role) VALUES
    ('admin', 'sup3rs3cr3t', 'admin'),
    ('cristiano', 'goat7', 'goat');

CREATE TABLE entradas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    secao VARCHAR(50) NOT NULL,
    data VARCHAR(20) NOT NULL,
    confidencial INTEGER NOT NULL DEFAULT 0
);

INSERT INTO entradas (nome, secao, data, confidencial) VALUES
    ('João Silva', 'Bancada Norte', '2026-05-15', 0),
    ('Pedro Ferreira', 'Bancada Sul', '2026-05-15', 0),
    ('Maria Santos', 'Tribuna Oficial', '2026-05-15', 0),
    ('António Costa', 'Bancada Norte', '2026-05-20', 0),
    ('Rui Almeida', 'Bancada Poente', '2026-05-20', 0),
    ('Luís Gomes', 'Bancada Sul', '2026-05-20', 0),
    ('Carlos Mendes', 'Setor VIP — Restrito', '2026-05-15', 1),
    ('Diretora Jumentos FC', 'Sala de Reuniões — Confidencial', '2026-05-15', 1),
    ('Agente PROSegur', 'Cofre Central — Acesso Restrito', '2026-05-20', 1),
    ('Informático', 'Sala dos Servidores — Acesso Restrito', '2026-05-20', 1);

CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    valor VARCHAR(20) NOT NULL,
    temporada VARCHAR(10) NOT NULL,
    altura INTEGER NOT NULL,
    tamanho_equipamento VARCHAR(1) NOT NULL,
    posicao VARCHAR(50) NOT NULL,
    idade INTEGER NOT NULL
);

INSERT INTO transfers (nome, origem, destino, valor, temporada, altura, tamanho_equipamento, posicao, idade) VALUES
    ('Ronaldico', 'Real Madridão', 'Jumentos FC', '€85M', '2025/26', 190, 'M', 'Central', 29),
    ('Buffão', 'Napolitano FC', 'Jumentos FC', '€20M', '2025/26', 195, 'L', 'Guarda-Redes', 38),
    ('Zidinho', 'Jumentos FC', 'Olympique de Burro', '€40M', '2025/26', 185, 'M', 'Médio Ofensivo', 32),
    ('Pirlaneti', 'AC Minhoca', 'Jumentos FC', '€15M', '2025/26', 180, 'S', 'Extremo', 27),
    ('De Brujno', 'Cityzen FC', 'Jumentos FC', '€95M', '2025/26', 188, 'M', 'Médio Centro', 30),
    ('Cannavaro Jr.', 'Jumentos FC', 'Inter Burrico', '€10M', '2025/26', 182, 'M', 'Defesa Central', 31);

CREATE TABLE segredos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL
);

INSERT INTO segredos (descricao, valor) VALUES
    ('flag', 'JUMENTOS{err0r_b4s3d_pwn3d}');

CREATE TABLE bilhetes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    setor VARCHAR(50) NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO bilhetes (codigo, setor, disponivel) VALUES
    ('A1',  'Tribuna Norte',   TRUE),
    ('A2',  'Tribuna Norte',   FALSE),
    ('B7',  'Tribuna Sul',     TRUE),
    ('C12', 'Bancada Lateral', TRUE),
    ('D3',  'Tribuna Sul',     FALSE),
    ('E5',  'Camarote VIP',    TRUE);

CREATE USER sqli_app WITH PASSWORD 'sqli_app_pass';
GRANT SELECT ON jumentususers, entradas, transfers TO sqli_app;

CREATE USER sqli_goat WITH PASSWORD 'sqli_goat_pass';
GRANT SELECT ON transfers, segredos TO sqli_goat;

CREATE TABLE unsuspecting_table (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    juice VARCHAR(100) NOT NULL
);

INSERT INTO unsuspecting_table (descricao, juice) VALUES
    ('flag', 'JUMENTOS{bl1nd_4s_4_d0nk3y}');

CREATE USER sqli_level2 WITH PASSWORD 'level2pass';
GRANT SELECT ON bilhetes, unsuspecting_table TO sqli_level2;
