import { supabaseAdmin, mapProductFromDB } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id_acesso: string } }) {
  try {
    const id_acesso = params.id_acesso

    console.log(`Buscando produtos do vendedor com ID de acesso: ${id_acesso}`)

    // Buscar produtos do vendedor específico
    const { data: produtos, error: produtosError } = await supabaseAdmin
      .from("produtos")
      .select("*")
      .eq("id_do_vendedor", Number.parseInt(id_acesso))

    if (produtosError) {
      console.error("Erro do Supabase:", produtosError)
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
    }

    // Buscar dados do vendedor
    const { data: vendedor, error: vendedorError } = await supabaseAdmin
      .from("dados_usuario")
      .select("id_acesso, telefone, nome_completo, nome_empresa")
      .eq("id_acesso", Number.parseInt(id_acesso))
      .single()

    if (vendedorError) {
      console.error("Erro ao buscar vendedor:", vendedorError)
    }

    // Mapear produtos
    const products = produtos.map((produto: any) => {
      const product = mapProductFromDB(produto)

      // Adicionar telefone do vendedor
      if (vendedor) {
        product.telefone_vendedor = vendedor.telefone
      } else if (produto.telefone) {
        product.telefone_vendedor = produto.telefone
      }

      return product
    })

    return NextResponse.json({
      products,
      vendor: vendedor || null,
      total: products.length,
    })
  } catch (error) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
