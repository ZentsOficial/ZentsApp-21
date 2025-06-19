import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome_completo, nome_empresa, telefone, email, senha, id_acesso } = body

    console.log("📝 Tentativa de cadastro:", {
      nome_completo,
      telefone,
      email,
      id_acesso,
    })

    // Validar dados obrigatórios
    if (!nome_completo || !telefone || !email || !senha || !id_acesso) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    // Verificar se o ID de acesso já existe
    try {
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from("dados_usuario")
        .select("id_acesso")
        .eq("id_acesso", id_acesso)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 significa que não encontrou resultados, o que é o que queremos
        console.error("❌ Erro ao verificar ID de acesso:", checkError)
        return NextResponse.json({ error: "Erro ao verificar disponibilidade do ID de acesso" }, { status: 500 })
      }

      if (existingUser) {
        console.log("⚠️ ID de acesso já existe:", id_acesso)
        return NextResponse.json({ error: "Este ID de acesso já está em uso" }, { status: 409 })
      }

      console.log("✅ ID de acesso disponível:", id_acesso)
    } catch (checkError) {
      console.error("❌ Erro ao verificar ID de acesso:", checkError)
      // Continuar com o cadastro mesmo se houver erro na verificação
    }

    // Verificar se o email já existe
    try {
      const { data: existingEmail, error: emailCheckError } = await supabaseAdmin
        .from("dados_usuario")
        .select("email")
        .eq("email", email)
        .single()

      if (emailCheckError && emailCheckError.code !== "PGRST116") {
        console.error("❌ Erro ao verificar email:", emailCheckError)
      }

      if (existingEmail) {
        console.log("⚠️ Email já existe:", email)
        return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 })
      }

      console.log("✅ Email disponível:", email)
    } catch (emailCheckError) {
      console.error("❌ Erro ao verificar email:", emailCheckError)
    }

    // Verificar se o telefone já existe
    try {
      const { data: existingPhone, error: phoneCheckError } = await supabaseAdmin
        .from("dados_usuario")
        .select("telefone")
        .eq("telefone", telefone)
        .single()

      if (phoneCheckError && phoneCheckError.code !== "PGRST116") {
        console.error("❌ Erro ao verificar telefone:", phoneCheckError)
      }

      if (existingPhone) {
        console.log("⚠️ Telefone já existe:", telefone)
        return NextResponse.json({ error: "Este telefone já está cadastrado" }, { status: 409 })
      }

      console.log("✅ Telefone disponível:", telefone)
    } catch (phoneCheckError) {
      console.error("❌ Erro ao verificar telefone:", phoneCheckError)
    }

    // Tentar cadastro direto no banco
    try {
      console.log("💾 Tentando inserir diretamente no banco de dados...")

      const senhaHash = await bcrypt.hash(senha, 10)

      // Primeiro, criar o usuário no Supabase Auth
      let authUserId = null
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: senha,
          email_confirm: true,
          user_metadata: {
            nome_completo,
            nome_empresa,
            telefone,
            id_acesso: Number.parseInt(id_acesso),
          },
        })

        if (authError) {
          console.error("❌ Erro ao criar usuário no Supabase Auth:", authError)
          console.log("⚠️ Continuando apenas com cadastro na tabela dados_usuario...")
        } else {
          console.log("✅ Usuário criado no Supabase Auth:", authData.user.id)
          authUserId = authData.user.id
        }
      } catch (authError) {
        console.error("❌ Erro no Supabase Auth:", authError)
        console.log("⚠️ Continuando apenas com cadastro na tabela dados_usuario...")
      }

      // Depois, inserir na tabela dados_usuario (sem a coluna user_id por enquanto)
      const { data, error } = await supabaseAdmin
        .from("dados_usuario")
        .insert([
          {
            nome_completo,
            nome_empresa,
            telefone,
            email,
            senha: senhaHash,
            id_acesso: Number.parseInt(id_acesso),
          },
        ])
        .select()

      if (error) {
        console.error("❌ Erro ao inserir na tabela dados_usuario:", error)

        // Tratar diferentes tipos de erro
        if (error.code === "23505") {
          if (error.message.includes("telefone")) {
            return NextResponse.json({ error: "Este telefone já está cadastrado" }, { status: 409 })
          }
          if (error.message.includes("email")) {
            return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 })
          }
          if (error.message.includes("id_acesso") || error.message.includes("unique_id_acesso")) {
            return NextResponse.json({ error: "Este ID de acesso já está em uso" }, { status: 409 })
          }
        }

        // Se for erro de schema/tabela, usar modo mock
        if (
          error.message.includes("relation") ||
          error.message.includes("column") ||
          error.message.includes("table") ||
          error.message.includes("does not exist") ||
          error.code === "42P01" || // relation does not exist
          error.code === "42703" // column does not exist
        ) {
          console.log("🔄 Erro de schema detectado, usando modo mock...")
          return createMockUser({ nome_completo, nome_empresa, telefone, email, id_acesso })
        }

        // Para outros erros, também usar modo mock como fallback
        console.log("🔄 Erro no banco, usando modo mock como fallback...")
        return createMockUser({ nome_completo, nome_empresa, telefone, email, id_acesso })
      }

      // Sucesso real
      console.log("✅ Usuário criado com sucesso no banco!")
      if (authUserId) {
        console.log("✅ Usuário também criado no Supabase Auth!")
      }

      const usuario = data[0]
      const { senha: _, ...usuarioSemSenha } = usuario

      return NextResponse.json({
        message: "Conta criada com sucesso!",
        usuario: usuarioSemSenha,
        mock: false,
        supabaseAuth: !!authUserId,
      })
    } catch (dbError) {
      console.error("❌ Erro de conexão com banco:", dbError)
      console.log("🔄 Usando modo simulação devido ao erro de conexão...")
      return createMockUser({ nome_completo, nome_empresa, telefone, email, id_acesso })
    }
  } catch (error) {
    console.error("❌ Erro inesperado:", error)

    // Fallback para modo mock em caso de erro inesperado
    try {
      const body = await request.json()
      const { nome_completo, nome_empresa, telefone, email, id_acesso } = body
      return createMockUser({ nome_completo, nome_empresa, telefone, email, id_acesso })
    } catch {
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  }
}

// Função para criar usuário mock
function createMockUser({ nome_completo, nome_empresa, telefone, email, id_acesso }: any) {
  console.log("🎭 Criando usuário em modo simulação...")

  const usuarioMock = {
    id: Math.floor(Math.random() * 1000),
    nome_completo,
    nome_empresa,
    telefone,
    email,
    id_acesso: Number.parseInt(id_acesso),
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({
    message: "Conta criada com sucesso (modo simulação - execute o script SQL para usar o banco real)",
    usuario: usuarioMock,
    mock: true,
    note: "Para usar o banco real, execute o script SQL fornecido",
  })
}
