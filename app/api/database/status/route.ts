import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Verificando status do banco de dados...")

    // Teste de conexão mais simples - tentar acessar dados_usuario diretamente
    try {
      const { data: testConnection, error: connectionError } = await supabaseAdmin
        .from("dados_usuario")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        console.error("❌ Erro de conexão com dados_usuario:", connectionError)

        // Verificar se é erro de tabela não existir
        if (connectionError.code === "42P01" || connectionError.message.includes("does not exist")) {
          return NextResponse.json({
            status: "warning",
            message: "Tabela dados_usuario não encontrada",
            error: "Execute o script SQL para criar as tabelas",
            suggestion: "Execute o script SQL completo no Supabase",
            mock_mode: true,
            tables: {
              dados_usuario: false,
              produtos: false,
            },
            ready: false,
          })
        }

        return NextResponse.json({
          status: "error",
          message: "Erro de conexão com o banco",
          error: connectionError.message,
          suggestion: "Verifique as credenciais do Supabase",
          mock_mode: true,
        })
      }

      console.log("✅ Conexão com dados_usuario estabelecida")

      // Verificar tabela produtos
      const { data: testProdutos, error: produtosError } = await supabaseAdmin
        .from("produtos")
        .select("count", { count: "exact", head: true })

      const hasProdutos = !produtosError
      const userCount = testConnection || 0
      const productCount = testProdutos || 0

      console.log(`📊 Encontrados ${userCount} usuários e ${productCount} produtos`)

      return NextResponse.json({
        status: "success",
        connection: "ok",
        tables: {
          dados_usuario: true,
          produtos: hasProdutos,
        },
        data_counts: {
          usuarios: userCount,
          produtos: productCount,
        },
        ready: true,
        mock_mode: false,
        message: `✅ Banco conectado! ${userCount} usuários e ${productCount} produtos`,
        suggestion: "Sistema funcionando corretamente",
      })
    } catch (tableError) {
      console.error("❌ Erro ao acessar tabelas:", tableError)

      return NextResponse.json({
        status: "warning",
        connection: "ok",
        message: "Conexão OK, mas tabelas não encontradas",
        error: "Tabelas dados_usuario ou produtos não existem",
        suggestion: "Execute o script SQL completo para criar as tabelas",
        mock_mode: true,
        tables: {
          dados_usuario: false,
          produtos: false,
        },
        data_counts: {
          usuarios: 0,
          produtos: 0,
        },
        ready: false,
      })
    }
  } catch (error) {
    console.error("❌ Erro inesperado:", error)

    return NextResponse.json({
      status: "error",
      message: "Erro inesperado ao verificar banco",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      mock_mode: true,
      suggestion: "Verifique as credenciais do Supabase",
      connection: "error",
      ready: false,
    })
  }
}
