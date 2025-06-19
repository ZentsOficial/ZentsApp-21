"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, ShoppingBag, Plus, ChevronLeft, Heart, Share2, Minus, Trash2 } from "lucide-react"
import type { Product } from "@/lib/supabase"

interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

export default function CatalogoPublico() {
  // Adicione esta função auxiliar no início do componente CatalogoPublico, logo após a declaração da função

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

  // Adicionar esta função auxiliar logo após a função splitSizes:

  // Função para limpar caracteres especiais das mensagens
  const cleanMessage = (message: string): string => {
    return message
      .replace(/[^\w\s\u00C0-\u017F!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "") // Remove caracteres especiais, mantém acentos
      .replace(/\/\//g, "") // Remove especificamente o caractere
      .replace(/\s+/g, " ") // Remove espaços extras
      .trim()
  }

  const params = useParams()
  const vendorId = params.vendorId as string

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [vendorInfo, setVendorInfo] = useState<any>(null)
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Estados para navegação entre telas
  const [currentView, setCurrentView] = useState<"catalog" | "product" | "cart">("catalog")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productQuantity, setProductQuantity] = useState(1)

  useEffect(() => {
    if (vendorId) {
      fetchVendorProducts()
      fetchVendorInfo()
    }
  }, [vendorId])

  const fetchVendorProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🛍️ Buscando produtos do vendedor: ${vendorId}`)

      const response = await fetch(`/api/products/vendor/${vendorId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products)
        console.log(`✅ Carregados ${data.products.length} produtos do vendedor ${vendorId}`)
      } else {
        setError("Nenhum produto encontrado para este vendedor")
      }
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err)
      setError("Erro ao carregar produtos do catálogo.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchVendorInfo = async () => {
    try {
      const response = await fetch(`/api/vendor/${vendorId}`)
      if (response.ok) {
        const data = await response.json()
        setVendorInfo(data.vendedor)
        console.log("✅ Informações do vendedor carregadas:", data.vendedor.nome_completo)
      }
    } catch (error) {
      console.error("Erro ao buscar informações do vendedor:", error)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.modelo_da_peca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.cor?.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesSearch
  })

  // Funções do catálogo
  const handleProductClick = (product: Product) => {
    console.log("🔍 Produto clicado:", product.modelo_da_peca)
    setSelectedProduct(product)
    setProductQuantity(1)

    // Definir tamanho padrão se disponível
    if (product.tamanhos_disponiveis && !selectedSizes[product.codigo_da_peca]) {
      const sizes = splitSizes(product.tamanhos_disponiveis)
      if (sizes.length > 0) {
        setSelectedSizes((prev) => ({
          ...prev,
          [product.codigo_da_peca]: sizes[0],
        }))
      }
    }

    setCurrentView("product")
  }

  const handleAddToCartFromCatalog = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation()
    const selectedSize = selectedSizes[product.codigo_da_peca]

    if (!selectedSize && product.tamanhos_disponiveis) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.")
      return
    }

    addToCart(product, selectedSize, 1)
  }

  // Funções do produto
  const handleAddToCartFromProduct = () => {
    if (!selectedProduct) return

    const selectedSize = selectedSizes[selectedProduct.codigo_da_peca]

    if (!selectedSize && selectedProduct.tamanhos_disponiveis) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.")
      return
    }

    addToCart(selectedProduct, selectedSize, productQuantity)
  }

  const handleBuyNow = () => {
    if (!selectedProduct || !vendorInfo?.telefone) return

    const selectedSize = selectedSizes[selectedProduct.codigo_da_peca]

    if (!selectedSize && selectedProduct.tamanhos_disponiveis) {
      alert("Por favor, selecione um tamanho antes de comprar.")
      return
    }

    // Na função handleBuyNow, substituir a criação da mensagem por:

    const message = cleanMessage(
      `Ola! Gostaria de comprar:` +
        `\n\n` +
        `Produto: ${selectedProduct.modelo_da_peca}` +
        `\nCodigo: ${selectedProduct.codigo_da_peca}` +
        `\nCor: ${selectedProduct.cor}` +
        `\nTamanho: ${selectedSize || "Nao especificado"}` +
        `\nQuantidade: ${productQuantity}` +
        `\nValor: ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(selectedProduct.valor * productQuantity)}` +
        `\n\nObrigado!`,
    )

    const phoneNumber = vendorInfo.telefone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    console.log("📱 Mensagem que será enviada:", message)
    console.log("🔗 URL do WhatsApp:", whatsappUrl)

    window.open(whatsappUrl, "_blank")
  }

  // Funções do carrinho
  const addToCart = (product: Product, selectedSize: string | undefined, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.codigo_da_peca === product.codigo_da_peca && item.selectedSize === selectedSize,
    )

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity
      setCartItems(updatedItems)
    } else {
      const newItem: CartItem = {
        ...product,
        quantity,
        selectedSize,
      }
      setCartItems([...cartItems, newItem])
    }

    console.log(`✅ Produto adicionado ao carrinho: ${product.modelo_da_peca} (${selectedSize || "sem tamanho"})`)
    alert(`${product.modelo_da_peca} ${selectedSize ? `(${selectedSize})` : ""} adicionado ao carrinho!`)
  }

  const updateCartQuantity = (codigo: string, selectedSize: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(codigo, selectedSize)
      return
    }

    const updatedItems = cartItems.map((item) =>
      item.codigo_da_peca === codigo && item.selectedSize === selectedSize ? { ...item, quantity: newQuantity } : item,
    )
    setCartItems(updatedItems)
  }

  const removeFromCart = (codigo: string, selectedSize: string | undefined) => {
    const updatedItems = cartItems.filter(
      (item) => !(item.codigo_da_peca === codigo && item.selectedSize === selectedSize),
    )
    setCartItems(updatedItems)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.valor * item.quantity, 0)
  }

  const handleSendOrder = () => {
    if (!vendorInfo?.telefone || cartItems.length === 0) {
      alert("❌ Erro: Telefone do vendedor não encontrado ou carrinho vazio")
      return
    }

    // E também limpar o itemsText antes de usar:

    const itemsText = cartItems
      .map((item) =>
        cleanMessage(
          `${item.modelo_da_peca}` +
            `\nCodigo: ${item.codigo_da_peca}` +
            `\nCor: ${item.cor}` +
            `\nTamanho: ${item.selectedSize || "Nao selecionado"}` +
            `\nQuantidade: ${item.quantity}` +
            `\nValor unitario: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valor)}` +
            `\nSubtotal: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valor * item.quantity)}`,
        ),
      )
      .join("\n\n")

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalValue = calculateTotal()

    // Na função handleSendOrder, substituir a criação da mensagem por:

    const message = cleanMessage(
      `NOVO PEDIDO ZENTS` +
        `\n\n` +
        `Ola ${vendorInfo.nome_completo}!` +
        `\n${vendorInfo.nome_empresa ? `${vendorInfo.nome_empresa}\n` : ""}` +
        `\nDETALHES DO PEDIDO:` +
        `\n\n${itemsText}` +
        `\n\nRESUMO FINAL:` +
        `\nTotal de itens: ${totalItems}` +
        `\nValor total: ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(totalValue)}` +
        `\n\nPedido feito atraves do catalogo digital Zents` +
        `\nData/Hora: ${new Date().toLocaleString("pt-BR")}` +
        `\n\nAguardo confirmacao e informacoes sobre entrega!` +
        `\n\nMuito obrigado!`,
    )

    const phoneNumber = vendorInfo.telefone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    console.log("📱 Mensagem do carrinho que será enviada:", message)

    window.open(whatsappUrl, "_blank")
    console.log(`✅ Pedido enviado para ${vendorInfo.nome_completo} (${vendorInfo.telefone})`)
  }

  // Função para voltar
  const handleBack = () => {
    console.log("🔙 Voltando de:", currentView)
    if (currentView === "product") {
      setCurrentView("catalog")
      setSelectedProduct(null)
    } else if (currentView === "cart") {
      setCurrentView("catalog")
    }
  }

  // Função para ir ao carrinho
  const handleGoToCart = () => {
    console.log("🛒 Indo para carrinho com", cartItems.length, "itens")
    setCurrentView("cart")
  }

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  console.log("🔄 Estado atual:", {
    currentView,
    selectedProduct: selectedProduct?.modelo_da_peca,
    totalCartItems,
    vendorInfo: vendorInfo?.nome_completo,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="bg-[#7209B7] text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Botão voltar - só aparece quando não está no catálogo */}
          {currentView !== "catalog" && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo quando está no catálogo */}
          {currentView === "catalog" && <div className="text-xl font-bold text-[#FF5722]">Zents</div>}

          {/* Título central */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">
              {currentView === "catalog" && "Catálogo Digital"}
              {currentView === "product" && "Produto"}
              {currentView === "cart" && "Carrinho"}
            </h1>
            {vendorInfo && currentView === "catalog" && (
              <div className="mt-1">
                <p className="text-sm opacity-90">{vendorInfo.nome_completo}</p>
                {vendorInfo.nome_empresa && <p className="text-xs opacity-75">{vendorInfo.nome_empresa}</p>}
              </div>
            )}
          </div>

          {/* Ações do header */}
          <div className="flex items-center gap-2">
            {currentView === "product" && (
              <>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </>
            )}

            {currentView === "catalog" && (
              <button
                onClick={handleGoToCart}
                className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Ver carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* TELA CATÁLOGO */}
        {currentView === "catalog" && (
          <div className="p-4">
            {/* Search bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] text-sm"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Error notification */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#7209B7]/30 border-t-[#7209B7] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredProducts.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum produto encontrado</h3>
                <p className="text-gray-500">Este vendedor ainda não possui produtos cadastrados.</p>
              </div>
            )}

            {/* Products grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pb-20">
                {filteredProducts.map((product) => (
                  <div
                    key={product.codigo_da_peca}
                    className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white"
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho:</label>
                          <select
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

                      <p className="text-[#FF5722] font-semibold mb-3 mt-2">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.valor)}
                      </p>

                      <button
                        onClick={(e) => handleAddToCartFromCatalog(product, e)}
                        className="w-full py-2 bg-[#7209B7] text-white rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#7209B7]/90 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TELA PRODUTO */}
        {currentView === "product" && selectedProduct && (
          <div className="flex flex-col min-h-screen">
            {/* Product image */}
            <div className="w-full aspect-square bg-gray-100">
              <img
                src={
                  selectedProduct.foto_do_produto ||
                  `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(selectedProduct.modelo_da_peca) || "/placeholder.svg"}`
                }
                alt={selectedProduct.modelo_da_peca}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product details */}
            <div className="flex-1 p-4 space-y-4">
              <div>
                <h1 className="text-xl font-semibold">{selectedProduct.modelo_da_peca}</h1>
                <p className="text-sm text-gray-500 mb-1">Código: {selectedProduct.codigo_da_peca}</p>
                <p className="text-2xl font-bold text-[#FF5722] mt-1">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(selectedProduct.valor)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Detalhes do Produto</h3>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Cor:</span> {selectedProduct.cor}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Categoria:</span> {selectedProduct.category || "Geral"}
                </p>
              </div>

              {/* Size selection */}
              {selectedProduct.tamanhos_disponiveis && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tamanhos disponíveis:</h3>
                  <select
                    value={selectedSizes[selectedProduct.codigo_da_peca] || ""}
                    onChange={(e) =>
                      setSelectedSizes((prev) => ({
                        ...prev,
                        [selectedProduct.codigo_da_peca]: e.target.value,
                      }))
                    }
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] text-sm"
                  >
                    <option value="" disabled>
                      Selecione um tamanho
                    </option>
                    {splitSizes(selectedProduct.tamanhos_disponiveis).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity selector */}
              <div>
                <h3 className="text-sm font-medium mb-2">Quantidade</h3>
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{productQuantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => setProductQuantity(productQuantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
              <button
                onClick={handleAddToCartFromProduct}
                disabled={!selectedSizes[selectedProduct.codigo_da_peca] && !!selectedProduct.tamanhos_disponiveis}
                className={`w-full py-3 rounded-lg font-medium ${
                  !selectedProduct.tamanhos_disponiveis || selectedSizes[selectedProduct.codigo_da_peca]
                    ? "bg-[#7209B7] text-white hover:bg-[#7209B7]/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {!selectedProduct.tamanhos_disponiveis || selectedSizes[selectedProduct.codigo_da_peca]
                  ? "Adicionar ao Carrinho"
                  : "Selecione um tamanho"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSizes[selectedProduct.codigo_da_peca] && !!selectedProduct.tamanhos_disponiveis}
                className={`w-full py-3 rounded-lg font-medium ${
                  !selectedProduct.tamanhos_disponiveis || selectedSizes[selectedProduct.codigo_da_peca]
                    ? "bg-[#FF5722] text-white hover:bg-[#FF5722]/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {!selectedProduct.tamanhos_disponiveis || selectedSizes[selectedProduct.codigo_da_peca]
                  ? "Comprar Agora"
                  : "Selecione um tamanho"}
              </button>
            </div>
          </div>
        )}

        {/* TELA CARRINHO */}
        {currentView === "cart" && (
          <div className="flex flex-col min-h-screen">
            {/* Vendor info */}
            {vendorInfo && (
              <div className="bg-gradient-to-r from-[#F3E5F5] to-[#E8F5E8] border-b border-[#7209B7]/20 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#7209B7] flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{vendorInfo.nome_completo.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#7209B7]">{vendorInfo.nome_completo}</p>
                      {vendorInfo.nome_empresa && (
                        <p className="text-xs text-[#7209B7]/70">{vendorInfo.nome_empresa}</p>
                      )}
                      <p className="text-xs text-[#7209B7]/70 font-medium">ID: {vendorInfo.id_acesso}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-[#FF5722] bg-white px-2 py-1 rounded-full">
                      <span className="text-sm font-bold">{vendorInfo.telefone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty cart state */}
            {cartItems.length === 0 && (
              <div className="flex-1 flex flex-col justify-center items-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Carrinho vazio</h3>
                <p className="text-gray-500 text-center mb-4">Adicione produtos ao carrinho para finalizar o pedido</p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  className="px-6 py-2 bg-[#7209B7] text-white rounded-lg font-medium"
                >
                  Ver Produtos
                </button>
              </div>
            )}

            {/* Cart items */}
            {cartItems.length > 0 && (
              <>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.codigo_da_peca}-${item.selectedSize}-${index}`}
                      className="flex gap-3 border-b border-gray-200 pb-4"
                    >
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
                        {item.selectedSize && <p className="text-xs text-gray-500">Tamanho: {item.selectedSize}</p>}

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                updateCartQuantity(item.codigo_da_peca, item.selectedSize, item.quantity - 1)
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                updateCartQuantity(item.codigo_da_peca, item.selectedSize, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.codigo_da_peca, item.selectedSize)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order summary */}
                <div className="p-4 border-t border-gray-200 space-y-4 bg-white">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({totalCartItems} itens)</span>
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(calculateTotal())}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[#FF5722] text-lg">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOrder}
                    disabled={!vendorInfo?.telefone}
                    className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                      vendorInfo?.telefone
                        ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white hover:from-[#FF5722]/90 hover:to-[#FF7043]/90 shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag className="w-6 h-6" />
                    {vendorInfo?.telefone
                      ? `Enviar Pedido para ${vendorInfo.nome_completo}`
                      : "Carregando informações do vendedor..."}
                  </button>

                  {vendorInfo && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        📱 Pedido será enviado para: <span className="font-medium">{vendorInfo.telefone}</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
