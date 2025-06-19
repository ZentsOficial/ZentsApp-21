-- Verificar se a coluna id_acesso existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'dados_usuario' AND column_name = 'id_acesso';

-- Se não existir, adicionar a coluna id_acesso
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dados_usuario' AND column_name = 'id_acesso'
    ) THEN
        ALTER TABLE dados_usuario ADD COLUMN id_acesso INTEGER UNIQUE;
        
        -- Gerar IDs únicos para registros existentes
        UPDATE dados_usuario 
        SET id_acesso = (10000 + id)
        WHERE id_acesso IS NULL;
        
        -- Tornar a coluna NOT NULL após popular os dados
        ALTER TABLE dados_usuario ALTER COLUMN id_acesso SET NOT NULL;
        
        RAISE NOTICE 'Coluna id_acesso adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna id_acesso já existe';
    END IF;
END $$;

-- Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'dados_usuario' 
ORDER BY ordinal_position;
