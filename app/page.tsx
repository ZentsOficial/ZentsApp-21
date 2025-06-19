"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerCatalog from "@/components/customer-catalog"
import ProductDetail from "@/components/product-detail"
import ShoppingCart from "@/components/shopping-cart"
import Access from "@/components/access"
import ForgotPassword from "@/components/forgot-password"
import SellerCatalog from "@/components/seller-catalog"
import type { Product } from "@/lib/supabase"

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeCustomerTab, setActiveCustomerTab] = useState("catalog")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("access")
  const [userData, setUserData] = useState<any>(null)

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserData(user)
        setIsLoggedIn(true)
        setActiveTab("customer-view") // Redirecionar para a aba cliente
      } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e)
      }
    }
  }, [])

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setActiveCustomerTab("product")
  }

  const handleBackToCatalog = () => {
    setSelectedProduct(null)
    setActiveCustomerTab("catalog")
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    localStorage.removeItem("vendorPhone")
    setIsLoggedIn(false)
    setUserData(null)
    setActiveTab("access")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      {/* Título oculto */}
      <h1 className="sr-only">Zents App Visual Concept</h1>

      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Abas ocultas */}
          <TabsList className="sr-only">
            <TabsTrigger value="access">Acesso</TabsTrigger>
            <TabsTrigger value="forgot-password">Recuperar</TabsTrigger>
            <TabsTrigger value="customer-view">Cliente</TabsTrigger>
            <TabsTrigger value="cart">Carrinho</TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <TabsContent value="access">
              <Access />
            </TabsContent>

            <TabsContent value="forgot-password">
              <ForgotPassword />
            </TabsContent>

            <TabsContent value="customer-view">
              <Tabs value={activeCustomerTab} onValueChange={setActiveCustomerTab}>
                {/* Sub-abas ocultas */}
                <TabsList className="sr-only">
                  <TabsTrigger value="catalog" className="flex-1">
                    Catalog
                  </TabsTrigger>
                  <TabsTrigger value="product" className="flex-1">
                    Product
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="catalog">
                  <CustomerCatalog onProductSelect={handleProductSelect} />
                </TabsContent>
                <TabsContent value="product">
                  <ProductDetail product={selectedProduct} onBack={handleBackToCatalog} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="cart">
              <Tabs defaultValue="cart">
                {/* Sub-abas ocultas */}
                <TabsList className="sr-only">
                  <TabsTrigger value="cart" className="flex-1">
                    Carrinho
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cart">
                  <ShoppingCart />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="seller-dashboard">
              <Tabs defaultValue="catalog">
                {/* Sub-abas ocultas */}
                <TabsList className="sr-only">
                  <TabsTrigger value="catalog" className="flex-1">
                    Catálogo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="catalog">
                  <SellerCatalog />
                </TabsContent>
              </Tabs>

              {isLoggedIn && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{userData?.nome_completo}</p>
                      <p className="text-xs text-gray-500">ID: {userData?.id_acesso}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
