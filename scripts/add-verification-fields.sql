-- Adicionar campos necessários para o sistema de recuperação de senha
ALTER TABLE dados_usuario
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_reset_authorized BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_reset_authorized_at TIMESTAMP WITH TIME ZONE;

-- Comentários para documentação
COMMENT ON COLUMN dados_usuario.verification_code IS 'Código de verificação para recuperação de senha';
COMMENT ON COLUMN dados_usuario.verification_code_expires_at IS 'Data de expiração do código de verificação';
COMMENT ON COLUMN dados_usuario.password_reset_authorized IS 'Indica se o usuário está autorizado a redefinir a senha';
COMMENT ON COLUMN dados_usuario.password_reset_authorized_at IS 'Data em que a autorização para redefinir senha foi concedida';
