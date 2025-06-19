"use client"

import { CheckCircle } from "lucide-react"
import MobileFrame from "../mobile-frame"

interface Step4Props {
  onFinish: () => void
}

export default function Success({ onFinish }: Step4Props) {
  return (
    <MobileFrame title="Sucesso" showFooter={false}>
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Senha Redefinida!</h2>
          <p className="text-sm text-gray-600">
            Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
        </div>

        <button
          onClick={onFinish}
          className="w-full py-3 bg-[#FF5722] text-white rounded-md font-medium text-lg hover:bg-[#FF5722]/90 transition-colors"
        >
          Ir para Login
        </button>
      </div>
    </MobileFrame>
  )
}
