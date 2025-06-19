"use client"

import type React from "react"

import { Search, ShoppingBag, Share2, RefreshCw, Plus } from "lucide-react"
import MobileFrame from "./mobile-frame"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/supabase"

interface CustomerCatalogProps {
  onProductSelect?: (product: Product) => void
}

export default function CustomerCatalog({ onProductSelect }: CustomerCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [vendorPhone, setVendorPhone] = useState<string>("")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Função para limpar caracteres especiais das mensagens
  const cleanMessage = (message: string): string => {
    return message
      .replace(/[^\w\s\u00C0-\u017F!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "") // Remove caracteres especiais, mantém acentos
      .replace(/\s+/g, " ") // Remove espaços extras
      .trim()
  }

  // Função auxiliar para dividir tamanhos com diferentes delimitadores
  const splitSizes = (sizesString?: string): string[] => {
    if (!sizesString) return []

    // Substituir todos os delimitadores por um padrão único e depois dividir
    return sizesString
      .replace(/[/,.]/g, "|") // Substitui /, , e . por |
      .replace(/\s+e\s+/gi, "|") // Substitui " e " por | (case insensitive)
      .replace(/\s+E\s+/g, "|") // Substitui " E " por |
      .split("|")
      .map((size) => size.trim())
      .filter((size) => size.length > 0) // Remove tamanhos vazios
  }

  useEffect(() => {
    // Verificar se existe usuário logado
    const storedUser = localStorage.getItem("usuario")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        console.log("👤 Usuário logado:", {
          nome: user.nome_completo,
          id_acesso: user.id_acesso,
        })
      } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e)
      }
    }

    // Verificar se existe telefone do vendedor no localStorage
    const storedPhone = localStorage.getItem("vendorPhone")
    if (storedPhone) {
      setVendorPhone(storedPhone)
    }

    // Verificar se existe carrinho no localStorage e atualizar contador
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0))
        }
      } catch (e) {
        console.error("Erro ao carregar carrinho do localStorage:", e)
      }
    }

    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se existe usuário logado
      const storedUser = localStorage.getItem("usuario")
      let userIdAcesso = null

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          userIdAcesso = user.id_acesso
          console.log(`🔍 Buscando produtos APENAS do vendedor logado: ${user.nome_completo} (ID: ${userIdAcesso})`)
        } catch (e) {
          console.error("Erro ao carregar dados do usuário:", e)
        }
      }

      let response
      let data

      if (userIdAcesso) {
        // Se há usuário logado, buscar APENAS os produtos deste vendedor
        console.log(`📦 Carregando catálogo específico do vendedor ID: ${userIdAcesso}`)
        response = await fetch(`/api/products/my-products?id_acesso=${userIdAcesso}`)
      } else {
        // Se não há usuário logado, buscar todos os produtos (comportamento anterior)
        console.log("🌐 Carregando catálogo geral (sem usuário logado)")
        response = await fetch("/api/products")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      data = await response.json()

      if (Array.isArray(data)) {
        setProducts(data)

        // Se não temos telefone do localStorage, tentar pegar do primeiro produto
        if (!vendorPhone && data.length > 0) {
          const produtoComTelefone = data.find((p) => p.telefone_vendedor)
          if (produtoComTelefone && produtoComTelefone.telefone_vendedor) {
            setVendorPhone(produtoComTelefone.telefone_vendedor)
            localStorage.setItem("vendorPhone", produtoComTelefone.telefone_vendedor)
          }
        }

        if (userIdAcesso) {
          console.log(`✅ Carregados ${data.length} produtos EXCLUSIVOS do vendedor ${userIdAcesso}`)
        } else {
          console.log(`✅ Carregados ${data.length} produtos no catálogo geral`)
        }
      } else {
        throw new Error("Formato de dados inválido")
      }
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err)
      setError("Erro ao carregar produtos do catálogo.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Extrair categorias únicas dos produtos
  const categories = products.length > 0 ? [...new Set(products.map((product) => product.category))] : []

  // Filtrar produtos por categoria e pesquisa
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.cor?.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesCategory && matchesSearch
  })

  const handleRefresh = () => {
    fetchProducts()
  }

  const handleSizeSelect = (productCode: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productCode]: prev[productCode] === size ? "" : size,
    }))
  }

  const handleShare = async () => {
    try {
      console.log("🔗 Iniciando compartilhamento do catálogo...")

      // Usar dados do usuário logado
      let vendorId = null
      let vendorName = "Vendedor"

      if (currentUser) {
        vendorId = currentUser.id_acesso
        vendorName = currentUser.nome_completo || currentUser.nome_empresa || "Vendedor"
        console.log("📱 Compartilhando catálogo do vendedor logado:", { vendorId, vendorName })
      } else {
        // Fallback: tentar pegar do primeiro produto
        if (products.length > 0) {
          const firstProduct = products[0]
          if (firstProduct.id_do_vendedor) {
            vendorId = firstProduct.id_do_vendedor
            console.log("📦 Usando ID do vendedor do primeiro produto:", vendorId)

            // Tentar buscar nome do vendedor via API
            try {
              const vendorResponse = await fetch(`/api/vendor/${vendorId}`)
              if (vendorResponse.ok) {
                const vendorData = await vendorResponse.json()
                vendorName = vendorData.vendedor?.nome_completo || vendorData.vendedor?.nome_empresa || "Vendedor"
              }
            } catch (e) {
              console.log("Não foi possível buscar nome do vendedor, usando padrão")
            }
          }
        }
      }

      if (!vendorId) {
        alert("❌ Erro: Não foi possível identificar o vendedor. Faça login novamente.")
        return
      }

      // Criar URL do catálogo público que dá acesso APENAS às telas do cliente
      const baseUrl = window.location.origin
      const catalogUrl = `${baseUrl}/catalogo/${vendorId}`

      const shareText = cleanMessage(
        `🛍️ Confira meu catálogo digital!\n\n` +
          `${vendorName}\n` +
          `Produtos exclusivos com os melhores preços!\n\n` +
          `👆 Acesse aqui: ${catalogUrl}\n\n` +
          `📱 Navegue pelo catálogo, veja detalhes dos produtos e faça seus pedidos!\n\n` +
          `💬 Catálogo digital Zents`,
      )

      console.log("🔗 Link gerado:", catalogUrl)
      console.log("📝 Texto para compartilhar:", shareText)

      // Tentar usar Web Share API primeiro (dispositivos móveis)
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Catálogo ${vendorName} - Zents`,
            text: shareText,
            url: catalogUrl,
          })
          console.log("✅ Compartilhado via Web Share API")
          return
        } catch (shareError) {
          console.log("Web Share API cancelado ou falhou, usando clipboard...")
        }
      }

      // Fallback para clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareText)
          alert(
            `✅ Link do catálogo de ${vendorName} copiado!\n\nCole em qualquer conversa para compartilhar.\n\n🔗 ${catalogUrl}`,
          )
          return
        } catch (clipboardError) {
          console.log("Clipboard API falhou, usando método alternativo...")
        }
      }

      // Fallback final: seleção manual
      const textArea = document.createElement("textarea")
      textArea.value = shareText
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand("copy")
        if (successful) {
          alert(`✅ Link do catálogo copiado!\n\n${shareText}`)
        } else {
          // Mostrar prompt para cópia manual
          prompt(`Copie este link para compartilhar seu catálogo:`, shareText)
        }
      } catch (err) {
        prompt(`Copie este link para compartilhar seu catálogo:`, shareText)
      } finally {
        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error("❌ Erro ao compartilhar:", error)
      alert("Erro ao compartilhar catálogo. Tente novamente.")
    }
  }

  // Função para adicionar produto ao carrinho
  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation()

    const selectedSize = selectedSizes[product.codigo_da_peca]

    if (!selectedSize && product.tamanhos_disponiveis && splitSizes(product.tamanhos_disponiveis).length > 0) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.")
      return
    }

    let currentCart = []
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart)
      } catch (e) {
        console.error("Erro ao carregar carrinho do localStorage:", e)
      }
    }

    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.codigo_da_peca === product.codigo_da_peca && item.selectedSize === selectedSize,
    )

    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1
    } else {
      currentCart.push({
        ...product,
        quantity: 1,
        selectedSize:
          selectedSize ||
          (product.tamanhos_disponiveis && splitSizes(product.tamanhos_disponiveis).length > 0
            ? splitSizes(product.tamanhos_disponiveis)[0]
            : undefined),
      })
    }

    localStorage.setItem("cart", JSON.stringify(currentCart))

    const newCartCount = currentCart.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(newCartCount)

    console.log("Produto adicionado ao carrinho:", product.modelo_da_peca, "Tamanho:", selectedSize)
    alert(`${product.modelo_da_peca} ${selectedSize ? `(${selectedSize})` : ""} adicionado ao carrinho!`)
  }

  const handleProductClick = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  return (
    <MobileFrame
      title={currentUser ? `Meu Catálogo - ${currentUser.nome_completo}` : "Catálogo"}
      rightIcon={
        <button onClick={handleShare} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <Share2 className="w-5 h-5 text-white" />
        </button>
      }
    >
      <div className="p-4">
        {/* Informações do vendedor logado */}
        {currentUser && (
          <div className="bg-gradient-to-r from-[#F3E5F5] to-[#E8F5E8] border border-[#7209B7]/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#7209B7]">{currentUser.nome_completo}</p>
                {currentUser.nome_empresa && <p className="text-xs text-[#7209B7]/70">{currentUser.nome_empresa}</p>}
                <p className="text-xs text-[#7209B7]/70">ID: {currentUser.id_acesso}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#FF5722] font-medium">{products.length} produtos</p>
              </div>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] text-sm"
            placeholder="Buscar por modelo, cor ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">{error}</p>
              <button onClick={handleRefresh} className="text-red-600 hover:text-red-800" title="Tentar novamente">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#7209B7]/30 border-t-[#7209B7] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">
              {currentUser ? `Carregando produtos de ${currentUser.nome_completo}...` : "Carregando produtos..."}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `Não encontramos resultados para "${searchQuery}"`
                : currentUser
                  ? `${currentUser.nome_completo} ainda não possui produtos cadastrados`
                  : "Não há produtos disponíveis nesta categoria"}
            </p>
            <button
              className="text-[#7209B7]"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Products grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.codigo_da_peca}
                className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square bg-gray-100 relative rounded-t-lg">
                  <img
                    src={
                      product.foto_do_produto ||
                      `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(product.modelo_da_peca) || "/placeholder.svg"}`
                    }
                    alt={product.modelo_da_peca}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-700">{product.cor}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium truncate mb-1">{product.modelo_da_peca}</h4>
                  <p className="text-xs text-gray-500 mb-2">Código: {product.codigo_da_peca}</p>

                  {product.tamanhos_disponiveis && (
                    <div className="mt-2">
                      <label
                        htmlFor={`size-${product.codigo_da_peca}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tamanho:
                      </label>
                      <select
                        id={`size-${product.codigo_da_peca}`}
                        value={selectedSizes[product.codigo_da_peca] || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [product.codigo_da_peca]: e.target.value,
                          }))
                        }
                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7]"
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        {splitSizes(product.tamanhos_disponiveis).map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <p className="text-[#FF5722] font-semibold mb-3">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.valor)}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full py-2 bg-[#7209B7] text-white rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#7209B7]/90 transition-colors hidden"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating action button */}
        {filteredProducts.length > 0 && (
          <a
            href={`https://wa.me/${vendorPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(cleanMessage("Olá! Gostaria de fazer um pedido pelo catálogo Zents."))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 w-auto h-12 px-4 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-lg no-underline"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Enviar pedido</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#FF5722] text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </a>
        )}
      </div>
    </MobileFrame>
  )
}
