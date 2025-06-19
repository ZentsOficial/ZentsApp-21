-- Criar tabela dados_usuario se não existir
CREATE TABLE IF NOT EXISTS dados_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    nome_empresa VARCHAR(255),
    telefone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    id_acesso INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela produtos se não existir
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    codigo_da_peca VARCHAR(50) NOT NULL UNIQUE,
    id_do_vendedor INTEGER NOT NULL,
    modelo_da_peca VARCHAR(255) NOT NULL,
    tamanhos_disponiveis TEXT,
    cor VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    foto_do_produto TEXT,
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (id_do_vendedor) REFERENCES dados_usuario(id_acesso)
);

-- Inserir dados de exemplo se as tabelas estiverem vazias
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
SELECT 'Maria da Silva', 'Loja da Maria', '11987654321', 'maria@exemplo.com', '$2a$10$example.hash.here', 12345
WHERE NOT EXISTS (SELECT 1 FROM dados_usuario WHERE id_acesso = 12345);

-- Inserir produtos de exemplo
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
SELECT 'CAM001', 12345, 'Camiseta Básica Branca', 'P,M,G,GG', 'Branco', 49.90, '11987654321'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE codigo_da_peca = 'CAM001');

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
SELECT 'VES001', 12345, 'Vestido Floral Verão', 'P,M,G', 'Estampado', 89.90, '11987654321'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE codigo_da_peca = 'VES001');

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
SELECT 'CAL001', 12345, 'Calça Jeans Skinny', '36,38,40,42,44', 'Azul', 129.90, '11987654321'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE codigo_da_peca = 'CAL001');

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
SELECT 'BLU001', 12345, 'Blusa Cropped Rosa', 'P,M,G', 'Rosa', 39.90, '11987654321'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE codigo_da_peca = 'BLU001');

-- Verificar se as tabelas foram criadas corretamente
SELECT 'dados_usuario' as tabela, COUNT(*) as registros FROM dados_usuario
UNION ALL
SELECT 'produtos' as tabela, COUNT(*) as registros FROM produtos;
