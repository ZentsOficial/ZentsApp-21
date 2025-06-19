import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id_acesso: string } }) {
  try {
    const id_acesso = params.id_acesso

    console.log(`Buscando vendedor com ID de acesso: ${id_acesso}`)

    // Buscar vendedor pelo ID de acesso
    const { data: vendedor, error: vendedorError } = await supabaseAdmin
      .from("dados_usuario")
      .select("id_acesso, nome_completo, nome_empresa, telefone, email")
      .eq("id_acesso", Number.parseInt(id_acesso))
      .single()

    if (vendedorError || !vendedor) {
      console.log(`Vendedor com ID de acesso ${id_acesso} não encontrado`)
      return NextResponse.json({ error: "Vendedor não encontrado" }, { status: 404 })
    }

    // Buscar produtos do vendedor
    const { data: produtos, error: produtosError } = await supabaseAdmin
      .from("produtos")
      .select("codigo_da_peca, modelo_da_peca, cor, valor, tamanhos_disponiveis")
      .eq("id_do_vendedor", Number.parseInt(id_acesso))

    if (produtosError) {
      console.error("Erro ao buscar produtos:", produtosError)
    }

    const response = {
      vendedor: {
        id_acesso: vendedor.id_acesso,
        nome_completo: vendedor.nome_completo,
        nome_empresa: vendedor.nome_empresa,
        telefone: vendedor.telefone,
        email: vendedor.email,
      },
      produtos: produtos || [],
      total_produtos: produtos ? produtos.length : 0,
    }

    console.log(
      `Vendedor encontrado: ${vendedor.nome_completo} (${vendedor.telefone}) com ${response.total_produtos} produtos`,
    )
    return NextResponse.json(response)
  } catch (error) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
