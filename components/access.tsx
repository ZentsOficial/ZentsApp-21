"use client"

import type React from "react"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import MobileFrame from "./mobile-frame"
import DatabaseStatus from "./database-status"
import { useRouter } from "next/navigation"

export default function Access() {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Signup form state
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accessId, setAccessId] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginAccessId, setLoginAccessId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_acesso: Number.parseInt(loginAccessId),
          senha: loginPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Buscar o telefone do vendedor
        const phoneResponse = await fetch(`/api/auth/vendor-phone/${loginAccessId}`)
        const phoneData = await phoneResponse.json()

        if (phoneResponse.ok && phoneData.telefone) {
          // Salvar o telefone do vendedor no localStorage
          localStorage.setItem("vendorPhone", phoneData.telefone)
        }

        if (data.mock) {
          alert(
            `Bem-vindo, ${data.usuario.nome_completo}! (Modo simulação)\nPara usar o banco real, execute o script SQL.`,
          )
        } else {
          alert(`Bem-vindo, ${data.usuario.nome_completo}!`)
        }

        // Salvar dados do usuário
        localStorage.setItem("usuario", JSON.stringify(data.usuario))

        // Redirecionar para a página principal após login bem-sucedido
        router.push("/")
      } else {
        alert(data.error || "Erro ao fazer login")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_completo: fullName,
          nome_empresa: companyName,
          telefone: phone,
          email: email,
          senha: password,
          id_acesso: Number.parseInt(accessId),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.mock) {
          alert(
            `Conta criada com sucesso em modo simulação!\nUsuário: ${data.usuario.nome_completo}\nPara usar o banco real, execute o script SQL.`,
          )
        } else {
          alert("Conta criada com sucesso!")
        }
        // Limpar formulário
        setFullName("")
        setCompanyName("")
        setPhone("")
        setEmail("")
        setPassword("")
        setAccessId("")
        // Mudar para aba de login
        setActiveTab("login")
      } else {
        alert(data.error || "Erro ao criar conta")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao criar conta")
    }
  }

  const handleForgotPassword = () => {
    router.push("/recuperar-senha")
  }

  return (
    <MobileFrame showHeader={false} showFooter={false}>
      <div className="flex flex-col h-full bg-white">
        {/* Logo */}
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-[#FF5722]">Zents</h1>
          <p className="text-sm text-[#7209B7] mt-1">Catálogo Digital</p>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 pb-3 text-center font-medium ${
                activeTab === "signup" ? "text-[#FF5722] border-b-2 border-[#FF5722]" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Criar conta
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium ${
                activeTab === "login" ? "text-[#FF5722] border-b-2 border-[#FF5722]" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Acessar
            </button>
          </div>
        </div>

        {/* Database Status */}
        <div className="px-6 mb-4">
          <DatabaseStatus />
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 overflow-y-auto">
          {activeTab === "signup" ? (
            <div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Nome da empresa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Telefone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="ID de acesso"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF5722] text-white rounded-full font-medium text-lg hover:bg-[#FF5722]/90 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="number"
                    placeholder="ID de acesso"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={loginAccessId}
                    onChange={(e) => setLoginAccessId(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-[#7209B7] hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Esqueceu sua senha?
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className={`w-full py-3 bg-[#FF5722] text-white rounded-full font-medium text-lg hover:bg-[#FF5722]/90 transition-colors ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </MobileFrame>
  )
}
