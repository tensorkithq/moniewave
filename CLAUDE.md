# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing multiple MCP (Model Context Protocol) server implementations and xmcp-based ChatGPT widgets for Paystack payment integration:

1. **Root xmcp project** - ChatGPT widgets using xmcp and React
2. **paystack/** - TypeScript MCP server for Paystack API (@kohasummons/paystack-mcp)
3. **server/** - Go MCP server for Paystack API
4. **examples/** - Apps SDK examples gallery with widget components

## Architecture

### xmcp Project (Root)
- **Framework**: xmcp 0.3.5 with React 19.1.1
- **Configuration**: `xmcp.config.ts` - HTTP transport enabled, SSR enabled
- **Tools Directory**: `./src/tools` (currently empty, uses `.gitkeep`)
- **Build Output**: `dist/` directory

### Paystack TypeScript MCP Server (paystack/)
- **Type**: Node.js MCP server using @modelcontextprotocol/sdk
- **Main Entry**: `build/index.js` (compiled from TypeScript)
- **Tools Organization**: Modular tools in `src/tools/`:
  - `products.ts` - Product management (create, list, get, update)
  - `customers.ts` - Customer operations (create, list, get, update, validate, risk actions)
  - `transactions.ts` - Transaction handling (initialize, verify, list, charge, partial debit)
  - `miscellaneous.ts` - Banks, countries, states data
  - `transfers-control.ts` - Balance checks, OTP management
- **Type Safety**: Zod schemas in `src/types/` with interfaces for all API entities
- **Authentication**: Requires `PAYSTACK_SECRET_KEY` environment variable
- **Distribution**: Published npm package with bin command `paystack-mcp`

### Paystack Go MCP Server (server/)
- **Type**: Go 1.23.0 MCP server using mcp-go library
- **Transport**: SSE (Server-Sent Events) on port 4000
- **SDK**: Uses official `paystack-go` SDK (borderlesshq/paystack-go)
- **Tools**: 14+ tools organized by domain (customers, transactions, transfers, plans, subscriptions, banks, subaccounts)
- **Handler Pattern**: All handlers follow signature `func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)`
- **Entry Point**: `main.go`

### Examples Gallery (examples/)
- **Purpose**: Apps SDK widget components for ChatGPT
- **Build System**: Vite with custom orchestrator (`build-all.mts`)
- **Output**: Versioned HTML/JS/CSS bundles in `assets/`
- **MCP Servers**: Demo servers (Pizzaz Node/Python, Solar System Python)
- **UI Framework**: React 19 with Three.js, Framer Motion, Tailwind CSS

## Common Commands

### Root xmcp Project
```bash
# Development
npm run dev              # Start dev server with HTTP transport

# Build
npm run build            # Build with xmcp

# Production
npm run start            # Run compiled server (node dist/http.js)
```

### Paystack TypeScript Server (paystack/)
```bash
cd paystack

# Development
npm run build            # Compile TypeScript to build/
npm run dev:debug        # Run with MCP Inspector for debugging

# Linting/Formatting
npm run lint             # ESLint check
npm run prettier         # Format code
npm run prettier-check   # Check formatting

# Testing locally
PAYSTACK_SECRET_KEY=sk_test_xxx npx @modelcontextprotocol/inspector node ./build/index.js
```

### Go MCP Server (server/)
```bash
cd server

# Build
go build -o paystack-mcp-server main.go

# Run
PAYSTACK_SECRET_KEY=sk_test_xxx ./paystack-mcp-server
# Or directly:
PAYSTACK_SECRET_KEY=sk_test_xxx go run main.go

# Dependencies
go mod download          # Install dependencies
```

### Examples Gallery (examples/)
```bash
cd examples

# Build all widgets
pnpm run build           # Generates assets/ bundles

# Development
pnpm run dev             # Vite dev server
pnpm run serve           # Serve static assets on :4444

# Type checking
pnpm run tsc             # Full type check
pnpm run tsc:app         # App-only type check
pnpm run tsc:node        # Node-only type check
```

## Key Architectural Patterns

### MCP Tool Registration Pattern (Go Server)
Tools are registered in domain-specific functions (e.g., `registerCustomerTools()`, `registerTransactionTools()`). Each handler:
1. Extracts parameters from `request` using `GetString()`, `GetInt()` methods
2. Validates required parameters
3. Calls Paystack SDK methods
4. Returns `successResult()` or `errorResult()`

### MCP Tool Registration Pattern (TypeScript Server)
Tools are exported from modular files in `src/tools/`. Each tool module:
1. Defines Zod schemas for input validation
2. Uses `@modelcontextprotocol/sdk` server methods
3. Makes HTTP requests to Paystack API via axios
4. Returns structured responses with proper error handling

### xmcp Widget Pattern
- Components in `src/tools/` are automatically discovered
- Each widget exports React components with xmcp-specific hooks
- SSR enabled via `experimental.ssr` config flag
- HTTP transport for ChatGPT integration

### Apps SDK Widget Pattern (examples/)
- Widgets built as standalone bundles with hashed filenames
- MCP servers return `_meta.openai/outputTemplate` metadata
- Widgets self-contained with embedded CSS
- Static assets served with CORS for local development

## Environment Variables

All servers require:
- `PAYSTACK_SECRET_KEY` - Paystack API key (sk_test_* for testing, sk_live_* for production)

Examples gallery may use:
- `BASE_URL` - For deployed widget asset URLs

## Package Manager

- Root and paystack/: npm
- examples/: pnpm 10.13.1+ (enforced via packageManager field)
- server/: Go modules

## Testing MCP Servers

### TypeScript Server
```bash
# With MCP Inspector
cd paystack
npm run build
npm run dev:debug
# Add PAYSTACK_SECRET_KEY in Inspector UI
```

### Go Server
```bash
cd server
PAYSTACK_SECRET_KEY=sk_test_xxx go run main.go
# Server listens on :4000 for SSE connections
# Visit http://localhost:4000/sse
```

### With ChatGPT
1. Enable developer mode in ChatGPT
2. Use ngrok to expose local server: `ngrok http 4000` (Go) or `ngrok http 8000` (TypeScript)
3. Add connector in Settings > Connectors with ngrok URL

## Adding New Paystack Tools

### TypeScript Server (paystack/)
1. Create/update tool file in `src/tools/`
2. Define Zod schema in `src/types/<domain>/schemas.ts`
3. Create interface in `src/types/<domain>/interfaces.ts`
4. Register tool in `src/tools/index.ts`
5. Follow existing pattern from `customers.ts` or `transactions.ts`

### Go Server (server/)
1. Add tool to appropriate `register*Tools()` function in `main.go`
2. Create handler function following pattern:
   ```go
   func handleToolName(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)
   ```
3. Use `paystackClient.<Service>.<Method>()` for API calls
4. Return `successResult(data)` or `errorResult(err)`
