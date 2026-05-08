CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member'
);

INSERT INTO users (username, password, role) VALUES
    ('admin', 'sup3rs3cr3t', 'admin'),
    ('cristiano', 'goat7', 'member'),
    ('buffon', 'gigi77', 'member')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS entradas (
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
    ('Agente PROSegur', 'Cofre Central — Acesso Restrito', '2026-05-20', 1);
