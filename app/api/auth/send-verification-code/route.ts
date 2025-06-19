import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encodeBase64 } from "@/lib/utils"

// Função para gerar código de verificação
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Função para simular envio de email
async function sendEmailWithCode(email: string, code: string, name: string) {
  console.log(`📧 Email enviado para ${email}:`)
  console.log(`Olá ${name}, seu código de verificação é: ${code}`)
  console.log(`Este código expira em 10 minutos.`)
  return true
}

// Função para simular envio de SMS
async function sendSMSWithCode(phone: string, code: string) {
  console.log(`📱 SMS enviado para ${phone}:`)
  console.log(`Seu código de verificação é: ${code}`)
  console.log(`Este código expira em 10 minutos.`)
  return true
}

export async function POST(request: Request) {
  try {
    console.log("🚀 Iniciando processo de envio de código de verificação")

    // Parse do corpo da requisição
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json({ message: "Formato de requisição inválido" }, { status: 400 })
    }

    const { idAcesso, method } = body

    console.log(`🔐 Dados recebidos - ID: ${idAcesso}, método: ${method}`)

    if (!idAcesso) {
      console.log("❌ ID de acesso não fornecido")
      return NextResponse.json({ message: "ID de acesso é obrigatório" }, { status: 400 })
    }

    if (!method || (method !== "email" && method !== "sms")) {
      console.log("❌ Método de verificação inválido")
      return NextResponse.json({ message: "Método de verificação inválido" }, { status: 400 })
    }

    // Buscar usuário pelo ID de acesso
    console.log(`🔍 Buscando usuário com ID de acesso: ${idAcesso}`)

    let user
    try {
      const { data, error } = await supabaseAdmin
        .from("dados_usuario")
        .select("id, nome_completo, email, telefone")
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

    // Verificar se o usuário tem o método de contato solicitado
    if (method === "email") {
      if (!user.email) {
        console.error("❌ Usuário não possui email cadastrado")
        return NextResponse.json({ message: "Usuário não possui email cadastrado" }, { status: 400 })
      }
      console.log(`📧 Email encontrado: ${user.email}`)
    }

    if (method === "sms") {
      if (!user.telefone) {
        console.error("❌ Usuário não possui telefone cadastrado")
        return NextResponse.json({ message: "Usuário não possui telefone cadastrado" }, { status: 400 })
      }
      console.log(`📱 Telefone encontrado: ${user.telefone}`)
    }

    // Gerar código de verificação (6 dígitos)
    const verificationCode = generateVerificationCode()
    console.log(`🔢 Código gerado: ${verificationCode} (APENAS PARA DESENVOLVIMENTO)`)

    // Armazenar código em cookie seguro
    const expirationTime = Date.now() + 10 * 60 * 1000 // 10 minutos
    const cookieData = {
      code: verificationCode,
      expires: expirationTime,
      method: method,
    }

    try {
      // Armazenar em cookie seguro
      const cookieStore = cookies()
      const cookieValue = encodeBase64(JSON.stringify(cookieData))

      cookieStore.set(`verification_${idAcesso}`, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutos
        path: "/",
      })

      console.log(`🍪 Código armazenado em cookie para ID: ${idAcesso}`)
    } catch (cookieError) {
      console.error("❌ Erro ao armazenar cookie:", cookieError)
      // Continuar mesmo com erro no cookie
    }

    // Enviar código pelo método escolhido
    try {
      if (method === "email") {
        console.log(`📧 Enviando código por email para: ${user.email}`)
        await sendEmailWithCode(user.email, verificationCode, user.nome_completo)
      } else if (method === "sms") {
        console.log(`📱 Enviando código por SMS para: ${user.telefone}`)
        await sendSMSWithCode(user.telefone, verificationCode)
      }

      console.log(`✅ Código enviado com sucesso via ${method}`)

      // Resposta de sucesso - sem incluir o código na resposta
      return NextResponse.json({
        message: "Código de verificação enviado com sucesso",
        success: true,
      })
    } catch (sendError) {
      console.error("❌ Erro ao enviar código:", sendError)
      return NextResponse.json({ message: "Erro ao enviar código de verificação" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Erro geral ao processar requisição:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
