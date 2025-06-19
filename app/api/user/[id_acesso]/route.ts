import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id_acesso: string } }) {
  try {
    const id_acesso = params.id_acesso

    console.log(`Buscando usuário com ID de acesso: ${id_acesso}`)

    // Buscar usuário pelo ID de acesso
    const { data, error } = await supabaseAdmin
      .from("dados_usuario")
      .select("id, nome_completo, nome_empresa, telefone, email, id_acesso")
      .eq("id_acesso", Number.parseInt(id_acesso))
      .single()

    if (error || !data) {
      console.log(`Usuário com ID de acesso ${id_acesso} não encontrado`)
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    console.log(`Usuário encontrado: ${data.nome_completo}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
