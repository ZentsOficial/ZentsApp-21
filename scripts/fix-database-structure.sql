-- ============================================
-- SCRIPT PARA CORRIGIR ESTRUTURA DO BANCO
-- ============================================

-- Verificar se a tabela dados_usuario existe
DO $$
BEGIN
    -- Criar tabela dados_usuario se não existir
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dados_usuario') THEN
        CREATE TABLE dados_usuario (
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
        
        RAISE NOTICE 'Tabela dados_usuario criada';
    ELSE
        RAISE NOTICE 'Tabela dados_usuario já existe';
    END IF;
    
    -- Adicionar coluna id_acesso se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'dados_usuario' AND column_name = 'id_acesso') THEN
        ALTER TABLE dados_usuario ADD COLUMN id_acesso INTEGER;
        RAISE NOTICE 'Coluna id_acesso adicionada';
    ELSE
        RAISE NOTICE 'Coluna id_acesso já existe';
    END IF;
    
    -- Criar índices únicos se não existirem
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'dados_usuario' AND indexname = 'idx_dados_usuario_telefone') THEN
        CREATE UNIQUE INDEX idx_dados_usuario_telefone ON dados_usuario(telefone);
        RAISE NOTICE 'Índice telefone criado';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'dados_usuario' AND indexname = 'idx_dados_usuario_email') THEN
        CREATE UNIQUE INDEX idx_dados_usuario_email ON dados_usuario(email);
        RAISE NOTICE 'Índice email criado';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'dados_usuario' AND indexname = 'idx_dados_usuario_id_acesso') THEN
        CREATE UNIQUE INDEX idx_dados_usuario_id_acesso ON dados_usuario(id_acesso);
        RAISE NOTICE 'Índice id_acesso criado';
    END IF;
END
$$;

-- Criar tabela produtos se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'produtos') THEN
        CREATE TABLE produtos (
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
        
        CREATE UNIQUE INDEX idx_produtos_codigo ON produtos(codigo_da_peca);
        RAISE NOTICE 'Tabela produtos criada';
    ELSE
        RAISE NOTICE 'Tabela produtos já existe';
    END IF;
END
$$;

-- Inserir dados de exemplo
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES 
    ('Maria da Silva', 'Boutique Maria', '11987654321', 'maria@boutique.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 12345),
    ('João Santos', 'Moda João', '11912345678', 'joao@moda.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 54321)
ON CONFLICT (telefone) DO NOTHING;

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('MAR001', 12345, 'Vestido Floral', 'P,M,G', 'Rosa', 129.90, '11987654321'),
    ('MAR002', 12345, 'Blusa Cropped', 'P,M,G,GG', 'Branco', 59.90, '11987654321'),
    ('JOA001', 54321, 'Camisa Social', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('JOA002', 54321, 'Calça Jeans', '38,40,42,44', 'Azul', 149.90, '11912345678')
ON CONFLICT (codigo_da_peca) DO NOTHING;

-- Verificar estrutura final
SELECT 'ESTRUTURA FINAL:' as status;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('dados_usuario', 'produtos') 
ORDER BY table_name, ordinal_position;

SELECT 'DADOS INSERIDOS:' as status;
SELECT COUNT(*) as usuarios FROM dados_usuario;
SELECT COUNT(*) as produtos FROM produtos;
