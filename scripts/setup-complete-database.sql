-- Criar tabela dados_usuario com a estrutura completa
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

-- Criar índices únicos para dados_usuario
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

-- Inserir usuário de exemplo (Maria da Silva - ID de acesso 12345)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'Maria da Silva',
    'Loja da Maria',
    '11987654321',
    'maria@lojadamaria.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    12345
) ON CONFLICT (id_acesso) DO NOTHING;

-- Inserir usuário de exemplo (João Santos - ID de acesso 54321)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'João Santos',
    'Boutique João',
    '11912345678',
    'joao@boutiquejoao.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    54321
) ON CONFLICT (id_acesso) DO NOTHING;

-- Inserir produtos da Maria (ID de acesso 12345)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('CAM001', 12345, 'Camiseta Básica Branca', 'P,M,G,GG', 'Branco', 49.90, '11987654321'),
    ('VES001', 12345, 'Vestido Floral Verão', 'P,M,G', 'Estampado', 89.90, '11987654321'),
    ('CAL001', 12345, 'Calça Jeans Skinny', '36,38,40,42,44', 'Azul', 129.90, '11987654321'),
    ('BLU001', 12345, 'Blusa Cropped Rosa', 'P,M,G', 'Rosa', 39.90, '11987654321'),
    ('CAM002', 12345, 'Camiseta Estampada Preta', 'P,M,G,GG', 'Preto', 59.90, '11987654321'),
    ('VES002', 12345, 'Vestido Longo Elegante', 'P,M,G', 'Azul Marinho', 149.90, '11987654321')
ON CONFLICT (codigo_da_peca) DO NOTHING;

-- Inserir produtos do João (ID de acesso 54321)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('CAM101', 54321, 'Camisa Social Masculina', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('CAL101', 54321, 'Calça Social Masculina', '38,40,42,44,46', 'Preto', 159.90, '11912345678'),
    ('JAQ101', 54321, 'Jaqueta Jeans Masculina', 'P,M,G,GG', 'Azul', 199.90, '11912345678')
ON CONFLICT (codigo_da_peca) DO NOTHING;

-- Verificar se os dados foram inseridos corretamente
SELECT 'Usuários cadastrados:' as info;
SELECT id_acesso, nome_completo, telefone, nome_empresa FROM dados_usuario ORDER BY id_acesso;

SELECT 'Produtos por vendedor:' as info;
SELECT 
    p.id_do_vendedor,
    u.nome_completo as vendedor,
    u.telefone as telefone_vendedor,
    COUNT(p.id) as total_produtos
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
GROUP BY p.id_do_vendedor, u.nome_completo, u.telefone
ORDER BY p.id_do_vendedor;

SELECT 'Todos os produtos:' as info;
SELECT 
    p.codigo_da_peca,
    p.modelo_da_peca,
    p.cor,
    p.valor,
    u.nome_completo as vendedor,
    u.telefone as telefone_vendedor
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
ORDER BY p.id_do_vendedor, p.codigo_da_peca;
