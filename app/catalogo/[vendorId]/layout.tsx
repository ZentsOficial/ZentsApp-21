import type React from "react"
export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Catálogo Digital - Zents</title>
        <meta name="description" content="Catálogo digital de produtos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
