-- ============================================
-- SCRIPT SIMPLES PARA CRIAR BANCO ZENTS
-- ============================================

-- Criar tabela dados_usuario
CREATE TABLE IF NOT EXISTS dados_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    nome_empresa VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    id_acesso INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_telefone ON dados_usuario(telefone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_email ON dados_usuario(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_id_acesso ON dados_usuario(id_acesso);

-- Criar tabela produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    codigo_da_peca VARCHAR(50) NOT NULL,
    id_do_vendedor INTEGER NOT NULL,
    modelo_da_peca VARCHAR(255) NOT NULL,
    tamanhos_disponiveis TEXT,
    cor VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    foto_do_produto TEXT,
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice único para código da peça
CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_codigo ON produtos(codigo_da_peca);

-- Inserir dados de exemplo
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES 
    ('Maria da Silva', 'Boutique Maria', '11987654321', 'maria@boutique.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 12345),
    ('João Santos', 'Moda João', '11912345678', 'joao@moda.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 54321),
    ('Ana Costa', 'Ana Fitness', '11999887766', 'ana@fitness.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 67890)
ON CONFLICT (telefone) DO NOTHING;

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('MAR001', 12345, 'Vestido Floral', 'P,M,G', 'Rosa', 129.90, '11987654321'),
    ('MAR002', 12345, 'Blusa Cropped', 'P,M,G,GG', 'Branco', 59.90, '11987654321'),
    ('JOA001', 54321, 'Camisa Social', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('JOA002', 54321, 'Calça Jeans', '38,40,42,44', 'Azul', 149.90, '11912345678'),
    ('ANA001', 67890, 'Legging Fitness', 'P,M,G', 'Preto', 79.90, '11999887766'),
    ('ANA002', 67890, 'Top Fitness', 'P,M,G', 'Rosa', 45.90, '11999887766')
ON CONFLICT (codigo_da_peca) DO NOTHING;

-- Verificar se tudo foi criado
SELECT 'TABELAS CRIADAS:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('dados_usuario', 'produtos');

SELECT 'DADOS INSERIDOS:' as status;
SELECT COUNT(*) as usuarios FROM dados_usuario;
SELECT COUNT(*) as produtos FROM produtos;

SELECT 'USUÁRIOS CADASTRADOS:' as status;
SELECT id_acesso, nome_completo, telefone FROM dados_usuario ORDER BY id_acesso;
