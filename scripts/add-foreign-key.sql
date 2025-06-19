-- Adicionar foreign key entre produtos e dados_usuario
-- Primeiro, verificar se a constraint já existe
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'produtos' 
AND constraint_type = 'FOREIGN KEY';

-- Remover constraint existente se houver (para recriar corretamente)
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS produtos_id_do_vendedor_fkey;
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_vendedor;

-- Adicionar a foreign key corretamente
ALTER TABLE produtos 
ADD CONSTRAINT fk_produtos_vendedor 
FOREIGN KEY (id_do_vendedor) 
REFERENCES dados_usuario(id_acesso);

-- Verificar se a foreign key foi criada
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'produtos';
