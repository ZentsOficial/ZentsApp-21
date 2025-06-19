"use client"

import { useState } from "react"
import { ChevronLeft, Check } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function MockupSelection() {
  const [selectedCategory, setSelectedCategory] = useState("feminino")
  const [selectedModel, setSelectedModel] = useState(1)

  const categories = [
    { id: "feminino", name: "Feminino" },
    { id: "masculino", name: "Masculino" },
    { id: "plus-size", name: "Plus Size" },
    { id: "infantil", name: "Infantil" },
  ]

  // Mockup de modelos para cada categoria
  const models = {
    feminino: [1, 2, 3, 4, 5, 6],
    masculino: [7, 8, 9, 10],
    "plus-size": [11, 12, 13, 14],
    infantil: [15, 16, 17, 18],
  }

  return (
    <MobileFrame title="Selecionar Modelo" leftIcon={<ChevronLeft className="w-5 h-5 text-white" />} showFooter={false}>
      <div className="p-4 space-y-4">
        {/* Categorias de modelos */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category.id ? "bg-[#7209B7] text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grade de modelos */}
        <div className="grid grid-cols-2 gap-3">
          {models[selectedCategory as keyof typeof models].map((modelId) => (
            <div
              key={modelId}
              className={`relative rounded-lg overflow-hidden border-2 ${
                selectedModel === modelId ? "border-[#FF5722]" : "border-transparent"
              }`}
              onClick={() => setSelectedModel(modelId)}
            >
              <img
                src={`/placeholder.svg?height=240&width=160&text=Modelo ${modelId}`}
                alt={`Modelo ${modelId}`}
                className="w-full aspect-[3/4] object-cover"
              />
              {selectedModel === modelId && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão de aplicar */}
        <div className="pt-4">
          <button className="w-full py-3 bg-[#FF5722] text-white rounded-lg font-medium">Aplicar Modelo</button>
        </div>
      </div>
    </MobileFrame>
  )
}
