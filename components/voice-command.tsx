import { Mic } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function VoiceCommand() {
  return (
    <MobileFrame title="Adicionar Produto">
      <div className="p-4">
        <form className="space-y-6">
          {/* Voice command active indicator */}
          <div className="bg-[#F3E5F5] p-4 rounded-lg flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#7209B7] flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#7209B7]">Comando de voz ativo</h3>
              <p className="text-xs text-[#7209B7]/70">Fale o nome, preço e detalhes do produto</p>
            </div>

            {/* Voice waves animation */}
            <div className="flex items-center gap-1 h-8">
              <div className="w-1 h-3 bg-[#FF5722] rounded-full animate-pulse"></div>
              <div className="w-1 h-5 bg-[#FF5722] rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1 h-7 bg-[#FF5722] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1 h-4 bg-[#FF5722] rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
              <div className="w-1 h-2 bg-[#FF5722] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>

          {/* Product details being filled by voice */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm bg-white">
                <span>Vestido azul com estampa floral</span>
                <span className="inline-block w-1 h-4 bg-[#FF5722] ml-1 animate-pulse"></span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm bg-white min-h-[70px]">
                <span>
                  Vestido leve de tecido 100% algodão, perfeito para o verão. Estampa exclusiva floral em tons de azul.
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Preço</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <div className="block w-full pl-10 pr-12 py-2 rounded-md border border-gray-300 text-sm">
                  <span>129.90</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tamanhos</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {["P", "M", "G"].map((size) => (
                  <label key={size} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#7209B7] focus:ring-[#7209B7]"
                      defaultChecked
                    />
                    <span className="ml-1 text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de Produto</label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm bg-white">
                Vestido
              </div>
            </div>
          </div>

          {/* Photos section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fotos</label>
            <div className="p-4 border-2 border-dashed border-[#7209B7]/30 rounded-lg text-center">
              <p className="text-sm text-gray-500">Diga "adicionar foto de vestido azul" para adicionar uma foto</p>
            </div>
          </div>

          {/* Save button */}
          <button className="w-full py-3 bg-[#FF5722] text-white rounded-lg font-medium">Salvar Produto</button>
        </form>
      </div>
    </MobileFrame>
  )
}
