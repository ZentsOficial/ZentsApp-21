import { createClient } from "@supabase/supabase-js"

// Configuração do Supabase com suas credenciais corretas
const supabaseUrl = "https://vhcnfzbrpmfyyfgukcpf.supabase.co"

// API Keys corretas
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY25memJycG1meXlmZ3VrY3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0Mjg3MzYsImV4cCI6MjA2MzAwNDczNn0.LlS7AbePbh5qBgQT5NrspiHUbpiQQtxWvcZq8jIU-bU"

// Service Role Key para operações administrativas
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY25memJycG1meXlmZ3VrY3BmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQyODczNiwiZXhwIjoyMDYzMDA0NzM2fQ.IiBXcxzXoRRuAE7sYrW5yBWT1CafV8QtTgOhC-3NPpM"

// Tipos para o banco de dados
export type DadosUsuario = {
  id: number
  nome_completo: string
  nome_empresa?: string
  telefone: string
  email: string
  senha: string
  id_acesso: number
  created_at?: string
  updated_at?: string
}

export type Product = {
  codigo_da_peca: string
  id_do_vendedor: number
  modelo_da_peca: string
  tamanhos_disponiveis: string
  cor: string
  valor: number
  foto_do_produto?: string
  telefone?: string
  // Campos adicionais para compatibilidade com o frontend
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  sizes: string[]
  category: string
  telefone_vendedor?: string
}

// Dados mock para fallback
export const mockProducts: Product[] = [
  {
    codigo_da_peca: "CAM001",
    id_do_vendedor: 12345,
    modelo_da_peca: "Camiseta Básica Branca",
    tamanhos_disponiveis: "P,M,G,GG",
    cor: "Branco",
    valor: 49.9,
    foto_do_produto: "/placeholder.svg?height=300&width=300&text=Camiseta+Branca",
    telefone: "11987654321",
    id: "CAM001",
    name: "Camiseta Básica Branca",
    description: "Camiseta 100% algodão, confortável e versátil para o dia a dia.",
    price: 49.9,
    image_url: "/placeholder.svg?height=300&width=300&text=Camiseta+Branca",
    sizes: ["P", "M", "G", "GG"],
    category: "Camisetas",
    telefone_vendedor: "11987654321",
  },
  {
    codigo_da_peca: "VES001",
    id_do_vendedor: 54321,
    modelo_da_peca: "Vestido Floral Verão",
    tamanhos_disponiveis: "P,M,G",
    cor: "Estampado",
    valor: 89.9,
    foto_do_produto: "/placeholder.svg?height=300&width=300&text=Vestido+Floral",
    telefone: "11912345678",
    id: "VES001",
    name: "Vestido Floral Verão",
    description: "Vestido leve com estampa floral, perfeito para os dias quentes.",
    price: 89.9,
    image_url: "/placeholder.svg?height=300&width=300&text=Vestido+Floral",
    sizes: ["P", "M", "G"],
    category: "Vestidos",
    telefone_vendedor: "11912345678",
  },
]

// Criar clientes Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Função para mapear dados do banco para o formato do frontend
export function mapProductFromDB(dbProduct: any): Product {
  const sizes = dbProduct.tamanhos_disponiveis
    ? dbProduct.tamanhos_disponiveis.split(",").map((s: string) => s.trim())
    : []

  // Determinar categoria baseada no modelo da peça
  let category = "Geral"
  const modelo = dbProduct.modelo_da_peca?.toLowerCase() || ""

  if (modelo.includes("camiseta") || modelo.includes("camisa")) {
    category = "Camisetas"
  } else if (modelo.includes("vestido")) {
    category = "Vestidos"
  } else if (modelo.includes("calça") || modelo.includes("jeans")) {
    category = "Calças"
  } else if (modelo.includes("blusa")) {
    category = "Blusas"
  } else if (modelo.includes("jaqueta") || modelo.includes("casaco")) {
    category = "Casacos"
  } else if (modelo.includes("saia")) {
    category = "Saias"
  } else if (modelo.includes("short")) {
    category = "Shorts"
  }

  return {
    // Campos originais do banco
    codigo_da_peca: dbProduct.codigo_da_peca,
    id_do_vendedor: dbProduct.id_do_vendedor,
    modelo_da_peca: dbProduct.modelo_da_peca,
    tamanhos_disponiveis: dbProduct.tamanhos_disponiveis,
    cor: dbProduct.cor,
    valor: Number.parseFloat(dbProduct.valor),
    foto_do_produto: dbProduct.foto_do_produto,
    telefone: dbProduct.telefone,

    // Campos mapeados para compatibilidade
    id: dbProduct.codigo_da_peca,
    name: dbProduct.modelo_da_peca,
    description: `${dbProduct.modelo_da_peca} na cor ${dbProduct.cor}. Disponível nos tamanhos: ${sizes.join(", ")}.`,
    price: Number.parseFloat(dbProduct.valor),
    image_url: dbProduct.foto_do_produto,
    sizes: sizes,
    category: category,
    telefone_vendedor: dbProduct.telefone_vendedor || dbProduct.telefone,
  }
}

console.log("✅ Supabase configurado:", {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey,
  anonKeyLength: supabaseAnonKey.length,
  serviceKeyLength: supabaseServiceKey.length,
})
