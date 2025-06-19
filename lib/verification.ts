// Função para gerar código de verificação de 6 dígitos
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Função para enviar email com código de verificação
export async function sendEmailWithCode(email: string, code: string, name: string): Promise<void> {
  console.log(`[SIMULAÇÃO] Enviando email para ${email} com código ${code}`)

  // Em produção, você usaria um serviço de email como SendGrid, Resend, etc.
  // Exemplo com Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'noreply@seudominio.com',
    to: email,
    subject: 'Código de Verificação - Recuperação de Senha',
    html: `
      <div>
        <h1>Olá, ${name}!</h1>
        <p>Seu código de verificação para recuperação de senha é:</p>
        <h2 style="font-size: 24px; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px; text-align: center;">${code}</h2>
        <p>Este código é válido por 10 minutos.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      </div>
    `,
  });
  */

  // Por enquanto, apenas simulamos o envio
  return Promise.resolve()
}

// Função para enviar SMS com código de verificação
export async function sendSMSWithCode(phone: string, code: string): Promise<void> {
  console.log(`[SIMULAÇÃO] Enviando SMS para ${phone} com código ${code}`)

  // Em produção, você usaria um serviço de SMS como Twilio, MessageBird, etc.
  // Exemplo com Twilio:
  /*
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    body: `Seu código de verificação é: ${code}. Válido por 10 minutos.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
  */

  // Por enquanto, apenas simulamos o envio
  return Promise.resolve()
}
