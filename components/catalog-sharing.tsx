import { ChevronLeft, X } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function CatalogSharing() {
  return (
    <MobileFrame title="Meu Catálogo" leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}>
      <div className="p-4">
        {/* Products grid (blurred in background) */}
        <div className="grid grid-cols-2 gap-3 opacity-20">
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

        {/* Sharing modal */}
        <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Compartilhar catálogo</h3>
            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600">Compartilhe seu catálogo com seus clientes através de:</p>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.865 4.002c-.293.566.35 1.148.935.859.775-.383 1.7-.661 2.711-.661 1.843 0 3.526.65 4.713 1.723L11.997 12l-1.597 2.077c-1.188 1.073-2.87 1.723-4.713 1.723-1.01 0-1.936-.278-2.711-.661-.585-.29-1.228.293-.935.86A7.94 7.94 0 0 0 12 20a7.85 7.85 0 0 0 5.6-2.32l3.997-5.18-3.996-5.18h-.001Z" />
                </svg>
              </div>
              <span className="text-xs">WhatsApp</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#E1306C] flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </div>
              <span className="text-xs">Instagram</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#7209B7] flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <span className="text-xs">Link</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m12 16 4-4-4-4" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <span className="text-xs">Mais</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="relative">
              <input
                type="text"
                value="https://zents.app/loja/maria"
                readOnly
                className="block w-full pr-20 rounded-md border-gray-300 shadow-sm focus:border-[#7209B7] focus:ring-[#7209B7] text-sm"
              />
              <button className="absolute right-1 top-1 px-3 py-1 bg-[#7209B7] text-white rounded text-xs">
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
