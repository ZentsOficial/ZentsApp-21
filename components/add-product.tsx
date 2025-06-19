"use client"

import { useState } from "react"
import { Camera, Plus, Mic, Shirt } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function AddProduct() {
  const [useMockup, setUseMockup] = useState(true)

  return (
    <MobileFrame title="Adicionar Produto">
      <div className="p-4">
        <form className="space-y-6">
          {/* Photos section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fotos</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="aspect-square bg-[#F3E5F5] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#7209B7]/30">
                <Camera className="w-6 h-6 text-[#7209B7] mb-1" />
                <span className="text-xs text-[#7209B7]">Adicionar</span>
              </button>
              {[1, 2].map((item) => (
                <div key={item} className="aspect-square bg-gray-100 rounded-lg relative">
                  <img
                    src={`/placeholder.svg?height=100&width=100&text=Foto ${item}`}
                    alt={`Foto ${item}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-red-500 flex items-center justify-center shadow-sm">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                Nome do Produto
                <button className="text-[#FF5722]">
                  <Mic className="w-4 h-4" />
                </button>
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7209B7] focus:ring-[#7209B7] text-sm"
                placeholder="Ex: Camiseta Estampada Preta"
                defaultValue="Camiseta Estampada Preta"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7209B7] focus:ring-[#7209B7] text-sm"
                rows={3}
                placeholder="Descreva seu produto..."
                defaultValue="Camiseta 100% algodão com estampa exclusiva. Disponível em vários tamanhos."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                Preço
                <button className="text-[#FF5722]">
                  <Mic className="w-4 h-4" />
                </button>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 rounded-md border-gray-300 focus:border-[#7209B7] focus:ring-[#7209B7] text-sm"
                  placeholder="0.00"
                  defaultValue="79.90"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tamanhos</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {["P", "M", "G", "GG"].map((size) => (
                  <label key={size} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#7209B7] focus:ring-[#7209B7]"
                      defaultChecked={size === "M" || size === "G"}
                    />
                    <span className="ml-1 text-sm">{size}</span>
                  </label>
                ))}
                <button className="text-[#FF5722] text-sm flex items-center">
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de Produto</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7209B7] focus:ring-[#7209B7] text-sm">
                <option>Camiseta</option>
                <option>Vestido</option>
                <option>Calça</option>
                <option>Acessório</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Referência</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7209B7] focus:ring-[#7209B7] text-sm"
                placeholder="Ex: CAM-001"
                defaultValue="CAM-001"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Usar Mockup de Modelo</label>
              <button
                className={`w-10 h-5 relative rounded-full ${
                  useMockup ? "bg-[#FF5722]" : "bg-gray-300"
                } flex items-center transition-colors`}
                onClick={() => setUseMockup(!useMockup)}
                type="button"
              >
                <span
                  className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    useMockup ? "right-0.5" : "left-0.5"
                  }`}
                ></span>
              </button>
            </div>

            {useMockup && (
              <div className="bg-[#F3E5F5] p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#7209B7]">Mockup Selecionado</h3>
                  <button type="button" className="text-xs text-[#FF5722] font-medium hover:underline">
                    Alterar
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src="/placeholder.svg?height=80&width=64&text=Modelo"
                      alt="Modelo selecionado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Modelo Feminino</p>
                    <p className="text-xs text-gray-600">Camiseta Básica</p>
                    <button
                      type="button"
                      className="mt-1 text-xs bg-[#7209B7] text-white px-2 py-1 rounded flex items-center"
                    >
                      <Shirt className="w-3 h-3 mr-1" />
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <button className="w-full py-3 bg-[#FF5722] text-white rounded-lg font-medium">Salvar Produto</button>
        </form>
      </div>
    </MobileFrame>
  )
}
