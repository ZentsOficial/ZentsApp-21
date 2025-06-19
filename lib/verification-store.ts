// Armazenamento global para códigos de verificação
// Nota: Em produção, use Redis ou uma tabela no banco de dados

// Declaração global para persistir entre requisições
declare global {
  var verificationCodesStore: Map<
    string,
    {
      code: string
      expires: number
      method: string
    }
  >
}

// Inicializar o armazenamento global se não existir
if (!global.verificationCodesStore) {
  global.verificationCodesStore = new Map()
  console.log("🔐 Armazenamento de códigos de verificação inicializado")
}

export const verificationCodesStore = global.verificationCodesStore
