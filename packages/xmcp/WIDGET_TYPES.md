# Widget Type System

A comprehensive type classification system for xmcp widgets that enables better organization, discovery, and usage patterns.

## Overview

The Widget Type System introduces a standardized way to categorize widgets based on their behavior and capabilities. This makes it easier to:

- **Organize** widgets by their purpose (read-only vs. interactive)
- **Discover** the right widget for specific use cases
- **Validate** widget configurations at build time
- **Document** widget capabilities and requirements

## Widget Types

### 1. Resource Widgets (`__Resource__`)

**Read-only widgets** that display data without requiring user interaction.

**Prefix:** `__Resource__`

**Use cases:**
- Account snapshots
- Transaction history
- Analytics dashboards
- Status displays
- Reports and summaries

**Example:**
```typescript
import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  '__Resource__AccountSnapshot',
  'Displays account balance and recent transactions',
  {
    type: WidgetType.Resource,
    capabilities: {
      refreshable: true,
      supportsDarkMode: true,
    },
    resourceConfig: {
      autoRefresh: true,
      refreshInterval: 30, // seconds
    },
  }
);
```

### 2. Action Widgets (`__Action__`)

**Interactive widgets** that require user approval, rejection, or confirmation.

**Prefix:** `__Action__`

**Use cases:**
- Transaction approvals
- Payment confirmations
- Access requests
- Workflow approvals
- Form submissions

**Example:**
```typescript
import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  '__Action__ApproveTransaction',
  'Approve or reject pending transactions',
  {
    type: WidgetType.Action,
    capabilities: {
      requiresAuth: true,
    },
    actionConfig: {
      actionType: 'approve-reject',
      requiresConfirmation: true,
      actionTimeout: 300, // 5 minutes
    },
  }
);
```

## Widget Metadata Structure

### Complete Metadata Example

```typescript
interface WidgetTypeMetadata {
  // Required: Widget type classification
  type: WidgetType;

  // Optional: Widget capabilities
  capabilities?: {
    refreshable?: boolean;           // Can refresh data
    realtime?: boolean;               // Supports real-time updates
    requiresAuth?: boolean;           // Requires authentication
    supportsPiP?: boolean;            // Supports Picture-in-Picture mode
    supportsDarkMode?: boolean;       // Supports dark mode
    embeddable?: boolean;             // Can be embedded
    requiredPermissions?: string[];   // Required permissions
  };

  // Optional: Action widget configuration
  actionConfig?: {
    actionType: 'approve-reject' | 'confirm-cancel' | 'submit' | 'custom';
    requiresConfirmation?: boolean;
    actionTimeout?: number;           // Timeout in seconds
    defaultAction?: 'approve' | 'reject' | 'cancel' | null;
    actionLabels?: {
      primary?: string;
      secondary?: string;
    };
  };

  // Optional: Resource widget configuration
  resourceConfig?: {
    autoRefresh?: boolean;
    refreshInterval?: number;         // Interval in seconds
    dataSource?: string;
    filterable?: boolean;
    sortable?: boolean;
    pageable?: boolean;
  };

  // Optional: Additional metadata
  version?: string;                   // Semver version
  tags?: string[];                    // Tags for discovery
  author?: string;
  documentationUrl?: string;
}
```

## Creating Widgets

### Using `createToolMetadata`

The `createToolMetadata` helper function creates complete tool metadata with widget type information:

```typescript
import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  'WidgetName',                      // Widget name (will be prefixed)
  'Widget description',              // Description
  {
    type: WidgetType.Resource,       // Widget type
    version: '1.0.0',
    capabilities: { /* ... */ },
    resourceConfig: { /* ... */ },
  },
  {
    // Optional: Additional tool options
    widgetAccessible: true,
    widgetPrefersBorder: true,
    invokingMessage: 'Loading...',
    invokedMessage: 'Loaded',
  }
);
```

### Manual Widget Naming

If you need to manually create widget names with prefixes:

```typescript
import { getWidgetName, WidgetType } from '../types';

const resourceName = getWidgetName('AccountSnapshot', WidgetType.Resource);
// Returns: "__Resource__AccountSnapshot"

const actionName = getWidgetName('ApproveTransaction', WidgetType.Action);
// Returns: "__Action__ApproveTransaction"
```

### Parsing Widget Names

Extract base name and type from a prefixed widget name:

```typescript
import { parseWidgetName } from '../types';

const parsed = parseWidgetName('__Resource__AccountSnapshot');
// Returns: { baseName: 'AccountSnapshot', type: WidgetType.Resource }

const parsed2 = parseWidgetName('__Action__ApproveTransaction');
// Returns: { baseName: 'ApproveTransaction', type: WidgetType.Action }
```

## Type Guards and Validation

### Type Guards

```typescript
import { isResourceWidget, isActionWidget } from '../types';

if (isResourceWidget(metadata)) {
  // This is a resource widget
  console.log(metadata.resourceConfig);
}

if (isActionWidget(metadata)) {
  // This is an action widget
  console.log(metadata.actionConfig);
}
```

### Zod Validation

All widget metadata is validated using Zod schemas:

```typescript
import { validateWidgetMetadata } from '../types';

try {
  const validated = validateWidgetMetadata(metadata);
  console.log('Valid metadata:', validated);
} catch (error) {
  console.error('Invalid metadata:', error);
}
```

## Widget Capabilities

### Common Capabilities

| Capability | Type | Description |
|------------|------|-------------|
| `refreshable` | `boolean` | Widget can refresh its data |
| `realtime` | `boolean` | Widget supports real-time updates |
| `requiresAuth` | `boolean` | Widget requires authentication |
| `supportsPiP` | `boolean` | Widget can be displayed in PiP mode |
| `supportsDarkMode` | `boolean` | Widget supports dark mode |
| `embeddable` | `boolean` | Widget can be embedded in other widgets |
| `requiredPermissions` | `string[]` | Required permissions array |

### Resource-Specific Configuration

| Property | Type | Description |
|----------|------|-------------|
| `autoRefresh` | `boolean` | Enable automatic refresh |
| `refreshInterval` | `number` | Refresh interval in seconds |
| `dataSource` | `string` | Data source identifier |
| `filterable` | `boolean` | Supports filtering |
| `sortable` | `boolean` | Supports sorting |
| `pageable` | `boolean` | Supports pagination |

### Action-Specific Configuration

| Property | Type | Description |
|----------|------|-------------|
| `actionType` | `enum` | Type of action (approve-reject, confirm-cancel, submit, custom) |
| `requiresConfirmation` | `boolean` | Requires confirmation before action |
| `actionTimeout` | `number` | Timeout for user action (seconds) |
| `defaultAction` | `enum` | Default action on timeout |
| `actionLabels` | `object` | Custom labels for actions |

## Examples

### Resource Widget: Account Snapshot

See [`__Resource__AccountSnapshot.tsx`](./src/tools/__Resource__AccountSnapshot.tsx) for a complete example of a read-only resource widget that displays account information.

**Features:**
- Auto-refreshes every 30 seconds
- Displays balance and recent transactions
- Read-only view with visual indicators
- Dark mode support

### Action Widget: Approve Transaction

See [`__Action__ApproveTransaction.tsx`](./src/tools/__Action__ApproveTransaction.tsx) for a complete example of an interactive action widget.

**Features:**
- Approve/reject transaction flow
- Confirmation dialog before action
- 5-minute timeout for decision
- Risk level indicators
- State management for action status

## Best Practices

### 1. Choose the Right Widget Type

- Use **Resource** widgets for displaying data without user interaction
- Use **Action** widgets when user approval/confirmation is required

### 2. Provide Complete Metadata

Always include:
- Widget type classification
- Relevant capabilities
- Type-specific configuration
- Version information
- Descriptive tags

### 3. Follow Naming Conventions

- Use clear, descriptive base names (e.g., `AccountSnapshot`, `ApproveTransaction`)
- Let the system add the appropriate prefix
- Use PascalCase for base names

### 4. Set Appropriate Timeouts

For action widgets:
- Set realistic `actionTimeout` values
- Consider the complexity of the decision
- Provide clear timeout warnings in the UI

### 5. Handle State Properly

- Use React state hooks for interactive widgets
- Persist important state via `widgetState`
- Provide loading and error states

### 6. Validate Input

Always validate widget metadata:

```typescript
import { validateWidgetMetadata } from '../types';

const metadata = validateWidgetMetadata({
  type: WidgetType.Resource,
  // ... other properties
});
```

## File Structure

```
packages/xmcp/src/
├── types/
│   ├── index.ts                    # Exports all types
│   ├── widget-types.ts             # Core type definitions and utilities
│   └── tool-metadata.ts            # Extended tool metadata
└── tools/
    ├── __Resource__AccountSnapshot.tsx
    ├── __Action__ApproveTransaction.tsx
    └── incrementer.tsx             # Original example
```

## TypeScript Support

All types are fully typed with TypeScript and include:

- Type-safe enums for widget types
- Interface definitions for all configurations
- Zod schemas for runtime validation
- Type guards for runtime type checking
- Utility functions with complete type inference

## Migration Guide

### Existing Widgets

To migrate existing widgets to use the widget type system:

1. Import the types:
   ```typescript
   import { createToolMetadata, WidgetType } from '../types';
   ```

2. Replace your metadata definition:
   ```typescript
   // Before
   export const metadata: ToolMetadata = {
     name: "myWidget",
     description: "...",
     _meta: { /* ... */ }
   };

   // After
   export const metadata = createToolMetadata(
     'MyWidget',
     'Description',
     { type: WidgetType.Resource, /* ... */ }
   );
   ```

3. Add type-specific configuration as needed

### New Widgets

For new widgets, use the provided examples as templates:
- Resource widgets: Use `__Resource__AccountSnapshot.tsx`
- Action widgets: Use `__Action__ApproveTransaction.tsx`

## License

Part of the Moniewave monorepo.
