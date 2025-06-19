"use client"

import type React from "react"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import MobileFrame from "./mobile-frame"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de login/cadastro
    console.log(isSignup ? "Cadastro" : "Login", { email, password, name })
  }

  return (
    <MobileFrame showHeader={false} showFooter={false}>
      <div className="flex flex-col h-full justify-between p-6">
        <div className="flex-1 flex flex-col justify-center items-center">
          {/* Logo */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[#FF5722]">Zents</h1>
            <p className="text-sm text-[#7209B7] mt-1">{isSignup ? "Crie sua conta" : "Seu catálogo digital"}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7]"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                />
              </div>
            )}

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
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                {!isSignup && (
                  <a href="#" className="text-xs text-[#7209B7] hover:underline">
                    Esqueceu a senha?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {isSignup && <p className="mt-1 text-xs text-gray-500">Mínimo de 8 caracteres</p>}
            </div>

            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7209B7] focus:border-[#7209B7] pr-10"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            {isSignup && (
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#7209B7] focus:ring-[#7209B7] border-gray-300 rounded mt-0.5"
                  required={isSignup}
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
                  Concordo com os{" "}
                  <a href="#" className="text-[#7209B7] hover:underline">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-[#7209B7] hover:underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#FF5722] text-white font-medium rounded-md shadow-sm hover:bg-[#FF5722]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5722]"
            >
              {isSignup ? "Criar conta" : "Entrar"}
            </button>
          </form>
        </div>

        {/* Toggle between login and signup */}
        <div className="text-center mt-8 pb-4">
          <p className="text-sm text-gray-600">
            {isSignup ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              type="button"
              className="font-medium text-[#7209B7] hover:underline"
              onClick={() => {
                setIsSignup(!isSignup)
                // Reset form fields when switching
                setName("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
              }}
            >
              {isSignup ? "Entrar" : "Cadastre-se"}
            </button>
          </p>
        </div>
      </div>
    </MobileFrame>
  )
}
