"use client"

import { useState } from "react"
import { ChevronLeft, Share2, RotateCcw, Download, Check } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function MockupPreview() {
  const [currentView, setCurrentView] = useState("frente")
  const [selectedColor, setSelectedColor] = useState("#FFFFFF")

  const viewOptions = [
    { id: "frente", label: "Frente" },
    { id: "costas", label: "Costas" },
    { id: "lado", label: "Lado" },
  ]

  const colorOptions = [
    { id: "white", color: "#FFFFFF", label: "Branco" },
    { id: "black", color: "#000000", label: "Preto" },
    { id: "red", color: "#FF0000", label: "Vermelho" },
    { id: "blue", color: "#0000FF", label: "Azul" },
    { id: "green", color: "#00FF00", label: "Verde" },
    { id: "yellow", color: "#FFFF00", label: "Amarelo" },
  ]

  return (
    <MobileFrame
      title="Visualizar Mockup"
      leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}
      rightIcon={<Share2 className="w-5 h-5 text-white" />}
      showFooter={false}
    >
      <div className="flex flex-col h-full">
        {/* Visualização do mockup */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-xs">
            <img
              src="/placeholder.svg?height=400&width=300&text=Modelo com Produto"
              alt="Mockup Preview"
              className="w-full h-auto"
            />

            {/* Overlay da peça de roupa (simulação) */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url('/placeholder.svg?height=100&width=100&text=Estampa')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 100px",
                backgroundSize: "150px 150px",
                mixBlendMode: "multiply",
              }}
            ></div>
          </div>
        </div>

        {/* Controles */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Opções de visualização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visualização</label>
            <div className="flex space-x-2">
              {viewOptions.map((option) => (
                <button
                  key={option.id}
                  className={`px-4 py-2 rounded-md text-sm ${
                    currentView === option.id ? "bg-[#7209B7] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setCurrentView(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opções de cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor da Peça</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedColor === option.color ? "ring-2 ring-[#FF5722] ring-offset-2" : ""
                  }`}
                  style={{
                    backgroundColor: option.color,
                    border: option.color === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
                  }}
                  onClick={() => setSelectedColor(option.color)}
                  title={option.label}
                >
                  {selectedColor === option.color && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex space-x-2">
            <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </button>
            <button className="flex-1 py-2 px-4 bg-[#7209B7] text-white rounded-md flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Salvar
            </button>
            <button className="flex-1 py-2 px-4 bg-[#FF5722] text-white rounded-md">Usar</button>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
