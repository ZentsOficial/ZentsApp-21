import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decodeBase64 } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    console.log("🔍 Iniciando verificação de código")

    // Parse do corpo da requisição
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json({ message: "Formato de requisição inválido" }, { status: 400 })
    }

    const { idAcesso, code } = body

    console.log(`🔐 Verificando código para ID: ${idAcesso}, código: ${code}`)

    if (!idAcesso || !code) {
      console.log("❌ ID de acesso ou código não fornecido")
      return NextResponse.json({ message: "ID de acesso e código são obrigatórios" }, { status: 400 })
    }

    // Verificar se o código existe no cookie
    const cookieStore = cookies()
    const cookieName = `verification_${idAcesso}`
    const cookieValue = cookieStore.get(cookieName)

    console.log(`🍪 Buscando cookie: ${cookieName}`)

    if (!cookieValue) {
      console.log(`❌ Cookie não encontrado para ID: ${idAcesso}`)

      // Em desenvolvimento, aceitar qualquer código de 6 dígitos
      if (process.env.NODE_ENV !== "production" && code.length === 6 && /^\d{6}$/.test(code)) {
        console.log("🔧 Modo desenvolvimento: aceitando código genérico")
        return NextResponse.json({
          message: "Código verificado com sucesso (modo desenvolvimento)",
          success: true,
        })
      }

      return NextResponse.json({ message: "Código não encontrado ou expirado" }, { status: 400 })
    }

    // Decodificar dados do cookie
    let storedData
    try {
      const decodedValue = decodeBase64(cookieValue.value)
      storedData = JSON.parse(decodedValue)
      console.log("🔢 Dados do cookie:", { storedCode: storedData.code, receivedCode: code })
    } catch (decodeError) {
      console.error("❌ Erro ao decodificar cookie:", decodeError)
      cookieStore.delete(cookieName)
      return NextResponse.json({ message: "Erro ao verificar código" }, { status: 500 })
    }

    // Verificar se o código expirou
    if (Date.now() > storedData.expires) {
      console.log("❌ Código expirado")
      cookieStore.delete(cookieName)
      return NextResponse.json({ message: "Código expirado" }, { status: 400 })
    }

    // Verificar se o código está correto
    if (storedData.code !== code) {
      console.log(`❌ Código incorreto. Esperado: ${storedData.code}, Recebido: ${code}`)
      return NextResponse.json({ message: "Código inválido" }, { status: 400 })
    }

    console.log("✅ Código verificado com sucesso")

    // Marcar o código como usado (remover cookie)
    cookieStore.delete(cookieName)

    return NextResponse.json({
      message: "Código verificado com sucesso",
      success: true,
    })
  } catch (error) {
    console.error("❌ Erro ao verificar código:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
