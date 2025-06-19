"use client"

import { useEffect, useState } from "react"
import { RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff, Database } from "lucide-react"

interface DatabaseColumn {
  name: string
  type: string
}

interface DatabaseStatus {
  status: string
  connection?: string
  tables?: {
    dados_usuario: boolean
    produtos: boolean
  }
  columns?: {
    dados_usuario: DatabaseColumn[]
    has_id_acesso?: boolean
    has_id_vendedor?: boolean
  }
  data_counts?: {
    usuarios: number
    produtos: number
  }
  ready?: boolean
  mock_mode?: boolean
  message?: string
  error?: string
  suggestion?: string
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const checkStatus = async () => {
    try {
      setLoading(true)
      console.log("🔍 Verificando status do banco...")

      const response = await fetch("/api/database/status")
      const data = await response.json()

      console.log("📊 Status recebido:", data)
      setStatus(data)
    } catch (error) {
      console.error("❌ Erro ao verificar status:", error)
      setStatus({
        status: "error",
        message: "Erro ao verificar status do banco",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        mock_mode: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
        <div className="flex items-center">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Verificando conexão com o banco...</span>
        </div>
      </div>
    )
  }

  if (!status) return null

  const getStatusColor = () => {
    if (status.status === "error") return "red"
    if (status.ready && !status.mock_mode) return "green"
    if (status.mock_mode) return "yellow"
    return "blue"
  }

  const getStatusIcon = () => {
    if (status.status === "error") return <WifiOff className="w-4 h-4" />
    if (status.ready && !status.mock_mode) return <CheckCircle className="w-4 h-4" />
    if (status.mock_mode) return <AlertCircle className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (status.status === "error") return "❌ Erro de conexão"
    if (status.ready && !status.mock_mode) return "✅ Banco conectado"
    if (status.mock_mode) return "🎭 Modo simulação"
    return "🔄 Verificando..."
  }

  const colorClasses = {
    red: "bg-red-50 border-red-200 text-red-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
  }

  return isVisible ? (
    <div className={`border px-4 py-3 rounded-md mb-4 ${colorClasses[getStatusColor()]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="text-sm font-medium ml-2">{getStatusText()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsVisible(false)} className="text-current hover:opacity-70" title="Ocultar status">
            <Database className="w-4 h-4" />
          </button>
          <button onClick={checkStatus} className="text-current hover:opacity-70" title="Atualizar status">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {status.message && <p className="text-sm mt-2">{status.message}</p>}

      {status.error && (
        <div className="mt-2 text-sm">
          <p className="font-medium">Erro:</p>
          <p className="text-xs bg-white/50 p-2 rounded mt-1">{status.error}</p>
        </div>
      )}

      {status.suggestion && (
        <div className="mt-2 text-sm">
          <p className="font-medium">💡 Sugestão:</p>
          <p>{status.suggestion}</p>
        </div>
      )}

      {showDetails && status.status === "success" && (
        <div className="text-sm mt-2">
          <p className="font-medium">📋 Status das tabelas:</p>
          <ul className="list-disc list-inside mt-1 text-xs">
            <li>dados_usuario: {status.tables?.dados_usuario ? "✅ Existe" : "❌ Não encontrada"}</li>
            <li>produtos: {status.tables?.produtos ? "✅ Existe" : "❌ Não encontrada"}</li>
            {status.columns?.has_id_acesso !== undefined && (
              <li>coluna id_acesso: {status.columns.has_id_acesso ? "✅" : "❌"}</li>
            )}
            {status.columns?.has_id_vendedor !== undefined && (
              <li>coluna "id vendedor": {status.columns.has_id_vendedor ? "✅" : "❌"}</li>
            )}
          </ul>

          {status.columns?.dados_usuario && status.columns.dados_usuario.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">📊 Estrutura da tabela dados_usuario:</p>
              <div className="bg-white/50 p-2 rounded mt-1 text-xs overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left pr-4">Coluna</th>
                      <th className="text-left">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.columns.dados_usuario.map((col, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white/30" : ""}>
                        <td className="pr-4">{col.name}</td>
                        <td>{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {status.ready && status.data_counts && (
        <div className="text-sm mt-2">
          <p className="font-medium">📊 Dados no banco:</p>
          <ul className="list-disc list-inside mt-1 text-xs">
            <li>{status.data_counts.usuarios} usuários cadastrados</li>
            <li>{status.data_counts.produtos} produtos no catálogo</li>
          </ul>
        </div>
      )}

      {status.mock_mode && (
        <div className="mt-2 p-2 bg-white/50 rounded text-xs">
          <p className="font-medium">🎭 Modo Simulação Ativo</p>
          <p>O sistema funcionará com dados de exemplo.</p>
          <p>Execute o script SQL para usar o banco real.</p>
        </div>
      )}
    </div>
  ) : null
}
