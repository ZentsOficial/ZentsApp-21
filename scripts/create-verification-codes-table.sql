-- Criar tabela para códigos de verificação (alternativa mais segura)
CREATE TABLE IF NOT EXISTS verification_codes (
    id SERIAL PRIMARY KEY,
    id_acesso INTEGER NOT NULL,
    code VARCHAR(6) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('email', 'sms')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE,
    UNIQUE(id_acesso)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_id_acesso ON verification_codes(id_acesso);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);

-- Comentários para documentação
COMMENT ON TABLE verification_codes IS 'Tabela para armazenar códigos de verificação temporários';
COMMENT ON COLUMN verification_codes.id_acesso IS 'Referência ao ID de acesso do usuário';
COMMENT ON COLUMN verification_codes.code IS 'Código de verificação de 6 dígitos';
COMMENT ON COLUMN verification_codes.method IS 'Método de envio: email ou sms';
COMMENT ON COLUMN verification_codes.expires_at IS 'Data e hora de expiração do código';
COMMENT ON COLUMN verification_codes.used IS 'Indica se o código já foi utilizado';
