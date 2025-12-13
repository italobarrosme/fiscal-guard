# Fiscal Guard

Sistema de validação de CPFs que permite verificar a validade e o status fiscal de documentos junto à Receita Federal.

## O que é

O Fiscal Guard é uma aplicação web para validação em lote de CPFs, fornecendo informações sobre a situação cadastral de cada documento validado.

## Para que serve

- Validar CPFs em massa
- Verificar status na Receita Federal (Regular, Suspenso, Cancelado, etc.)
- Visualizar estatísticas e resumos das validações realizadas
- Formatar e organizar resultados em tabelas interativas

## Tecnologias

- **React 19** - Biblioteca UI
- **Next.js / Vite** - Build tool e bundler
- **TanStack Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **TanStack Table** - Tabelas de dados
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas
- **Biome** - Linting e formatação
- **Vitest** - Testes

## Como usar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

