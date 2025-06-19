-- Inserir dados de exemplo para teste rápido
INSERT INTO dados_usuario (nome_completo, nome_empresa, telefone, email, senha, id_acesso)
VALUES 
    ('Maria da Silva', 'Boutique Maria', '11987654321', 'maria@boutique.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 12345),
    ('João Santos', 'Moda João', '11912345678', 'joao@moda.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo04/OZLllO7HuKQ9/5ewW1onqrLh6', 54321)
ON CONFLICT (id_acesso) DO NOTHING;

INSERT INTO produtos (codigo_da_peca, id_do_vendedor, modelo_da_peca, tamanhos_disponiveis, cor, valor, telefone)
VALUES 
    ('MAR001', 12345, 'Vestido Floral', 'P,M,G', 'Rosa', 129.90, '11987654321'),
    ('MAR002', 12345, 'Blusa Cropped', 'P,M,G,GG', 'Branco', 59.90, '11987654321'),
    ('JOA001', 54321, 'Camisa Social', 'P,M,G,GG', 'Branco', 79.90, '11912345678'),
    ('JOA002', 54321, 'Calça Jeans', '38,40,42,44', 'Azul', 149.90, '11912345678')
ON CONFLICT (codigo_da_peca) DO NOTHING;

-- Verificar dados inseridos
SELECT COUNT(*) as usuarios FROM dados_usuario;
SELECT COUNT(*) as produtos FROM produtos;
