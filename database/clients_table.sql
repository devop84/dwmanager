-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    nome_cliente VARCHAR(255),
    tel_celular VARCHAR(50),
    email VARCHAR(255),
    nacionalidade VARCHAR(100),
    obs TEXT,
    cpf VARCHAR(20),
    data_nasc DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_nome ON clients(nome_cliente);

