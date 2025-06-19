-- ============================================
-- SCRIPT PARA ADAPTAR TABELA EXISTENTE
-- ============================================

-- Verificar estrutura atual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'dados_usuario';

-- Adicionar coluna ID se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'dados_usuario' AND column_name = 'id') THEN
        ALTER TABLE dados_usuario ADD COLUMN id SERIAL PRIMARY KEY;
        RAISE NOTICE 'Coluna ID adicionada';
    END IF;
END
$$;

-- Renomear coluna "id vendedor" para id_acesso
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'dados_usuario' AND column_name = 'id vendedor') THEN
        ALTER TABLE dados_usuario RENAME COLUMN "id vendedor" TO id_acesso;
        RAISE NOTICE 'Coluna "id vendedor" renomeada para id_acesso';
    END IF;
END
$$;

-- Renomear coluna "nome" para nome_completo
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'dados_usuario' AND column_name = 'nome') 
       AND NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'dados_usuario' AND column_name = 'nome_completo') THEN
        ALTER TABLE dados_usuario RENAME COLUMN nome TO nome_completo;
        RAISE NOTICE 'Coluna "nome" renomeada para nome_completo';
    END IF;
END
$$;

-- Renomear coluna "empresa" para nome_empresa
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'dados_usuario' AND column_name = 'empresa') 
       AND NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'dados_usuario' AND column_name = 'nome_empresa') THEN
        ALTER TABLE dados_usuario RENAME COLUMN empresa TO nome_empresa;
        RAISE NOTICE 'Coluna "empresa" renomeada para nome_empresa';
    END IF;
END
$$;

-- Adicionar coluna senha se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'dados_usuario' AND column_name = 'senha') THEN
        ALTER TABLE dados_usuario ADD COLUMN senha VARCHAR(255) DEFAULT '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6';
        RAISE NOTICE 'Coluna senha adicionada com hash padrão';
    END IF;
END
$$;

-- Adicionar timestamps se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'dados_usuario' AND column_name = 'created_at') THEN
        ALTER TABLE dados_usuario ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna created_at adicionada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'dados_usuario' AND column_name = 'updated_at') THEN
        ALTER TABLE dados_usuario ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna updated_at adicionada';
    END IF;
END
$$;

-- Converter telefone para VARCHAR se for double precision
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'dados_usuario' AND column_name = 'telefone' 
               AND data_type = 'double precision') THEN
        -- Criar coluna temporária
        ALTER TABLE dados_usuario ADD COLUMN telefone_temp VARCHAR(20);
        
        -- Converter valores
        UPDATE dados_usuario SET telefone_temp = CAST(telefone AS VARCHAR(20));
        
        -- Remover coluna antiga
        ALTER TABLE dados_usuario DROP COLUMN telefone;
        
        -- Renomear coluna temporária
        ALTER TABLE dados_usuario RENAME COLUMN telefone_temp TO telefone;
        
        RAISE NOTICE 'Coluna telefone convertida de double precision para VARCHAR';
    END IF;
END
$$;

-- Criar índices únicos
DO $$
BEGIN
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

-- Verificar estrutura final
SELECT 'ESTRUTURA FINAL:' as status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'dados_usuario' 
ORDER BY ordinal_position;

-- Verificar dados
SELECT 'DADOS NA TABELA:' as status;
SELECT * FROM dados_usuario;
