# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** containing multiple MCP (Model Context Protocol) server implementations and xmcp-based ChatGPT widgets for Paystack payment integration.

### Monorepo Structure

```
moniewave/
├── apps/
│   └── server/          # Go MCP server for Paystack API
├── packages/
│   ├── paystack-mcp/    # TypeScript MCP server (@moniewave/paystack-mcp)
│   └── xmcp/            # xmcp widgets with React (@moniewave/xmcp)
└── examples/            # Apps SDK examples gallery (standalone)
```

## Architecture

### xmcp Package (packages/xmcp/)
- **Framework**: xmcp 0.3.5 with React 19.1.1
- **Configuration**: `xmcp.config.ts` - HTTP transport enabled, SSR enabled
- **Tools Directory**: `./src/tools` - Widget components organized by type
- **Type System**: Widget classification (Resource/Action) with Zod schemas in `src/types/`
- **Build Output**: `dist/` directory
- **Package Name**: `@moniewave/xmcp`

### Paystack TypeScript MCP Server (packages/paystack-mcp/)
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
- **Package Name**: `@moniewave/paystack-mcp`

### Paystack Go MCP Server (apps/server/)
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

### Root (Turborepo)
```bash
# Install dependencies
pnpm install

# Build all packages/apps
pnpm build               # Runs turbo build

# Development mode (all)
pnpm dev                 # Runs turbo dev

# Lint all packages
pnpm lint                # Runs turbo lint

# Format code
pnpm format              # Prettier format all files

# Clean build artifacts
pnpm clean               # Runs turbo clean
```

### xmcp Package (packages/xmcp/)
```bash
cd packages/xmcp

# Development
pnpm dev                 # Start dev server with HTTP transport

# Build
pnpm build               # Build with xmcp

# Production
pnpm start               # Run compiled server (node dist/http.js)

# Clean
pnpm clean               # Remove dist/
```

### Paystack TypeScript Server (packages/paystack-mcp/)
```bash
cd packages/paystack-mcp

# Development
pnpm build               # Compile TypeScript to build/
pnpm dev:debug           # Run with MCP Inspector for debugging

# Linting/Formatting
pnpm lint                # ESLint check
pnpm prettier            # Format code
pnpm prettier-check      # Check formatting

# Testing locally
PAYSTACK_SECRET_KEY=sk_test_xxx npx @modelcontextprotocol/inspector node ./build/index.js
```

### Go MCP Server (apps/server/)
```bash
cd apps/server

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
pnpm build               # Generates assets/ bundles

# Development
pnpm dev                 # Vite dev server
pnpm serve               # Serve static assets on :4444

# Type checking
pnpm tsc                 # Full type check
pnpm tsc:app             # App-only type check
pnpm tsc:node            # Node-only type check
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

### Widget Type System (packages/xmcp/)
A comprehensive type classification system for organizing and categorizing widgets:

**Widget Types:**
- **Resource** (`__Resource__` prefix): Read-only widgets that display data without user interaction
  - Examples: `__Resource__AccountSnapshot`, `__Resource__TransactionHistory`
  - Features: Auto-refresh, data source configuration, filtering/sorting/pagination support
- **Action** (`__Action__` prefix): Interactive widgets requiring user approval/rejection
  - Examples: `__Action__ApproveTransaction`, `__Action__ConfirmPayment`
  - Features: Confirmation dialogs, timeouts, default actions, custom labels

**Type Definitions:**
- `src/types/widget-types.ts` - Core type definitions, enums, and Zod schemas
- `src/types/tool-metadata.ts` - Extended ToolMetadata with widget type integration
- `src/types/index.ts` - Exports all types and utilities

**Utility Functions:**
- `createToolMetadata()` - Create complete tool metadata with widget type
- `getWidgetName()` - Generate widget name with appropriate prefix
- `parseWidgetName()` - Extract base name and type from prefixed name
- `validateWidgetMetadata()` - Zod-based validation
- `isResourceWidget()`, `isActionWidget()` - Type guards

**Widget Metadata Structure:**
```typescript
{
  type: WidgetType.Resource | WidgetType.Action,
  capabilities: {
    refreshable, realtime, requiresAuth, supportsPiP, supportsDarkMode, etc.
  },
  resourceConfig?: { autoRefresh, refreshInterval, dataSource, filterable, sortable, pageable },
  actionConfig?: { actionType, requiresConfirmation, actionTimeout, defaultAction, actionLabels },
  version, tags, author, documentationUrl
}
```

**Creating Widgets:**
```typescript
import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  'AccountSnapshot',
  'Displays account balance and transactions',
  {
    type: WidgetType.Resource,
    capabilities: { refreshable: true },
    resourceConfig: { autoRefresh: true, refreshInterval: 30 }
  }
);
```

See [WIDGET_TYPES.md](packages/xmcp/WIDGET_TYPES.md) for complete documentation.

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

This is a **pnpm workspace** managed by **Turborepo**.

- **Root**: pnpm 10.13.1+ (enforced via packageManager field in root package.json)
- **All packages**: pnpm (workspace protocol)
- **apps/server**: Go modules (standalone)

## Testing MCP Servers

### TypeScript Server
```bash
# With MCP Inspector
cd packages/paystack-mcp
pnpm build
pnpm dev:debug
# Add PAYSTACK_SECRET_KEY in Inspector UI
```

### Go Server
```bash
cd apps/server
PAYSTACK_SECRET_KEY=sk_test_xxx go run main.go
# Server listens on :4000 for SSE connections
# Visit http://localhost:4000/sse
```

### With ChatGPT
1. Enable developer mode in ChatGPT
2. Use ngrok to expose local server: `ngrok http 4000` (Go) or `ngrok http 8000` (TypeScript)
3. Add connector in Settings > Connectors with ngrok URL

## Adding New Widgets (packages/xmcp/)

### Creating a New Widget with Type System

1. **Choose Widget Type**: Determine if your widget is a Resource (read-only) or Action (interactive)

2. **Create Widget File**: Create a new `.tsx` file in `src/tools/` with the appropriate prefix:
   - Resource: `__Resource__WidgetName.tsx`
   - Action: `__Action__WidgetName.tsx`

3. **Define Metadata**: Use `createToolMetadata()` helper:
   ```typescript
   import { createToolMetadata, WidgetType } from '../types';

   export const metadata = createToolMetadata(
     '__Resource__WidgetName',  // or '__Action__WidgetName'
     'Widget description',
     {
       type: WidgetType.Resource,  // or WidgetType.Action
       version: '1.0.0',
       capabilities: { /* ... */ },
       resourceConfig: { /* ... */ }  // or actionConfig for Action widgets
     }
   );
   ```

4. **Implement Component**: Export default React component:
   ```typescript
   export default function handler() {
     return <div>Your widget UI</div>;
   }
   ```

5. **Examples**:
   - Resource widget: See `src/tools/__Resource__AccountSnapshot.tsx`
   - Action widget: See `src/tools/__Action__ApproveTransaction.tsx`

## Adding New Paystack Tools

### TypeScript Server (packages/paystack-mcp/)
1. Create/update tool file in `src/tools/`
2. Define Zod schema in `src/types/<domain>/schemas.ts`
3. Create interface in `src/types/<domain>/interfaces.ts`
4. Register tool in `src/tools/index.ts`
5. Follow existing pattern from `customers.ts` or `transactions.ts`

### Go Server (apps/server/)
1. Add tool to appropriate `register*Tools()` function in `main.go`
2. Create handler function following pattern:
   ```go
   func handleToolName(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)
   ```
3. Use `paystackClient.<Service>.<Method>()` for API calls
4. Return `successResult(data)` or `errorResult(err)`

## Turborepo Configuration

The monorepo uses Turborepo for task orchestration:

- **Configuration**: [turbo.json](turbo.json)
- **Pipeline Tasks**: `build`, `dev`, `lint`, `clean`, `prettier`, `prettier-check`
- **Caching**: Enabled for `build` and `lint` tasks
- **Remote Caching**: Not configured (optional)
- **Task Dependencies**: Build tasks run in topological order using `^build`
