-- ============================================
-- CONFIGURAÇÃO COMPLETA DO BANCO ZENTS
-- ============================================

-- Criar tabela dados_usuario com estrutura completa
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

-- Adicionar foreign key entre produtos e dados_usuario
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_vendedor;
ALTER TABLE produtos 
ADD CONSTRAINT fk_produtos_vendedor 
FOREIGN KEY (id_do_vendedor) 
REFERENCES dados_usuario(id_acesso);

-- ============================================
-- INSERIR DADOS DE VENDEDORES REAIS
-- ============================================

-- Vendedor 1: Maria da Silva (ID: 12345)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'Maria da Silva',
    'Boutique Maria',
    '11987654321',
    'maria@boutiquemaria.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    12345
) ON CONFLICT (id_acesso) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    nome_empresa = EXCLUDED.nome_empresa,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Vendedor 2: João Santos (ID: 54321)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'João Santos',
    'Moda João',
    '11912345678',
    'joao@modajoao.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    54321
) ON CONFLICT (id_acesso) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    nome_empresa = EXCLUDED.nome_empresa,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Vendedor 3: Ana Costa (ID: 67890)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'Ana Costa',
    'Loja da Ana',
    '11999887766',
    'ana@lojadaana.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    67890
) ON CONFLICT (id_acesso) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    nome_empresa = EXCLUDED.nome_empresa,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Vendedor 4: Carlos Oliveira (ID: 98765)
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES (
    'Carlos Oliveira',
    'Style Carlos',
    '11888777666',
    'carlos@stylecarlos.com.br',
    '$2a$10$example.hash.here.replace.with.real.hash',
    98765
) ON CONFLICT (id_acesso) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    nome_empresa = EXCLUDED.nome_empresa,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    updated_at = NOW();

-- ============================================
-- INSERIR PRODUTOS PARA CADA VENDEDOR
-- ============================================

-- Produtos da Maria (ID: 12345, Tel: 11987654321)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('MAR001', 12345, 'Vestido Floral Primavera', 'P,M,G', 'Rosa', 129.90, '11987654321'),
    ('MAR002', 12345, 'Blusa Cropped Verão', 'P,M,G,GG', 'Branco', 59.90, '11987654321'),
    ('MAR003', 12345, 'Saia Midi Elegante', 'P,M,G', 'Preto', 89.90, '11987654321'),
    ('MAR004', 12345, 'Conjunto Duas Peças', 'P,M,G', 'Azul', 159.90, '11987654321'),
    ('MAR005', 12345, 'Vestido Longo Festa', 'P,M,G', 'Vermelho', 199.90, '11987654321')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- Produtos do João (ID: 54321, Tel: 11912345678)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('JOA001', 54321, 'Camisa Social Masculina', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('JOA002', 54321, 'Calça Jeans Masculina', '38,40,42,44,46', 'Azul', 149.90, '11912345678'),
    ('JOA003', 54321, 'Polo Masculina', 'P,M,G,GG', 'Preto', 69.90, '11912345678'),
    ('JOA004', 54321, 'Bermuda Jeans', '38,40,42,44', 'Azul', 89.90, '11912345678'),
    ('JOA005', 54321, 'Jaqueta Bomber', 'P,M,G,GG', 'Verde', 179.90, '11912345678')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- Produtos da Ana (ID: 67890, Tel: 11999887766)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('ANA001', 67890, 'Camiseta Básica Feminina', 'P,M,G,GG', 'Rosa', 39.90, '11999887766'),
    ('ANA002', 67890, 'Legging Fitness', 'P,M,G', 'Preto', 49.90, '11999887766'),
    ('ANA003', 67890, 'Top Fitness', 'P,M,G', 'Rosa', 35.90, '11999887766'),
    ('ANA004', 67890, 'Shorts Jeans', '36,38,40,42', 'Azul', 59.90, '11999887766'),
    ('ANA005', 67890, 'Macaquinho Verão', 'P,M,G', 'Amarelo', 79.90, '11999887766')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- Produtos do Carlos (ID: 98765, Tel: 11888777666)
INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('CAR001', 98765, 'Terno Completo', 'P,M,G,GG', 'Preto', 399.90, '11888777666'),
    ('CAR002', 98765, 'Gravata Seda', 'Único', 'Azul', 49.90, '11888777666'),
    ('CAR003', 98765, 'Sapato Social', '39,40,41,42,43,44', 'Preto', 199.90, '11888777666'),
    ('CAR004', 98765, 'Cinto Couro', 'P,M,G', 'Marrom', 79.90, '11888777666'),
    ('CAR005', 98765, 'Blazer Masculino', 'P,M,G,GG', 'Cinza', 249.90, '11888777666')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- ============================================
-- VERIFICAÇÕES E RELATÓRIOS
-- ============================================

-- Verificar vendedores cadastrados
SELECT 'VENDEDORES CADASTRADOS:' as info;
SELECT 
    id_acesso,
    nome_completo,
    nome_empresa,
    telefone,
    email,
    (SELECT COUNT(*) FROM produtos WHERE id_do_vendedor = du.id_acesso) as total_produtos
FROM dados_usuario du 
ORDER BY id_acesso;

-- Verificar produtos por vendedor
SELECT 'PRODUTOS POR VENDEDOR:' as info;
SELECT 
    p.id_do_vendedor,
    u.nome_completo as vendedor,
    u.telefone as telefone_vendedor,
    COUNT(p.id) as total_produtos,
    MIN(p.valor) as menor_preco,
    MAX(p.valor) as maior_preco,
    AVG(p.valor) as preco_medio
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
GROUP BY p.id_do_vendedor, u.nome_completo, u.telefone
ORDER BY p.id_do_vendedor;

-- Listar todos os produtos com vendedores
SELECT 'CATÁLOGO COMPLETO:' as info;
SELECT 
    p.codigo_da_peca,
    p.modelo_da_peca,
    p.cor,
    p.valor,
    p.tamanhos_disponiveis,
    u.nome_completo as vendedor,
    u.telefone as telefone_vendedor,
    u.nome_empresa
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
ORDER BY u.nome_completo, p.codigo_da_peca;

-- Verificar integridade dos dados
SELECT 'VERIFICAÇÃO DE INTEGRIDADE:' as info;
SELECT 
    'Produtos sem vendedor' as tipo,
    COUNT(*) as quantidade
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
WHERE u.id_acesso IS NULL

UNION ALL

SELECT 
    'Vendedores sem produtos' as tipo,
    COUNT(*) as quantidade
FROM dados_usuario u
LEFT JOIN produtos p ON u.id_acesso = p.id_do_vendedor
WHERE p.id_do_vendedor IS NULL;
