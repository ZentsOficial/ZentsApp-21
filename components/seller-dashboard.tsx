import { Settings, Plus } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function SellerDashboard() {
  return (
    <MobileFrame rightIcon={<Settings className="w-5 h-5 text-white" />}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Olá, Maria!</h2>

        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#F3E5F5] p-3 rounded-lg">
            <h3 className="text-sm font-medium text-[#7209B7] mb-1">Vendas hoje</h3>
            <p className="text-xl font-bold text-[#7209B7]">R$ 350,00</p>
            <p className="text-xs text-[#7209B7]/70">+15% que ontem</p>
          </div>
          <div className="bg-[#FBE9E7] p-3 rounded-lg">
            <h3 className="text-sm font-medium text-[#FF5722] mb-1">Novos pedidos</h3>
            <p className="text-xl font-bold text-[#FF5722]">3</p>
            <p className="text-xs text-[#FF5722]/70">Aguardando confirmação</p>
          </div>
        </div>

        {/* Recent sales chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6">
          <h3 className="text-sm font-medium mb-3">Vendas recentes</h3>
          <div className="h-32 flex items-end gap-1">
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[40%]"></div>
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[30%]"></div>
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[60%]"></div>
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[45%]"></div>
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[70%]"></div>
            <div className="flex-1 bg-[#7209B7]/20 rounded-t-sm h-[90%]"></div>
            <div className="flex-1 bg-[#7209B7]/80 rounded-t-sm h-[65%]"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>
        </div>

        {/* Recent products */}
        <h3 className="text-sm font-medium mb-3">Produtos recentes</h3>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={`/placeholder.svg?height=150&width=150&text=Produto ${item}`}
                  alt={`Produto ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h4 className="text-sm font-medium truncate">Camiseta Modelo {item}</h4>
                <p className="text-[#FF5722] font-semibold">R$ {59 + item * 10},00</p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating action button */}
        <button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </MobileFrame>
  )
}
