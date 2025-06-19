"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, MessageSquare } from "lucide-react"
import MobileFrame from "../mobile-frame"

interface Step1Props {
  onMethodSelected: (method: "email" | "sms", idAcesso: string) => void
  onBack: () => void
}

export default function MethodSelection({ onMethodSelected, onBack }: Step1Props) {
  const [idAcesso, setIdAcesso] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userInfo, setUserInfo] = useState<{
    id: number
    nome_completo: string
    email?: string
    telefone?: string
  } | null>(null)

  const handleIdAcessoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdAcesso(e.target.value)
    setError("")
    setSuccess("")
    setUserInfo(null)
  }

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idAcesso) {
      setError("Digite seu ID de acesso")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/user/${idAcesso}`)

      if (response.ok) {
        const userData = await response.json()
        setUserInfo(userData)

        // Se o usuário não tiver email nem telefone
        if (!userData.email && !userData.telefone) {
          setError("Não foi possível encontrar um método de contato para recuperação de senha")
        }
      } else {
        setError("Usuário não encontrado")
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error)
      setError("Erro ao verificar usuário. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMethod = async (method: "email" | "sms") => {
    if ((method === "email" && !userInfo?.email) || (method === "sms" && !userInfo?.telefone)) {
      setError(`Você não possui ${method === "email" ? "email" : "telefone"} cadastrado`)
      return
    }

    if (method === "email") {
      // Para email, usar o novo endpoint que envia via Supabase Auth
      setIsLoading(true)
      setError("")
      setSuccess("")

      try {
        const response = await fetch("/api/auth/send-reset-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idAcesso: idAcesso,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Erro na resposta:", response.status, errorText)

          try {
            // Tentar fazer parse do erro como JSON
            const errorData = JSON.parse(errorText)
            setError(errorData.message || "Erro ao enviar email de recuperação")
          } catch (e) {
            // Se não for JSON, mostrar mensagem genérica
            setError("Erro ao enviar email de recuperação. Tente novamente.")
          }
          return
        }

        const data = await response.json()
        setSuccess("Email de recuperação enviado! Verifique sua caixa de entrada.")
      } catch (error) {
        console.error("Erro ao enviar email:", error)
        setError("Erro ao enviar email. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Para SMS, usar o fluxo original
      onMethodSelected(method, idAcesso)
    }
  }

  return (
    <MobileFrame
      title="Recuperar Senha"
      leftIcon={<ArrowLeft className="w-5 h-5 text-white" />}
      showFooter={false}
      onLeftIconClick={onBack}
    >
      <div className="flex flex-col h-full p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#7209B7] mb-2">Recuperação de Senha</h2>
          <p className="text-sm text-gray-600">
            {userInfo ? "Escolha como deseja receber o código de verificação" : "Digite seu ID de acesso para começar"}
          </p>
        </div>

        {!userInfo ? (
          <form onSubmit={handleVerifyUser} className="space-y-6">
            <div>
              <label htmlFor="id-acesso" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Acesso
              </label>
              <input
                id="id-acesso"
                type="text"
                value={idAcesso}
                onChange={handleIdAcessoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7209B7] focus:border-transparent"
                placeholder="Digite seu ID de acesso"
                disabled={isLoading}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !idAcesso}
              className="w-full py-3 bg-[#FF5722] text-white rounded-md font-medium text-lg hover:bg-[#FF5722]/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Verificando..." : "Continuar"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="font-medium">Olá, {userInfo.nome_completo}</p>
            </div>

            {success ? (
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-green-600 text-center">{success}</p>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Verifique sua caixa de entrada e siga as instruções no email.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userInfo.email && (
                  <button
                    onClick={() => handleSelectMethod("email")}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-md hover:border-[#7209B7] hover:bg-[#7209B7]/5 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-[#7209B7] mr-3" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">{userInfo.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</p>
                      </div>
                    </div>
                  </button>
                )}

                {userInfo.telefone && (
                  <button
                    onClick={() => handleSelectMethod("sms")}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-md hover:border-[#7209B7] hover:bg-[#7209B7]/5 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-[#7209B7] mr-3" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-gray-600">
                          {userInfo.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) ***-$3")}
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            {isLoading && <div className="text-blue-600 text-sm text-center">Enviando email...</div>}
          </div>
        )}
      </div>
    </MobileFrame>
  )
}
