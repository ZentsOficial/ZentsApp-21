"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import MobileFrame from "../mobile-frame"

interface Step3Props {
  idAcesso: string
  onPasswordReset: () => void
  onBack: () => void
}

export default function NewPassword({ idAcesso, onPasswordReset, onBack }: Step3Props) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idAcesso,
          newPassword: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Senha redefinida com sucesso
        onPasswordReset()
      } else {
        setError(data.message || "Erro ao redefinir senha")
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error)
      setError("Erro ao redefinir senha. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MobileFrame
      title="Nova Senha"
      leftIcon={<ArrowLeft className="w-5 h-5 text-white" />}
      showFooter={false}
      onLeftIconClick={onBack}
    >
      <div className="flex flex-col h-full p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Crie uma Nova Senha</h2>
          <p className="text-sm text-gray-600">Sua senha deve ter pelo menos 6 caracteres</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7209B7] focus:border-transparent"
                placeholder="Digite sua nova senha"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7209B7] focus:border-transparent"
                placeholder="Confirme sua nova senha"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full py-3 bg-[#FF5722] text-white rounded-md font-medium text-lg hover:bg-[#FF5722]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </MobileFrame>
  )
}
