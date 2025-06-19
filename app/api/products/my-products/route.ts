import { supabaseAdmin, mapProductFromDB } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id_acesso = searchParams.get("id_acesso")

    if (!id_acesso) {
      return NextResponse.json({ error: "ID de acesso é obrigatório" }, { status: 400 })
    }

    console.log(`🔍 Buscando produtos APENAS do vendedor com ID de acesso: ${id_acesso}`)

    // Buscar produtos APENAS do vendedor específico
    const { data: produtos, error: produtosError } = await supabaseAdmin
      .from("produtos")
      .select("*")
      .eq("id_do_vendedor", Number.parseInt(id_acesso))

    if (produtosError) {
      console.error("❌ Erro do Supabase ao buscar produtos:", produtosError)
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
    }

    if (!produtos || produtos.length === 0) {
      console.log(`📦 Nenhum produto encontrado para o vendedor ${id_acesso}`)
      return NextResponse.json([])
    }

    console.log(`✅ Encontrados ${produtos.length} produtos do vendedor ${id_acesso}`)

    // Buscar dados do vendedor
    const { data: vendedor, error: vendedorError } = await supabaseAdmin
      .from("dados_usuario")
      .select("id_acesso, telefone, nome_completo, nome_empresa")
      .eq("id_acesso", Number.parseInt(id_acesso))
      .single()

    if (vendedorError) {
      console.error("⚠️ Erro ao buscar vendedor:", vendedorError)
    }

    // Mapear produtos com telefone do vendedor
    const products = produtos.map((produto: any) => {
      const product = mapProductFromDB(produto)

      // Adicionar telefone do vendedor
      if (vendedor) {
        product.telefone_vendedor = vendedor.telefone
        console.log(
          `📱 Produto ${product.codigo_da_peca} -> Vendedor: ${vendedor.nome_completo} (${vendedor.telefone})`,
        )
      } else if (produto.telefone) {
        product.telefone_vendedor = produto.telefone
      }

      return product
    })

    console.log(`🎯 Retornando ${products.length} produtos EXCLUSIVOS do vendedor ${id_acesso}`)
    return NextResponse.json(products)
  } catch (error) {
    console.error("❌ Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
