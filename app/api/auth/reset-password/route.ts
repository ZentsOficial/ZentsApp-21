import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    console.log("🔐 Iniciando redefinição de senha")

    const body = await request.json()
    const { idAcesso, newPassword } = body

    console.log("📥 Dados recebidos:", { idAcesso, newPassword: newPassword ? "***" : "undefined" })

    console.log(`🔑 Redefinindo senha para ID: ${idAcesso}`)

    if (!idAcesso || !newPassword) {
      console.log("❌ ID de acesso ou nova senha não fornecido")
      return NextResponse.json({ message: "ID de acesso e nova senha são obrigatórios" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      console.log("❌ Senha muito curta")
      return NextResponse.json({ message: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar se o usuário existe
    console.log(`🔍 Verificando usuário com ID: ${idAcesso}`)

    const { data: user, error: userError } = await supabaseAdmin
      .from("dados_usuario")
      .select("id, nome_completo")
      .eq("id_acesso", Number.parseInt(idAcesso))
      .single()

    if (userError || !user) {
      console.error("❌ Usuário não encontrado:", userError)
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    console.log(`✅ Usuário encontrado: ${user.nome_completo}`)

    // Criptografar a nova senha
    console.log("🔒 Criptografando nova senha")
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Atualizar a senha no banco de dados
    console.log("💾 Atualizando senha no banco de dados")
    const { error: updateError } = await supabaseAdmin
      .from("dados_usuario")
      .update({ senha: hashedPassword })
      .eq("id_acesso", Number.parseInt(idAcesso))

    if (updateError) {
      console.error("❌ Erro ao atualizar senha:", updateError)
      return NextResponse.json({ message: "Erro ao atualizar senha" }, { status: 500 })
    }

    console.log("✅ Senha atualizada com sucesso")

    return NextResponse.json({
      message: "Senha redefinida com sucesso",
      success: true,
    })
  } catch (error) {
    console.error("❌ Erro ao redefinir senha:", error)
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        error: process.env.NODE_ENV !== "production" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
