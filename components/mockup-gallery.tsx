import { ChevronLeft, Search, Filter } from "lucide-react"
import MobileFrame from "./mobile-frame"

export default function MockupGallery() {
  // Categorias de mockups
  const categories = [
    { id: "camisetas", name: "Camisetas" },
    { id: "vestidos", name: "Vestidos" },
    { id: "calcas", name: "Calças" },
    { id: "blusas", name: "Blusas" },
    { id: "casacos", name: "Casacos" },
  ]

  // Mockups para demonstração
  const mockups = [
    { id: 1, category: "camisetas", name: "Camiseta Básica" },
    { id: 2, category: "camisetas", name: "Camiseta Gola V" },
    { id: 3, category: "camisetas", name: "Camiseta Manga Longa" },
    { id: 4, category: "vestidos", name: "Vestido Casual" },
    { id: 5, category: "vestidos", name: "Vestido Longo" },
    { id: 6, category: "calcas", name: "Calça Jeans" },
    { id: 7, category: "blusas", name: "Blusa Cropped" },
    { id: 8, category: "casacos", name: "Jaqueta Jeans" },
  ]

  return (
    <MobileFrame
      title="Galeria de Mockups"
      leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}
      rightIcon={<Filter className="w-5 h-5 text-white" />}
      showFooter={false}
    >
      <div className="p-4 space-y-4">
        {/* Barra de pesquisa */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] text-sm"
            placeholder="Buscar mockups..."
          />
        </div>

        {/* Categorias */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-4 py-2 mr-2 rounded-full bg-[#7209B7] text-white text-sm whitespace-nowrap">
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 mr-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grade de mockups */}
        <div className="grid grid-cols-2 gap-3">
          {mockups.map((mockup) => (
            <div key={mockup.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-[3/4] bg-gray-100 relative">
                <img
                  src={`/placeholder.svg?height=240&width=180&text=Mockup ${mockup.id}`}
                  alt={mockup.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h4 className="text-sm font-medium truncate">{mockup.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{mockup.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileFrame>
  )
}
