import { supabaseAdmin, mapProductFromDB } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { codigo: string } }) {
  try {
    const codigo = params.codigo

    console.log(`Buscando produto com código: ${codigo}`)

    // Buscar produto específico pelo código (sem .single() para evitar erro)
    const { data, error } = await supabaseAdmin.from("produtos").select("*").eq("codigo_da_peca", codigo).limit(1)

    if (error) {
      console.error("Erro do Supabase:", error)
      return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 })
    }

    // Verificar se encontrou algum produto
    if (!data || data.length === 0) {
      console.log(`Produto com código ${codigo} não encontrado`)
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Pegar o primeiro produto encontrado
    const product = mapProductFromDB(data[0])

    console.log(`Produto encontrado: ${product.modelo_da_peca}`)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
