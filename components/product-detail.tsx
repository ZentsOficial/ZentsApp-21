"use client"

import { ChevronLeft, Plus, Minus } from "lucide-react"
import MobileFrame from "./mobile-frame"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/supabase"

interface ProductDetailProps {
  product?: Product | null
  onBack?: () => void
}

export default function ProductDetail({ product: propProduct, onBack }: ProductDetailProps) {
  // Função auxiliar para limpar caracteres especiais das mensagens
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

  const [product, setProduct] = useState<Product | null>(propProduct || null)
  const [loading, setLoading] = useState(!propProduct)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [vendorPhone, setVendorPhone] = useState<string>("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
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

    // Se já temos um produto via props, não precisamos buscar
    if (propProduct) {
      setProduct(propProduct)
      setLoading(false)
      // Selecionar o primeiro tamanho por padrão
      if (propProduct.tamanhos_disponiveis) {
        const sizes = splitSizes(propProduct.tamanhos_disponiveis)
        if (sizes.length > 0) {
          setSelectedSize(sizes[0])
        }
      }
      return
    }

    // Caso contrário, buscar produto do banco (comportamento original)
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)

        console.log("Buscando produtos...")

        const response = await fetch("/api/products")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          const foundProduct = data[0] // Pegar o primeiro produto
          setProduct(foundProduct)

          if (foundProduct.tamanhos_disponiveis) {
            const sizes = splitSizes(foundProduct.tamanhos_disponiveis)
            if (sizes.length > 0) {
              setSelectedSize(sizes[0])
            }
          }
          console.log(`Produto carregado: ${foundProduct.modelo_da_peca}`)
        } else {
          setError("Nenhum produto disponível no catálogo")
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err)
        setError("Erro ao carregar produto.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [propProduct])

  useEffect(() => {
    // Verificar se existe telefone do vendedor no localStorage
    const storedPhone = localStorage.getItem("vendorPhone")
    if (storedPhone) {
      setVendorPhone(storedPhone)
    } else if (product?.telefone_vendedor) {
      setVendorPhone(product.telefone_vendedor)
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return

    // Verificar se precisa de tamanho selecionado
    const availableSizes = product.tamanhos_disponiveis ? splitSizes(product.tamanhos_disponiveis) : []
    if (availableSizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.")
      return
    }

    // Verificar se já existe carrinho no localStorage
    let currentCart = []
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart)
      } catch (e) {
        console.error("Erro ao carregar carrinho do localStorage:", e)
      }
    }

    // Verificar se o produto já está no carrinho com o mesmo tamanho
    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.codigo_da_peca === product.codigo_da_peca && item.selectedSize === selectedSize,
    )

    if (existingItemIndex >= 0) {
      // Se já existe com o mesmo tamanho, aumentar a quantidade
      currentCart[existingItemIndex].quantity += quantity
    } else {
      // Se não existe ou tem tamanho diferente, adicionar como novo item
      currentCart.push({
        ...product,
        quantity,
        selectedSize,
      })
    }

    // Salvar no localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart))

    // Atualizar contador do carrinho
    const newCartCount = currentCart.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(newCartCount)

    console.log("Produto adicionado ao carrinho:", {
      produto: product.modelo_da_peca,
      tamanho: selectedSize,
      quantidade: quantity,
    })

    alert(`${product.modelo_da_peca} ${selectedSize ? `(${selectedSize})` : ""} adicionado ao carrinho!`)
  }

  const handleBuyNow = () => {
    if (!product || !vendorPhone) return

    // Verificar se precisa de tamanho selecionado
    const availableSizes = product.tamanhos_disponiveis ? splitSizes(product.tamanhos_disponiveis) : []
    if (availableSizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho antes de comprar.")
      return
    }

    const message = cleanMessage(
      `Ola! Gostaria de comprar:

Produto: ${product.modelo_da_peca}
Codigo: ${product.codigo_da_peca}
Cor: ${product.cor}
Tamanho: ${selectedSize || "Nao especificado"}
Quantidade: ${quantity}
Valor: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(product.valor * quantity)}

Obrigado!`,
    )

    const whatsappUrl = `https://wa.me/${vendorPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <MobileFrame
        title="Zents Catálogo"
        leftIcon={<ChevronLeft className="w-5 h-5 text-white" onClick={onBack} />}
        showFooter={false}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <div className="w-12 h-12 border-4 border-[#7209B7]/30 border-t-[#7209B7] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Carregando produto...</p>
        </div>
      </MobileFrame>
    )
  }

  if (!product) {
    return (
      <MobileFrame
        title="Zents Catálogo"
        leftIcon={<ChevronLeft className="w-5 h-5 text-white" onClick={onBack} />}
        showFooter={false}
      >
        <div className="flex flex-col h-full justify-center items-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Produto não encontrado</h3>
          <p className="text-gray-500 text-center mb-4">{error || "Não foi possível carregar o produto"}</p>
          <button className="text-[#7209B7]" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </MobileFrame>
    )
  }

  const availableSizes = product.tamanhos_disponiveis ? splitSizes(product.tamanhos_disponiveis) : []

  return (
    <MobileFrame
      title="Zents Catálogo"
      leftIcon={<ChevronLeft className="w-5 h-5 text-white" onClick={onBack} />}
      showFooter={false}
    >
      <div className="flex flex-col h-full">
        {/* Product image */}
        <div className="w-full aspect-square bg-gray-100">
          <img
            src={
              product.foto_do_produto ||
              `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(product.modelo_da_peca) || "/placeholder.svg"}`
            }
            alt={product.modelo_da_peca}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product details */}
        <div className="flex-1 p-4 space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{product.modelo_da_peca}</h1>
            <p className="text-sm text-gray-500 mb-1">Código: {product.codigo_da_peca}</p>
            <p className="text-2xl font-bold text-[#FF5722] mt-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.valor)}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Detalhes do Produto</h3>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Cor:</span> {product.cor}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Categoria:</span> {product.category || "Geral"}
            </p>
          </div>

          {/* Size selection section */}
          {availableSizes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tamanhos disponíveis:</h3>
              <div className="relative">
                <select
                  value={selectedSize || ""}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] text-sm"
                >
                  <option value="" disabled>
                    Selecione um tamanho
                  </option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div>
            <h3 className="text-sm font-medium mb-2">Quantidade</h3>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons - hidden for vendor */}
        <div className="p-4 border-t border-gray-200 space-y-3 hidden">
          <button
            onClick={handleAddToCart}
            disabled={availableSizes.length > 0 && !selectedSize}
            className={`w-full py-3 rounded-lg font-medium ${
              availableSizes.length === 0 || selectedSize
                ? "bg-[#7209B7] text-white hover:bg-[#7209B7]/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {availableSizes.length === 0 || selectedSize ? "Adicionar ao Carrinho" : "Selecione um tamanho"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={availableSizes.length > 0 && !selectedSize}
            className={`w-full py-3 rounded-lg font-medium ${
              availableSizes.length === 0 || selectedSize
                ? "bg-[#FF5722] text-white hover:bg-[#FF5722]/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {availableSizes.length === 0 || selectedSize ? "Comprar Agora" : "Selecione um tamanho"}
          </button>
        </div>
      </div>
    </MobileFrame>
  )
}
