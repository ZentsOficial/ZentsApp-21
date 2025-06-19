import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json({ success: false, message: "Email é obrigatório" }, { status: 400 })
    }

    // Usar o Supabase Auth para enviar email de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error("Erro do Supabase:", error.message)
      return Response.json(
        {
          success: false,
          message: "Erro ao enviar email de recuperação",
        },
        { status: 400 },
      )
    }

    return Response.json({
      success: true,
      message: "Se o email existir em nossa base, você receberá as instruções de recuperação.",
    })
  } catch (error) {
    console.error("Erro ao processar recuperação de senha:", error)
    return Response.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
