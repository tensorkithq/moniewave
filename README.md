# Moniewave

A **Turborepo monorepo** containing multiple MCP (Model Context Protocol) server implementations and xmcp-based ChatGPT widgets for Paystack payment integration.

## Monorepo Structure

```
moniewave/
├── apps/
│   └── server/              # Go MCP server for Paystack API
├── packages/
│   ├── paystack-mcp/        # TypeScript MCP server (@moniewave/paystack-mcp)
│   └── xmcp/                # xmcp widgets with React (@moniewave/xmcp)
└── examples/                # Apps SDK examples gallery (standalone)
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.13.1+
- Go 1.23.0+ (for Go server)

### Installation

```bash
pnpm install
```

### Development

Run all packages in development mode:

```bash
pnpm dev
```

Build all packages:

```bash
pnpm build
```

### Working with Packages

#### xmcp Package

```bash
cd packages/xmcp
pnpm dev                 # Start dev server
pnpm build               # Build production
```

#### Paystack MCP Server (TypeScript)

```bash
cd packages/paystack-mcp
pnpm build               # Compile TypeScript
pnpm dev:debug           # Run with MCP Inspector
```

#### Go MCP Server

```bash
cd apps/server
go run main.go           # Run server
go build                 # Build binary
```

## Features

- **Turborepo**: Fast, efficient monorepo build system
- **pnpm Workspaces**: Optimized package management
- **MCP Servers**: Both TypeScript and Go implementations for Paystack API
- **xmcp Widgets**: React-based ChatGPT widgets
- **Type Safety**: Full TypeScript support across packages

## Documentation

See [CLAUDE.md](CLAUDE.md) for detailed architecture and development guide.

## License

ISC
