import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id_acesso: string } }) {
  try {
    const id_acesso = params.id_acesso

    console.log(`Buscando telefone do vendedor com ID de acesso: ${id_acesso}`)

    // Buscar usuário pelo ID de acesso
    const { data, error } = await supabaseAdmin
      .from("dados_usuario")
      .select("telefone, nome_completo, nome_empresa")
      .eq("id_acesso", Number.parseInt(id_acesso))
      .single()

    if (error || !data) {
      console.log(`Vendedor com ID de acesso ${id_acesso} não encontrado`)
      return NextResponse.json({ error: "Vendedor não encontrado" }, { status: 404 })
    }

    console.log(`Telefone encontrado: ${data.telefone} - Vendedor: ${data.nome_completo}`)
    return NextResponse.json({
      telefone: data.telefone,
      nome_completo: data.nome_completo,
      nome_empresa: data.nome_empresa,
    })
  } catch (error) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
