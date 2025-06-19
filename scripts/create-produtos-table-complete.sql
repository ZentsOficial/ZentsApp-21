-- ============================================
-- SCRIPT COMPLETO PARA TABELA PRODUTOS
-- Baseado no schema fornecido pelo usuário
-- ============================================

-- Primeiro, criar a função set_updated_at se não existir
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela dados_usuario se não existir (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.dados_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    nome_empresa VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    id_acesso INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices únicos para dados_usuario
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_telefone ON public.dados_usuario(telefone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_email ON public.dados_usuario(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dados_usuario_id_acesso ON public.dados_usuario(id_acesso);

-- Criar tabela produtos conforme schema fornecido
CREATE TABLE IF NOT EXISTS public.produtos (
    codigo_da_peca TEXT NOT NULL,
    id_do_vendedor INTEGER NOT NULL,
    modelo_da_peca TEXT NOT NULL,
    tamanhos_disponiveis TEXT NOT NULL,
    cor TEXT NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    foto_do_produto TEXT NULL,
    telefone TEXT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    id SERIAL NOT NULL,
    CONSTRAINT produtos_pkey PRIMARY KEY (codigo_da_peca),
    CONSTRAINT fk_produtos_vendedor FOREIGN KEY (id_do_vendedor) REFERENCES dados_usuario (id_acesso)
) TABLESPACE pg_default;

-- Criar índice único conforme especificado
CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_codigo ON public.produtos USING btree (codigo_da_peca) TABLESPACE pg_default;

-- Criar trigger para updated_at
DROP TRIGGER IF EXISTS trigger_set_updated_at ON produtos;
CREATE TRIGGER trigger_set_updated_at 
    BEFORE UPDATE ON produtos 
    FOR EACH ROW 
    EXECUTE FUNCTION set_updated_at();

-- ============================================
-- INSERIR DADOS DE VENDEDORES
-- ============================================

INSERT INTO public.dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES 
    ('Maria da Silva', 'Boutique Maria Fashion', '11987654321', 'maria@boutiquemaria.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 12345),
    ('João Santos', 'Moda Masculina João', '11912345678', 'joao@modajoao.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 54321),
    ('Ana Costa', 'Ana Fitness & Style', '11999887766', 'ana@anafitness.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 67890),
    ('Carlos Oliveira', 'Elegance Carlos', '11888777666', 'carlos@elegancecarlos.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 98765),
    ('Lucia Fernandes', 'Lucia Moda Íntima', '11777666555', 'lucia@luciamodaintima.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 11111)
ON CONFLICT (id_acesso) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    nome_empresa = EXCLUDED.nome_empresa,
    telefone = EXCLUDED.telefone,
    email = EXCLUDED.email,
    updated_at = NOW();

-- ============================================
-- INSERIR PRODUTOS CONFORME NOVA ESTRUTURA
-- ============================================

-- PRODUTOS DA MARIA (ID: 12345, Tel: 11987654321)
INSERT INTO public.produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('MAR001', 12345, 'Vestido Floral Primavera', 'P,M,G', 'Rosa', 129.90, '11987654321'),
    ('MAR002', 12345, 'Blusa Cropped Verão', 'P,M,G,GG', 'Branco', 59.90, '11987654321'),
    ('MAR003', 12345, 'Saia Midi Elegante', 'P,M,G', 'Preto', 89.90, '11987654321'),
    ('MAR004', 12345, 'Conjunto Duas Peças', 'P,M,G', 'Azul', 159.90, '11987654321'),
    ('MAR005', 12345, 'Vestido Longo Festa', 'P,M,G', 'Vermelho', 199.90, '11987654321'),
    ('MAR006', 12345, 'Blusa Social Feminina', 'P,M,G,GG', 'Branco', 79.90, '11987654321'),
    ('MAR007', 12345, 'Calça Legging', 'P,M,G', 'Preto', 49.90, '11987654321'),
    ('MAR008', 12345, 'Vestido Casual', 'P,M,G', 'Azul', 99.90, '11987654321')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- PRODUTOS DO JOÃO (ID: 54321, Tel: 11912345678)
INSERT INTO public.produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('JOA001', 54321, 'Camisa Social Masculina', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('JOA002', 54321, 'Calça Jeans Masculina', '38,40,42,44,46', 'Azul', 149.90, '11912345678'),
    ('JOA003', 54321, 'Polo Masculina', 'P,M,G,GG', 'Preto', 69.90, '11912345678'),
    ('JOA004', 54321, 'Bermuda Jeans', '38,40,42,44', 'Azul', 89.90, '11912345678'),
    ('JOA005', 54321, 'Jaqueta Bomber', 'P,M,G,GG', 'Verde', 179.90, '11912345678'),
    ('JOA006', 54321, 'Camiseta Básica Masculina', 'P,M,G,GG', 'Cinza', 39.90, '11912345678'),
    ('JOA007', 54321, 'Moletom Masculino', 'P,M,G,GG', 'Preto', 119.90, '11912345678'),
    ('JOA008', 54321, 'Shorts Esportivo', 'P,M,G,GG', 'Azul', 59.90, '11912345678')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- PRODUTOS DA ANA (ID: 67890, Tel: 11999887766)
INSERT INTO public.produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('ANA001', 67890, 'Legging Fitness Premium', 'P,M,G', 'Preto', 79.90, '11999887766'),
    ('ANA002', 67890, 'Top Fitness', 'P,M,G', 'Rosa', 45.90, '11999887766'),
    ('ANA003', 67890, 'Shorts Fitness', 'P,M,G', 'Azul', 39.90, '11999887766'),
    ('ANA004', 67890, 'Conjunto Fitness', 'P,M,G', 'Roxo', 119.90, '11999887766'),
    ('ANA005', 67890, 'Camiseta Dry Fit', 'P,M,G,GG', 'Branco', 49.90, '11999887766'),
    ('ANA006', 67890, 'Macaquinho Fitness', 'P,M,G', 'Preto', 89.90, '11999887766'),
    ('ANA007', 67890, 'Jaqueta Esportiva', 'P,M,G', 'Rosa', 129.90, '11999887766'),
    ('ANA008', 67890, 'Calça Moletom Feminina', 'P,M,G', 'Cinza', 69.90, '11999887766')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- PRODUTOS DO CARLOS (ID: 98765, Tel: 11888777666)
INSERT INTO public.produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('CAR001', 98765, 'Terno Completo Premium', 'P,M,G,GG', 'Preto', 599.90, '11888777666'),
    ('CAR002', 98765, 'Gravata Seda Italiana', 'Único', 'Azul', 89.90, '11888777666'),
    ('CAR003', 98765, 'Sapato Social Couro', '39,40,41,42,43,44', 'Preto', 299.90, '11888777666'),
    ('CAR004', 98765, 'Cinto Couro Premium', 'P,M,G', 'Marrom', 129.90, '11888777666'),
    ('CAR005', 98765, 'Blazer Masculino', 'P,M,G,GG', 'Cinza', 349.90, '11888777666'),
    ('CAR006', 98765, 'Camisa Social Premium', 'P,M,G,GG', 'Azul', 119.90, '11888777666'),
    ('CAR007', 98765, 'Calça Social Alfaiataria', '38,40,42,44,46', 'Preto', 199.90, '11888777666'),
    ('CAR008', 98765, 'Colete Social', 'P,M,G,GG', 'Cinza', 159.90, '11888777666')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- PRODUTOS DA LUCIA (ID: 11111, Tel: 11777666555)
INSERT INTO public.produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('LUC001', 11111, 'Conjunto Lingerie Renda', 'P,M,G', 'Preto', 89.90, '11777666555'),
    ('LUC002', 11111, 'Sutiã Push Up', 'P,M,G', 'Nude', 49.90, '11777666555'),
    ('LUC003', 11111, 'Calcinha Fio Dental', 'P,M,G', 'Rosa', 25.90, '11777666555'),
    ('LUC004', 11111, 'Camisola Seda', 'P,M,G', 'Vermelho', 79.90, '11777666555'),
    ('LUC005', 11111, 'Pijama Feminino', 'P,M,G,GG', 'Azul', 69.90, '11777666555'),
    ('LUC006', 11111, 'Body Renda', 'P,M,G', 'Preto', 59.90, '11777666555'),
    ('LUC007', 11111, 'Conjunto Baby Doll', 'P,M,G', 'Branco', 99.90, '11777666555'),
    ('LUC008', 11111, 'Sutiã Esportivo', 'P,M,G', 'Cinza', 39.90, '11777666555')
ON CONFLICT (codigo_da_peca) DO UPDATE SET
    modelo_da_peca = EXCLUDED.modelo_da_peca,
    valor = EXCLUDED.valor,
    telefone = EXCLUDED.telefone,
    updated_at = NOW();

-- ============================================
-- VERIFICAÇÕES E RELATÓRIOS
-- ============================================

-- Verificar estrutura da tabela produtos
SELECT 'ESTRUTURA DA TABELA PRODUTOS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'produtos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar constraints e índices
SELECT 'CONSTRAINTS E ÍNDICES:' as info;
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'produtos' 
AND table_schema = 'public';

-- Verificar triggers
SELECT 'TRIGGERS:' as info;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'produtos';

-- Relatório de vendedores
SELECT 'VENDEDORES CADASTRADOS:' as relatorio;
SELECT 
    id_acesso as "ID de Acesso",
    nome_completo as "Nome Completo",
    nome_empresa as "Empresa",
    telefone as "Telefone WhatsApp",
    email as "Email",
    (SELECT COUNT(*) FROM produtos WHERE id_do_vendedor = du.id_acesso) as "Total Produtos"
FROM dados_usuario du 
ORDER BY id_acesso;

-- Relatório de produtos por vendedor
SELECT 'PRODUTOS POR VENDEDOR:' as relatorio;
SELECT 
    u.id_acesso as "ID Vendedor",
    u.nome_completo as "Nome Vendedor",
    u.telefone as "Telefone",
    COUNT(p.codigo_da_peca) as "Total Produtos",
    MIN(p.valor) as "Menor Preço",
    MAX(p.valor) as "Maior Preço",
    ROUND(AVG(p.valor), 2) as "Preço Médio"
FROM dados_usuario u
LEFT JOIN produtos p ON u.id_acesso = p.id_do_vendedor
GROUP BY u.id_acesso, u.nome_completo, u.telefone
ORDER BY u.id_acesso;

-- Catálogo completo
SELECT 'CATÁLOGO COMPLETO:' as relatorio;
SELECT 
    p.codigo_da_peca as "Código",
    p.modelo_da_peca as "Produto",
    p.cor as "Cor",
    p.valor as "Preço",
    p.tamanhos_disponiveis as "Tamanhos",
    u.nome_completo as "Vendedor",
    u.telefone as "WhatsApp Vendedor"
FROM produtos p
LEFT JOIN dados_usuario u ON p.id_do_vendedor = u.id_acesso
ORDER BY u.nome_completo, p.codigo_da_peca;

-- Verificação final
SELECT 'VERIFICAÇÃO FINAL:' as status;
SELECT 
    'Total de vendedores' as "Tipo",
    COUNT(*) as "Quantidade"
FROM dados_usuario

UNION ALL

SELECT 
    'Total de produtos' as "Tipo",
    COUNT(*) as "Quantidade"
FROM produtos;

SELECT 'BANCO DE DADOS CONFIGURADO COM SUCESSO!' as status;
SELECT 'Tabela produtos criada conforme schema fornecido!' as status;
SELECT 'Trigger de updated_at ativo!' as status;
SELECT 'Sistema pronto para uso!' as status;
