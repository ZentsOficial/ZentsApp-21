"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import DatabaseStatus from "@/components/database-status"

interface TestResult {
  test: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function TestDatabasePage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [lastTest, setLastTest] = useState<Date | null>(null)

  const runTests = async () => {
    setLoading(true)
    setResults([])

    const testResults: TestResult[] = []

    try {
      // Teste 1: Status geral do banco
      console.log("🔍 Testando status geral do banco...")
      const statusResponse = await fetch("/api/database/status")
      const statusData = await statusResponse.json()

      testResults.push({
        test: "Status Geral do Banco",
        status: statusData.ready ? "success" : statusData.mock_mode ? "warning" : "error",
        message: statusData.message || "Status verificado",
        details: statusData,
      })

      // Teste 2: Verificar usuários
      console.log("👥 Testando acesso à tabela de usuários...")
      try {
        const usersResponse = await fetch("/api/user/12345")
        const userData = await usersResponse.json()

        testResults.push({
          test: "Acesso à Tabela de Usuários",
          status: usersResponse.ok ? "success" : "warning",
          message: usersResponse.ok ? "Tabela de usuários acessível" : "Usando dados mock",
          details: userData,
        })
      } catch (error) {
        testResults.push({
          test: "Acesso à Tabela de Usuários",
          status: "error",
          message: "Erro ao acessar tabela de usuários",
          details: error,
        })
      }

      // Teste 3: Verificar produtos
      console.log("📦 Testando acesso à tabela de produtos...")
      try {
        const productsResponse = await fetch("/api/products")
        const productsData = await productsResponse.json()

        testResults.push({
          test: "Acesso à Tabela de Produtos",
          status: productsResponse.ok ? "success" : "warning",
          message: productsResponse.ok ? `${productsData.length || 0} produtos encontrados` : "Usando dados mock",
          details: productsData,
        })
      } catch (error) {
        testResults.push({
          test: "Acesso à Tabela de Produtos",
          status: "error",
          message: "Erro ao acessar tabela de produtos",
          details: error,
        })
      }

      // Teste 4: Verificar produtos por vendedor
      console.log("🏪 Testando produtos por vendedor...")
      try {
        const vendorProductsResponse = await fetch("/api/products/vendor/12345")
        const vendorProductsData = await vendorProductsResponse.json()

        testResults.push({
          test: "Produtos por Vendedor",
          status: vendorProductsResponse.ok ? "success" : "warning",
          message: vendorProductsResponse.ok ? `Produtos do vendedor carregados` : "Usando dados mock",
          details: vendorProductsData,
        })
      } catch (error) {
        testResults.push({
          test: "Produtos por Vendedor",
          status: "error",
          message: "Erro ao buscar produtos por vendedor",
          details: error,
        })
      }
    } catch (error) {
      testResults.push({
        test: "Erro Geral",
        status: "error",
        message: "Erro inesperado durante os testes",
        details: error,
      })
    }

    setResults(testResults)
    setLastTest(new Date())
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Database className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">✅ Sucesso</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Aviso</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">❌ Erro</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const overallStatus =
    results.length > 0
      ? results.every((r) => r.status === "success")
        ? "success"
        : results.some((r) => r.status === "error")
          ? "error"
          : "warning"
      : "unknown"

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🔍 Teste de Conexão com Banco de Dados</h1>
        <p className="text-gray-600">Verificação completa da conectividade e funcionalidade do banco de dados</p>
      </div>

      {/* Status Component */}
      <div className="mb-6">
        <DatabaseStatus />
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={runTests} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Testando..." : "Executar Testes"}
          </Button>

          {lastTest && <span className="text-sm text-gray-500">Último teste: {lastTest.toLocaleTimeString()}</span>}
        </div>

        {results.length > 0 && (
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <span className="font-medium">Status Geral: {getStatusBadge(overallStatus)}</span>
          </div>
        )}
      </div>

      {/* Resultados dos Testes */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getStatusIcon(result.status)}
                  {result.test}
                </CardTitle>
                {getStatusBadge(result.status)}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{result.message}</CardDescription>

              {result.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Ver detalhes técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg">Executando testes de conectividade...</span>
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <Card className="w-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Clique em "Executar Testes" para verificar a conexão</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Final */}
      {results.length > 0 && (
        <Card className="mt-6 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Resumo da Conectividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter((r) => r.status === "success").length}
                </div>
                <div className="text-sm text-gray-600">Testes com Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter((r) => r.status === "warning").length}
                </div>
                <div className="text-sm text-gray-600">Avisos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter((r) => r.status === "error").length}
                </div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm">
                <strong>💡 Interpretação:</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>
                  • <strong>✅ Sucesso:</strong> Conexão real com o banco Supabase funcionando
                </li>
                <li>
                  • <strong>⚠️ Aviso:</strong> Sistema funcionando com dados simulados (mock)
                </li>
                <li>
                  • <strong>❌ Erro:</strong> Falha na conexão ou configuração
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
