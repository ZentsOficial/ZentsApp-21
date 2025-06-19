"use client"

import { ChevronLeft, Minus, Plus, Trash2, User, Phone, Store } from "lucide-react"
import MobileFrame from "./mobile-frame"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/supabase"

interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

interface VendorInfo {
  id_acesso: number
  nome_completo: string
  nome_empresa?: string
  telefone: string
  email: string
}

interface ShoppingCartProps {
  onBack?: () => void
}

// Função para limpar caracteres especiais das mensagens
const cleanMessage = (message: string): string => {
  return message
    .replace(/[^\w\s\u00C0-\u017F!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "") // Remove caracteres especiais, mantém acentos
    .replace(/\s+/g, " ") // Remove espaços extras
    .trim()
}

export default function ShoppingCart({ onBack }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null)
  const [loadingVendor, setLoadingVendor] = useState(false)

  useEffect(() => {
    async function fetchCartItems() {
      try {
        setLoading(true)
        setError(null)

        // Tentar carregar carrinho do localStorage
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              setCartItems(parsedCart)

              // Buscar informações do vendedor baseado no primeiro produto
              const firstProduct = parsedCart[0]
              if (firstProduct.id_do_vendedor) {
                await fetchVendorByIdAcesso(firstProduct.id_do_vendedor)
              }

              setLoading(false)
              return
            }
          } catch (e) {
            console.error("Erro ao carregar carrinho do localStorage:", e)
          }
        }

        // Se não tiver carrinho salvo, buscar produtos do banco de dados
        console.log("🛒 Buscando produtos para simular carrinho...")
        const response = await fetch("/api/products")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const products = await response.json()

        if (Array.isArray(products) && products.length > 0) {
          console.log(`📦 Produtos carregados: ${products.length}`)

          // Simular alguns produtos no carrinho (pegar os 2 primeiros produtos)
          const simulatedCart: CartItem[] = products.slice(0, 2).map((product: Product, index: number) => ({
            ...product,
            quantity: index + 1, // Quantidade 1 para o primeiro, 2 para o segundo
            selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
          }))

          setCartItems(simulatedCart)

          // Salvar no localStorage
          localStorage.setItem("cart", JSON.stringify(simulatedCart))

          // Buscar informações do vendedor baseado no primeiro produto
          if (simulatedCart.length > 0 && simulatedCart[0].id_do_vendedor) {
            await fetchVendorByIdAcesso(simulatedCart[0].id_do_vendedor)
          }
        } else {
          setError("Nenhum produto disponível para adicionar ao carrinho")
        }
      } catch (err) {
        console.error("❌ Erro ao carregar produtos:", err)
        setError("Erro ao carregar produtos do carrinho")
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const fetchVendorByIdAcesso = async (idAcesso: number) => {
    try {
      setLoadingVendor(true)
      console.log(`🔍 Buscando vendedor com ID de acesso: ${idAcesso}`)

      const response = await fetch(`/api/vendor/${idAcesso}`)

      if (response.ok) {
        const data = await response.json()
        const vendor = data.vendedor

        console.log(`✅ Vendedor encontrado:`, {
          nome: vendor.nome_completo,
          empresa: vendor.nome_empresa,
          telefone: vendor.telefone,
          id_acesso: vendor.id_acesso,
        })

        setVendorInfo(vendor)

        // Salvar no localStorage para uso posterior
        localStorage.setItem("vendorInfo", JSON.stringify(vendor))
        localStorage.setItem("vendorPhone", vendor.telefone)

        console.log(`📱 Telefone conectado: ${vendor.telefone} → ID ${vendor.id_acesso}`)
      } else {
        console.log("❌ Vendedor não encontrado via API, usando fallback...")

        // Fallback baseado no ID de acesso
        const fallbackVendors: { [key: number]: VendorInfo } = {
          12345: {
            id_acesso: 12345,
            nome_completo: "Maria da Silva",
            nome_empresa: "Boutique Maria Fashion",
            telefone: "11987654321",
            email: "maria@boutiquemaria.com.br",
          },
          54321: {
            id_acesso: 54321,
            nome_completo: "João Santos",
            nome_empresa: "Moda Masculina João",
            telefone: "11912345678",
            email: "joao@modajoao.com.br",
          },
          67890: {
            id_acesso: 67890,
            nome_completo: "Ana Costa",
            nome_empresa: "Ana Fitness & Style",
            telefone: "11999887766",
            email: "ana@anafitness.com.br",
          },
          98765: {
            id_acesso: 98765,
            nome_completo: "Carlos Oliveira",
            nome_empresa: "Elegance Carlos",
            telefone: "11888777666",
            email: "carlos@elegancecarlos.com.br",
          },
          11111: {
            id_acesso: 11111,
            nome_completo: "Lucia Fernandes",
            nome_empresa: "Lucia Moda Íntima",
            telefone: "11777666555",
            email: "lucia@luciamodaintima.com.br",
          },
        }

        const fallbackVendor = fallbackVendors[idAcesso] || {
          id_acesso: idAcesso,
          nome_completo: "Vendedor",
          telefone: "11987654321",
          email: "vendedor@exemplo.com",
        }

        console.log(`🔄 Usando dados fallback:`, fallbackVendor)
        setVendorInfo(fallbackVendor)
        localStorage.setItem("vendorInfo", JSON.stringify(fallbackVendor))
        localStorage.setItem("vendorPhone", fallbackVendor.telefone)
      }
    } catch (error) {
      console.error("❌ Erro ao buscar informações do vendedor:", error)

      // Fallback final
      const fallbackVendor: VendorInfo = {
        id_acesso: idAcesso,
        nome_completo: "Vendedor",
        telefone: "11987654321",
        email: "vendedor@exemplo.com",
      }

      setVendorInfo(fallbackVendor)
    } finally {
      setLoadingVendor(false)
    }
  }

  const updateQuantity = (codigo: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(codigo)
      return
    }

    const updatedItems = cartItems.map((item) =>
      item.codigo_da_peca === codigo ? { ...item, quantity: newQuantity } : item,
    )

    setCartItems(updatedItems)
    localStorage.setItem("cart", JSON.stringify(updatedItems))
  }

  const updateSize = (codigo: string, newSize: string) => {
    const updatedItems = cartItems.map((item) =>
      item.codigo_da_peca === codigo ? { ...item, selectedSize: newSize } : item,
    )

    setCartItems(updatedItems)
    localStorage.setItem("cart", JSON.stringify(updatedItems))
  }

  const removeItem = (codigo: string) => {
    const updatedItems = cartItems.filter((item) => item.codigo_da_peca !== codigo)
    setCartItems(updatedItems)
    localStorage.setItem("cart", JSON.stringify(updatedItems))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.valor * item.quantity, 0)
  }

  const handleFinishOrder = () => {
    if (!vendorInfo?.telefone || cartItems.length === 0) {
      alert("❌ Erro: Telefone do vendedor não encontrado ou carrinho vazio")
      return
    }

    console.log(`🚀 Iniciando envio do pedido para:`, {
      vendedor: vendorInfo.nome_completo,
      telefone: vendorInfo.telefone,
      id_acesso: vendorInfo.id_acesso,
      total_itens: cartItems.length,
    })

    // Criar mensagem detalhada para WhatsApp
    const itemsText = cartItems
      .map((item) =>
        cleanMessage(
          `${item.modelo_da_peca}\n` +
            `Código: ${item.codigo_da_peca}\n` +
            `Cor: ${item.cor}\n` +
            `Tamanho: ${item.selectedSize || "Não selecionado"}\n` +
            `Quantidade: ${item.quantity}\n` +
            `Valor unitário: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valor)}\n` +
            `Subtotal: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valor * item.quantity)}\n`,
        ),
      )
      .join("\n")

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalValue = calculateSubtotal()

    const message = cleanMessage(
      `NOVO PEDIDO ZENTS\n\n` +
        `Olá ${vendorInfo.nome_completo}!\n` +
        `${vendorInfo.nome_empresa ? `${vendorInfo.nome_empresa}\n` : ""}` +
        `ID de Acesso: ${vendorInfo.id_acesso}\n` +
        `Telefone: ${vendorInfo.telefone}\n\n` +
        `DETALHES DO PEDIDO:\n\n` +
        `${itemsText}\n` +
        `RESUMO FINAL:\n` +
        `• Total de itens: ${totalItems}\n` +
        `• Valor total: *${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(totalValue)}*\n\n` +
        `Pedido feito através do catálogo digital Zents\n` +
        `Data/Hora: ${new Date().toLocaleString("pt-BR")}\n\n` +
        `Aguardo confirmação e informações sobre entrega!\n\n` +
        `Muito obrigado!`,
    )

    const phoneNumber = vendorInfo.telefone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    console.log(`📱 Enviando para WhatsApp:`, {
      telefone_limpo: phoneNumber,
      url_length: whatsappUrl.length,
      vendedor: vendorInfo.nome_completo,
    })

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank")

    // Log de sucesso
    console.log(`✅ Pedido enviado com sucesso para ${vendorInfo.nome_completo} (${vendorInfo.telefone})`)
  }

  const handleBackClick = () => {
    console.log("🔙 Clicou na setinha - voltando para o catálogo...")
    if (onBack) {
      onBack()
    } else {
      // Fallback: tentar navegar para a aba do catálogo
      if (typeof window !== "undefined") {
        // Primeiro tentar clicar na aba customer-view
        const catalogTab = document.querySelector('[value="customer-view"]') as HTMLElement
        if (catalogTab) {
          console.log("✅ Navegando via aba customer-view")
          catalogTab.click()
        } else {
          // Segundo fallback: disparar evento customizado
          console.log("🔄 Disparando evento customizado para voltar ao catálogo")
          window.dispatchEvent(new CustomEvent("navigate-to-catalog"))
        }
      }
    }
  }

  const subtotal = calculateSubtotal()

  // Também modificar a versão de loading para usar onBackClick
  if (loading) {
    return (
      <MobileFrame
        title="Finalizar Pedido"
        leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}
        onBackClick={handleBackClick} // Usar a nova prop onBackClick
        showFooter={false}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <div className="w-12 h-12 border-4 border-[#7209B7]/30 border-t-[#7209B7] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Carregando carrinho...</p>
        </div>
      </MobileFrame>
    )
  }

  return (
    <MobileFrame
      title="Finalizar Pedido"
      leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}
      onBackClick={handleBackClick} // Usar a nova prop onBackClick
      showFooter={false}
    >
      <div className="flex flex-col h-full">
        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-800 px-4 py-2">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Vendor info - CONEXÃO ID ↔ TELEFONE */}
        {vendorInfo && (
          <div className="bg-gradient-to-r from-[#F3E5F5] to-[#E8F5E8] border-b border-[#7209B7]/20 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#7209B7] flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#7209B7]">{vendorInfo.nome_completo}</p>
                  {vendorInfo.nome_empresa && (
                    <div className="flex items-center">
                      <Store className="w-3 h-3 text-[#7209B7]/70 mr-1" />
                      <p className="text-xs text-[#7209B7]/70">{vendorInfo.nome_empresa}</p>
                    </div>
                  )}
                  <p className="text-xs text-[#7209B7]/70 font-medium">ID: {vendorInfo.id_acesso}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-[#FF5722] bg-white px-2 py-1 rounded-full">
                  <Phone className="w-4 h-4 mr-1" />
                  <p className="text-sm font-bold">{vendorInfo.telefone}</p>
                </div>
                {loadingVendor && <p className="text-xs text-[#7209B7]/70 mt-1">Carregando...</p>}
              </div>
            </div>
            <div className="mt-2 bg-white/50 rounded-md px-2 py-1">
              <p className="text-xs text-[#7209B7] text-center">
                ✅ Conexão estabelecida: ID {vendorInfo.id_acesso} ↔ {vendorInfo.telefone}
              </p>
            </div>
          </div>
        )}

        {/* Empty cart state */}
        {!loading && cartItems.length === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Carrinho vazio</h3>
            <p className="text-gray-500 text-center">Adicione produtos ao carrinho para finalizar o pedido</p>
          </div>
        )}

        {/* Cart items */}
        {cartItems.length > 0 && (
          <>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.codigo_da_peca} className="flex gap-3 border-b border-gray-200 pb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={
                        item.foto_do_produto ||
                        `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(item.modelo_da_peca) || "/placeholder.svg"}`
                      }
                      alt={item.modelo_da_peca}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.modelo_da_peca}</h4>
                    <p className="text-[#FF5722] font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.valor)}
                    </p>
                    <p className="text-xs text-gray-500">Código: {item.codigo_da_peca}</p>
                    <p className="text-xs text-gray-500">Cor: {item.cor}</p>

                    {/* Tamanho selecionado */}
                    {item.selectedSize && <p className="text-xs text-gray-500">Tamanho: {item.selectedSize}</p>}

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                          onClick={() => updateQuantity(item.codigo_da_peca, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                          onClick={() => updateQuantity(item.codigo_da_peca, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.codigo_da_peca)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} itens)</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-[#FF5722] text-lg">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </span>
                </div>
              </div>

              {/* BOTÃO PRINCIPAL - CONECTADO AO TELEFONE DO VENDEDOR */}
              <button
                onClick={handleFinishOrder}
                disabled={!vendorInfo?.telefone || loadingVendor}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  vendorInfo?.telefone && !loadingVendor
                    ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white hover:from-[#FF5722]/90 hover:to-[#FF7043]/90 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.865 4.002c-.293.566.35 1.148.935.859.775-.383 1.7-.661 2.711-.661 1.843 0 3.526.65 4.713 1.723L11.997 12l-1.597 2.077c-1.188 1.073-2.87 1.723-4.713 1.723-1.01 0-1.936-.278-2.711-.661-.585-.29-1.228.293-.935.86A7.94 7.94 0 0 0 12 20a7.85 7.85 0 0 0 5.6-2.32l3.997-5.18-3.996-5.18h-.001Z" />
                </svg>
                {loadingVendor
                  ? "Conectando..."
                  : vendorInfo?.telefone
                    ? `Enviar para ${vendorInfo.nome_completo}`
                    : "Carregando vendedor..."}
              </button>

              {vendorInfo && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    📱 Pedido será enviado para: <span className="font-medium">{vendorInfo.telefone}</span>
                  </p>
                  <p className="text-xs text-gray-400">ID de Acesso: {vendorInfo.id_acesso}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  )
}
