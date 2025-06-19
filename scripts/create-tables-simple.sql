-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('dados_usuario', 'produtos');

-- Criar tabela dados_usuario (sem foreign key inicialmente)
CREATE TABLE IF NOT EXISTS dados_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    nome_empresa VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    id_acesso INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices únicos separadamente
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice único para código da peça
CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_codigo ON produtos(codigo_da_peca);

-- Verificar se as tabelas foram criadas
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('dados_usuario', 'produtos');
