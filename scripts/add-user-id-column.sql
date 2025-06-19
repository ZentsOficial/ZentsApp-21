-- Verificar se a coluna user_id já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'dados_usuario' AND column_name = 'user_id'
    ) THEN
        -- Adicionar coluna user_id se não existir
        ALTER TABLE dados_usuario ADD COLUMN user_id UUID;
        RAISE NOTICE 'Coluna user_id adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna user_id já existe';
    END IF;
END $$;
