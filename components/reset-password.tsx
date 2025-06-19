"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import MobileFrame from "./mobile-frame"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar se há tokens de recuperação na URL
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (accessToken && refreshToken) {
      // Definir a sessão com os tokens recebidos
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/access")
        }, 3000)
      }
    } catch (error) {
      console.error("Erro:", error)
      setError("Erro ao redefinir senha. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <MobileFrame
        title="Senha Redefinida"
        leftIcon={<ChevronLeft className="w-5 h-5 text-white" />}
        showFooter={false}
      >
        <div className="flex flex-col h-full justify-center items-center p-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Senha Redefinida!</h2>
          <p className="text-gray-600 text-center mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.
          </p>

          <button className="text-[#7209B7] hover:underline text-sm" onClick={() => router.push("/access")}>
            Ir para Login
          </button>
        </div>
      </MobileFrame>
    )
  }

  return (
    <MobileFrame title="Nova Senha" leftIcon={<ChevronLeft className="w-5 h-5 text-white" />} showFooter={false}>
      <div className="flex flex-col h-full justify-center items-center p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Redefinir Senha</h2>
          <p className="text-sm text-gray-600">Digite sua nova senha abaixo.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7]"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7]"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#FF5722] text-white font-medium rounded-md shadow-sm hover:bg-[#FF5722]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5722] disabled:opacity-50"
          >
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
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
