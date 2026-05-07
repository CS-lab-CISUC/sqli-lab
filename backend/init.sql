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
