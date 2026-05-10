DROP TABLE IF EXISTS lista_vip;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS unsuspecting_table;
DROP TABLE IF EXISTS segredos;
DROP TABLE IF EXISTS bilhetes;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS entradas;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS waf_palavras_chave;
DROP TABLE IF EXISTS rce_cofre;
DROP TABLE IF EXISTS oob_relatorio_secreto;
DROP TABLE IF EXISTS olheiros;
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

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(10) NOT NULL
);

CREATE TABLE lista_vip (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    segredo VARCHAR(100) NOT NULL
);

INSERT INTO lista_vip (nome, segredo) VALUES
    ('Presidente', 'JUMENTOS{st0r3d_4nd_d4ng3r0us}');

CREATE USER sqli_level2 WITH PASSWORD 'level2pass';
GRANT SELECT ON bilhetes, unsuspecting_table TO sqli_level2;

CREATE USER sqli_level23 WITH PASSWORD 'level23pass';
GRANT SELECT ON bilhetes, lista_vip TO sqli_level23;
GRANT SELECT, INSERT ON reservas TO sqli_level23;
GRANT USAGE, SELECT ON SEQUENCE reservas_id_seq TO sqli_level23;

-- LEVEL 3

CREATE TABLE olheiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    alcunha VARCHAR(50) NOT NULL,
    nivel INTEGER NOT NULL
);

INSERT INTO olheiros (nome, alcunha, nivel) VALUES
    ('Burricão Silva', 'O Coiceiro', 8),
    ('Asinino Júnior', 'Patas Longas', 5),
    ('Jumentão Costa', 'O Teimoso', 6),
    ('Mulo Ferreira', 'Orelhas de Ouro', 7),
    ('Asno Rodrigues', 'O Rebuzno', 4);

CREATE TABLE oob_relatorio_secreto (
    id SERIAL PRIMARY KEY,
    segredo VARCHAR(100) NOT NULL
);

INSERT INTO oob_relatorio_secreto (segredo) VALUES ('JUMENTOS{dblink_0ut_0f_b4nd}');

CREATE TABLE rce_cofre (
    id SERIAL PRIMARY KEY,
    segredo VARCHAR(100) NOT NULL
);

INSERT INTO rce_cofre (segredo) VALUES ('JUMENTOS{c0py_t0_pr0gr4m_pwn3d}');

CREATE TABLE waf_palavras_chave (
    id SERIAL PRIMARY KEY,
    segredo VARCHAR(100) NOT NULL
);

INSERT INTO waf_palavras_chave (segredo) VALUES ('JUMENTOS{w4f_byp4ss3d}');

CREATE TABLE configuracoes (
    secao VARCHAR(50) NOT NULL,
    valor VARCHAR(200) NOT NULL
);

INSERT INTO configuracoes (secao, valor) VALUES
    ('db_version', 'PostgreSQL 16'),
    ('app_mode', 'producao'),
    ('max_connections', '100'),
    ('log_level', 'WARNING'),
    ('backup_schedule', '0 3 * * *');

CREATE USER sqli_level3 WITH PASSWORD 'level3pass';
GRANT SELECT ON olheiros, oob_relatorio_secreto, rce_cofre, waf_palavras_chave, configuracoes TO sqli_level3;

CREATE USER sqli_level3_rce WITH PASSWORD 'level3rcepass' SUPERUSER;
GRANT SELECT ON configuracoes, rce_cofre TO sqli_level3_rce;

CREATE EXTENSION IF NOT EXISTS dblink;
