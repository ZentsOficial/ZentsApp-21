import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para codificar string em base64
export function encodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    // Cliente: usar API do navegador
    return btoa(str)
  } else {
    // Servidor: usar Buffer
    return Buffer.from(str).toString("base64")
  }
}

// Função para decodificar string de base64
export function decodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    // Cliente: usar API do navegador
    return atob(str)
  } else {
    // Servidor: usar Buffer
    return Buffer.from(str, "base64").toString()
  }
}
