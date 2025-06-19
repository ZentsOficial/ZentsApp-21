"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import MobileFrame from "../mobile-frame"

interface Step2Props {
  method: "email" | "sms"
  idAcesso: string
  onCodeVerified: () => void
  onBack: () => void
}

export default function VerificationCode({ method, idAcesso, onCodeVerified, onBack }: Step2Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [maskedIdentifier, setMaskedIdentifier] = useState("")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Buscar informações do usuário para mostrar email/telefone mascarado
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/user/${idAcesso}`)
        if (response.ok) {
          const userData = await response.json()

          if (method === "email" && userData.email) {
            // Mascarar email: j***@example.com
            const parts = userData.email.split("@")
            if (parts.length === 2) {
              const username = parts[0]
              const domain = parts[1]
              const maskedUsername = username.charAt(0) + "***"
              setMaskedIdentifier(`${maskedUsername}@${domain}`)
            }
          } else if (method === "sms" && userData.telefone) {
            // Mascarar telefone: (11) ****-5678
            const phone = userData.telefone
            if (phone.length >= 8) {
              const lastFour = phone.slice(-4)
              setMaskedIdentifier(`***-***-${lastFour}`)
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error)
      }
    }

    fetchUserInfo()

    // Enviar código de verificação
    sendVerificationCode()

    // Iniciar contador regressivo
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [idAcesso, method])

  const sendVerificationCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("📤 Enviando código de verificação...")

      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idAcesso,
          method,
        }),
      })

      console.log("📥 Resposta recebida:", response.status, response.statusText)

      // Verificar se a resposta é JSON válida
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Resposta não é JSON:", textResponse)
        setError("Erro no servidor. Tente novamente.")
        return
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Erro ao enviar código de verificação")
      } else {
        // Código enviado com sucesso
        console.log("✅ Código enviado com sucesso")
      }
    } catch (error) {
      console.error("❌ Erro ao enviar código:", error)
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    if (!canResend) return

    setCountdown(60)
    setCanResend(false)
    setCode(["", "", "", "", "", ""])
    sendVerificationCode()

    // Reiniciar contador
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleInputChange = (index: number, value: string) => {
    // Permitir apenas números
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Avançar para o próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Verificar se o código está completo
    if (newCode.every((digit) => digit) && newCode.join("").length === 6) {
      verifyCode(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Voltar para o input anterior ao pressionar backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const verifyCode = async (verificationCode: string) => {
    setIsLoading(true)
    setError("")

    try {
      console.log("🔍 Verificando código...")

      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idAcesso,
          code: verificationCode,
        }),
      })

      console.log("📥 Resposta da verificação:", response.status, response.statusText)

      // Verificar se a resposta é JSON válida
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Resposta não é JSON:", textResponse)
        setError("Erro no servidor. Tente novamente.")
        return
      }

      const data = await response.json()

      if (response.ok && data.success) {
        console.log("✅ Código verificado com sucesso")
        onCodeVerified()
      } else {
        setError(data.message || "Código inválido. Tente novamente.")
      }
    } catch (error) {
      console.error("❌ Erro ao verificar código:", error)
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join("")

    if (verificationCode.length !== 6) {
      setError("Digite o código completo de 6 dígitos")
      return
    }

    verifyCode(verificationCode)
  }

  return (
    <MobileFrame
      title="Verificação"
      leftIcon={<ArrowLeft className="w-5 h-5 text-white" />}
      showFooter={false}
      onLeftIconClick={onBack}
    >
      <div className="flex flex-col h-full p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Digite o Código</h2>
          <p className="text-sm text-gray-600">
            {method === "email"
              ? `Enviamos um código de verificação para ${maskedIdentifier || "seu email"}`
              : `Enviamos um código por SMS para ${maskedIdentifier || "seu telefone"}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {canResend ? "Não recebeu o código?" : `Reenviar código em ${countdown}s`}
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="text-[#7209B7] font-medium text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              Reenviar código
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full py-3 bg-[#FF5722] text-white rounded-md font-medium text-lg hover:bg-[#FF5722]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      </div>
    </MobileFrame>
  )
}
