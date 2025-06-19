"use client"

const SellerCatalog = () => {
  // Função para limpar caracteres especiais das mensagens
  const cleanMessage = (message: string): string => {
    return message
      .replace(/[^\w\s\u00C0-\u017F!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "") // Remove caracteres especiais, mantém acentos
      .replace(/\s+/g, " ") // Remove espaços extras
      .trim()
  }

  const createWhatsAppMessage = (productName: string, price: number): string => {
    const message = `Olá, gostaria de saber mais sobre o produto ${productName} que custa R$ ${price}.`
    return cleanMessage(message)
  }

  const handleWhatsAppClick = (productName: string, price: number) => {
    const phoneNumber = "5511999999999" // Replace with the seller's phone number
    const message = createWhatsAppMessage(productName, price)
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, "_blank")
  }

  return (
    <div>
      <h1>Seller Catalog</h1>
      <ul>
        <li>
          Product A - R$ 20
          <button onClick={() => handleWhatsAppClick("Product A", 20)}>Contact via WhatsApp</button>
        </li>
        <li>
          Product B - R$ 30
          <button onClick={() => handleWhatsAppClick("Product B", 30)}>Contact via WhatsApp</button>
        </li>
      </ul>
    </div>
  )
}

export default SellerCatalog
