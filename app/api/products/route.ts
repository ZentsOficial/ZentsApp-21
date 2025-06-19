import { supabaseAdmin, mapProductFromDB, mockProducts } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Tentando buscar produtos...")

    // Buscar produtos sem JOIN (mais seguro)
    const { data: produtos, error: produtosError } = await supabaseAdmin.from("produtos").select("*")

    if (produtosError) {
      console.error("Erro do Supabase ao buscar produtos:", produtosError)
      console.log("Retornando produtos mock devido ao erro")
      return NextResponse.json(mockProducts)
    }

    // Se não há dados, retornar produtos mock
    if (!produtos || produtos.length === 0) {
      console.log("Nenhum produto encontrado no banco, retornando produtos mock")
      return NextResponse.json(mockProducts)
    }

    console.log(`Encontrados ${produtos.length} produtos no banco de dados`)

    // Buscar todos os vendedores separadamente
    const vendedorIds = [...new Set(produtos.map((p) => p.id_do_vendedor))]
    console.log("IDs dos vendedores encontrados:", vendedorIds)

    const { data: vendedores, error: vendedoresError } = await supabaseAdmin
      .from("dados_usuario")
      .select("id_acesso, telefone, nome_completo, nome_empresa")
      .in("id_acesso", vendedorIds)

    if (vendedoresError) {
      console.error("Erro ao buscar vendedores:", vendedoresError)
    }

    // Criar um mapa de id_acesso -> dados do vendedor
    const vendedoresMap = new Map()
    if (vendedores && vendedores.length > 0) {
      console.log(`Encontrados ${vendedores.length} vendedores`)
      vendedores.forEach((vendedor: any) => {
        vendedoresMap.set(vendedor.id_acesso, vendedor)
        console.log(`Vendedor mapeado: ID ${vendedor.id_acesso} -> ${vendedor.nome_completo} (${vendedor.telefone})`)
      })
    } else {
      console.log("Nenhum vendedor encontrado")
    }

    // Mapear dados do banco para o formato esperado pelo frontend
    const products = produtos.map((produto: any) => {
      const product = mapProductFromDB(produto)

      // Adicionar telefone do vendedor do mapa
      const vendedor = vendedoresMap.get(produto.id_do_vendedor)
      if (vendedor) {
        product.telefone_vendedor = vendedor.telefone
        console.log(`Produto ${product.codigo_da_peca} -> Vendedor: ${vendedor.nome_completo} (${vendedor.telefone})`)
      } else if (produto.telefone) {
        // Fallback para o telefone direto do produto
        product.telefone_vendedor = produto.telefone
        console.log(`Produto ${product.codigo_da_peca} -> Telefone direto: ${produto.telefone}`)
      } else {
        console.log(`Produto ${product.codigo_da_peca} -> Nenhum telefone encontrado`)
      }

      return product
    })

    console.log(`Retornando ${products.length} produtos com telefones dos vendedores`)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Erro inesperado:", error)
    console.log("Retornando produtos mock devido ao erro inesperado")
    return NextResponse.json(mockProducts)
  }
}
