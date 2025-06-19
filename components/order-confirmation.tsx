import type React from "react"

interface OrderConfirmationProps {
  orderId: string
  customerName: string
  items: { name: string; quantity: number }[]
  totalAmount: number
  phoneNumber: string
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  customerName,
  items,
  totalAmount,
  phoneNumber,
}) => {
  // Função para limpar caracteres especiais das mensagens
  const cleanMessage = (message: string): string => {
    return message
      .replace(/[^\w\s\u00C0-\u017F!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "") // Remove caracteres especiais, mantém acentos
      .replace(/\s+/g, " ") // Remove espaços extras
      .trim()
  }

  const generateWhatsAppMessage = (): string => {
    let message = `Olá ${customerName},\n\n`
    message += `Seu pedido #${orderId} foi confirmado com sucesso!\n\n`
    message += "Itens do pedido:\n"

    items.forEach((item) => {
      message += `- ${item.name} x${item.quantity}\n`
    })

    message += `\nTotal: R$${totalAmount.toFixed(2)}\n\n`
    message += "Agradecemos a sua compra!"

    return cleanMessage(message)
  }

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`

  return (
    <div>
      <h2>Confirmação de Pedido</h2>
      <p>
        Olá, {customerName}! Seu pedido #{orderId} foi confirmado e está sendo preparado.
      </p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - Quantidade: {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: R$ {totalAmount.toFixed(2)}</p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        Enviar confirmação por WhatsApp
      </a>
    </div>
  )
}

export default OrderConfirmation
