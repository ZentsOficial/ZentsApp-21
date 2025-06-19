"use client"

import type React from "react"

import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import MobileFrame from "./mobile-frame"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
      } else {
        setError(data.message || "Erro ao enviar email de recuperação")
      }
    } catch (error) {
      console.error("Erro:", error)
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      console.error("Erro ao reenviar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <MobileFrame title="Recuperar Senha" leftIcon={<ChevronLeft className="w-5 h-5 text-white" />} showFooter={false}>
        <div className="flex flex-col h-full justify-center items-center p-6">
          <div className="w-16 h-16 rounded-full bg-[#7209B7]/10 flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-[#7209B7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Email Enviado!</h2>
          <p className="text-gray-600 text-center mb-6">
            Se o email <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
            Verifique sua caixa de entrada e spam.
          </p>

          <button
            onClick={handleResend}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#FF5722] text-white font-medium rounded-md shadow-sm hover:bg-[#FF5722]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5722] mb-4 disabled:opacity-50"
          >
            {isLoading ? "Reenviando..." : "Reenviar Email"}
          </button>

          <button className="text-[#7209B7] hover:underline text-sm" onClick={() => router.push("/access")}>
            Voltar ao Login
          </button>
        </div>
      </MobileFrame>
    )
  }

  return (
    <MobileFrame title="Recuperar Senha" leftIcon={<ChevronLeft className="w-5 h-5 text-white" />} showFooter={false}>
      <div className="flex flex-col h-full justify-center items-center p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Esqueceu sua senha?</h2>
          <p className="text-sm text-gray-600">Digite seu email e enviaremos um link para redefinir sua senha.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7]"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#FF5722] text-white font-medium rounded-md shadow-sm hover:bg-[#FF5722]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5722] disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button className="text-[#7209B7] hover:underline text-sm" onClick={() => router.push("/access")}>
            Voltar ao Login
          </button>
        </div>
      </div>
    </MobileFrame>
  )
}
