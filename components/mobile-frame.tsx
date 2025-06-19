"use client"

import type { ReactNode } from "react"
import { LogOut } from "lucide-react"

interface MobileFrameProps {
  children: ReactNode
  showHeader?: boolean
  title?: string
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  showFooter?: boolean
  onCatalogClick?: () => void
  onLogoutClick?: () => void
  activeFooterTab?: "catalog" | "logout"
  onBackClick?: () => void // Nova prop para lidar com o clique no botão voltar
}

export default function MobileFrame({
  children,
  showHeader = true,
  title = "",
  rightIcon,
  leftIcon,
  showFooter = true,
  onCatalogClick,
  onLogoutClick,
  activeFooterTab = "catalog",
  onBackClick, // Nova prop
}: MobileFrameProps) {
  const handleCatalogClick = () => {
    if (onCatalogClick) {
      onCatalogClick()
    } else {
      // Função padrão - navegar para catálogo
      console.log("Navegando para catálogo...")
      if (typeof window !== "undefined") {
        // Tentar encontrar e clicar na aba do cliente
        const catalogTab = document.querySelector('[value="customer-view"]') as HTMLElement
        if (catalogTab) {
          catalogTab.click()
        } else {
          // Fallback: disparar evento customizado
          window.dispatchEvent(new CustomEvent("navigate-to-catalog"))
        }
      }
    }
  }

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick()
    } else {
      // Função padrão - fazer logout
      console.log("Fazendo logout...")
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario")
        localStorage.removeItem("vendorPhone")
        window.dispatchEvent(new CustomEvent("user-logout"))
        // Recarregar página para voltar ao estado inicial
        window.location.reload()
      }
    }
  }

  return (
    <div className="w-full max-w-[375px] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border-8 border-gray-800">
      {/* Status bar */}
      <div className="bg-gray-800 text-white text-xs flex justify-between items-center px-4 py-1">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* App content */}
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        {showHeader && (
          <div className="bg-[#7209B7] text-white p-4 flex justify-between items-center">
            {leftIcon ? (
              <div onClick={onBackClick} className={onBackClick ? "cursor-pointer" : ""}>
                {leftIcon}
              </div>
            ) : (
              <div className="text-xl font-semibold text-[#FF5722]">Zents</div>
            )}
            <div className="text-center flex-1 font-semibold">{title}</div>
            {rightIcon || <div className="w-6 h-6"></div>}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-white">{children}</div>

        {/* Footer navigation */}
        {showFooter && (
          <div className="bg-white border-t border-gray-200 p-2 flex justify-around">
            <button
              onClick={handleLogoutClick}
              className={`flex flex-col items-center ${activeFooterTab === "logout" ? "text-[#7209B7]" : "text-gray-500"} hover:text-[#7209B7] transition-colors`}
            >
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-xs">Sair</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
