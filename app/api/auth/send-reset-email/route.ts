import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("🚀 Iniciando processo de envio de email de recuperação")

    // Parse do corpo da requisição
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json({ message: "Formato de requisição inválido" }, { status: 400 })
    }

    const { idAcesso } = body

    console.log(`🔐 Dados recebidos - ID: ${idAcesso}`)

    if (!idAcesso) {
      console.log("❌ ID de acesso não fornecido")
      return NextResponse.json({ message: "ID de acesso é obrigatório" }, { status: 400 })
    }

    // Buscar usuário pelo ID de acesso
    console.log(`🔍 Buscando usuário com ID de acesso: ${idAcesso}`)

    let user
    try {
      const { data, error } = await supabaseAdmin
        .from("dados_usuario")
        .select("id, nome_completo, email")
        .eq("id_acesso", idAcesso)
        .single()

      if (error) {
        console.error("❌ Erro ao buscar usuário:", error)
        return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
      }

      if (!data) {
        console.log("❌ Usuário não encontrado")
        return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
      }

      user = data
      console.log(`✅ Usuário encontrado: ${user.nome_completo}`)
    } catch (dbError) {
      console.error("❌ Erro na consulta ao banco:", dbError)
      return NextResponse.json({ message: "Erro ao acessar banco de dados" }, { status: 500 })
    }

    // Verificar se o usuário tem email
    if (!user.email) {
      console.error("❌ Usuário não possui email cadastrado")
      return NextResponse.json({ message: "Usuário não possui email cadastrado" }, { status: 400 })
    }

    console.log(`📧 Email encontrado: ${user.email}`)

    // Tentar enviar email de recuperação diretamente
    console.log(`📧 Tentando enviar email de recuperação para: ${user.email}`)

    try {
      const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
      })

      if (resetError) {
        // Se o erro for porque o usuário não existe, criar o usuário primeiro
        if (resetError.message.includes("User not found") || resetError.message.includes("Invalid email")) {
          console.log(`🆕 Usuário não existe no Supabase Auth, criando: ${user.email}`)

          // Gerar senha aleatória temporária
          const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)

          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: tempPassword,
            email_confirm: true,
          })

          if (createError) {
            console.error(`❌ Erro ao criar usuário no Supabase Auth: ${createError.message}`)
            return NextResponse.json({ message: "Erro ao criar usuário para recuperação de senha" }, { status: 500 })
          }

          console.log(`✅ Usuário criado no Supabase Auth: ${user.email}`)

          // Tentar enviar email novamente após criar o usuário
          const { error: resetError2 } = await supabaseAdmin.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
          })

          if (resetError2) {
            console.error(`❌ Erro ao enviar email após criar usuário: ${resetError2.message}`)
            return NextResponse.json({ message: "Erro ao enviar email de recuperação" }, { status: 500 })
          }
        } else {
          console.error(`❌ Erro ao enviar email de recuperação: ${resetError.message}`)
          return NextResponse.json({ message: "Erro ao enviar email de recuperação" }, { status: 500 })
        }
      }

      console.log(`✅ Email de recuperação enviado com sucesso para: ${user.email}`)

      return NextResponse.json({
        message: "Email de recuperação enviado com sucesso",
        success: true,
      })
    } catch (authError) {
      console.error("❌ Erro ao acessar Supabase Auth:", authError)
      return NextResponse.json({ message: "Erro ao processar autenticação" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Erro geral ao processar requisição:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
