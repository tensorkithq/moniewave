/**
 * Widget Type Schema
 *
 * Defines a type system for categorizing widgets by their behavior and capabilities.
 * This enables better organization, discovery, and usage patterns for widgets.
 */

import { z } from 'zod';

/**
 * Widget Type Enumeration
 *
 * - Resource: Read-only widgets that display data without user actions
 * - Action: Interactive widgets that require user approval or rejection
 */
export enum WidgetType {
  /**
   * Resource widgets are read-only displays of data.
   * Examples: AccountSnapshot, TransactionHistory, UserProfile
   */
  Resource = 'resource',

  /**
   * Action widgets require user interaction (approve/reject, confirm/cancel).
   * Examples: ApproveTransaction, ConfirmPayment, AuthorizeTransfer
   */
  Action = 'action',
}

/**
 * Widget Type Prefix Configuration
 *
 * Defines the naming convention for widget types using prefixes
 */
export const WIDGET_TYPE_PREFIX = {
  [WidgetType.Resource]: '__Resource__',
  [WidgetType.Action]: '__Action__',
} as const;

/**
 * Widget Capability Flags
 *
 * Describes what a widget can do beyond its basic type
 */
export interface WidgetCapabilities {
  /** Widget can refresh its data */
  refreshable?: boolean;

  /** Widget supports real-time updates */
  realtime?: boolean;

  /** Widget requires authentication */
  requiresAuth?: boolean;

  /** Widget can be displayed in PiP mode */
  supportsPiP?: boolean;

  /** Widget supports dark mode */
  supportsDarkMode?: boolean;

  /** Widget can be embedded in other widgets */
  embeddable?: boolean;

  /** Widget requires specific permissions */
  requiredPermissions?: string[];
}

/**
 * Action Widget Specific Configuration
 *
 * Additional metadata for action-type widgets
 */
export interface ActionWidgetConfig {
  /** Type of action the widget performs */
  actionType: 'approve-reject' | 'confirm-cancel' | 'submit' | 'custom';

  /** Whether the action requires confirmation */
  requiresConfirmation?: boolean;

  /** Timeout for user action (in seconds) */
  actionTimeout?: number;

  /** Default action if timeout occurs */
  defaultAction?: 'approve' | 'reject' | 'cancel' | null;

  /** Custom action labels */
  actionLabels?: {
    primary?: string;
    secondary?: string;
  };
}

/**
 * Resource Widget Specific Configuration
 *
 * Additional metadata for resource-type widgets
 */
export interface ResourceWidgetConfig {
  /** Whether the resource auto-refreshes */
  autoRefresh?: boolean;

  /** Auto-refresh interval (in seconds) */
  refreshInterval?: number;

  /** Data source identifier */
  dataSource?: string;

  /** Whether the resource supports filtering */
  filterable?: boolean;

  /** Whether the resource supports sorting */
  sortable?: boolean;

  /** Whether the resource supports pagination */
  pageable?: boolean;
}

/**
 * Widget Type Metadata
 *
 * Complete type information for a widget
 */
export interface WidgetTypeMetadata {
  /** The widget type classification */
  type: WidgetType;

  /** Widget capabilities */
  capabilities?: WidgetCapabilities;

  /** Action-specific configuration (only for Action widgets) */
  actionConfig?: ActionWidgetConfig;

  /** Resource-specific configuration (only for Resource widgets) */
  resourceConfig?: ResourceWidgetConfig;

  /** Widget version (semver) */
  version?: string;

  /** Widget category/tags for discovery */
  tags?: string[];

  /** Widget author/maintainer */
  author?: string;

  /** Widget documentation URL */
  documentationUrl?: string;
}

/**
 * Zod Schema for Widget Type
 */
export const WidgetTypeSchema = z.enum(['resource', 'action']);

/**
 * Zod Schema for Widget Capabilities
 */
export const WidgetCapabilitiesSchema = z.object({
  refreshable: z.boolean().optional(),
  realtime: z.boolean().optional(),
  requiresAuth: z.boolean().optional(),
  supportsPiP: z.boolean().optional(),
  supportsDarkMode: z.boolean().optional(),
  embeddable: z.boolean().optional(),
  requiredPermissions: z.array(z.string()).optional(),
}).optional();

/**
 * Zod Schema for Action Widget Config
 */
export const ActionWidgetConfigSchema = z.object({
  actionType: z.enum(['approve-reject', 'confirm-cancel', 'submit', 'custom']),
  requiresConfirmation: z.boolean().optional(),
  actionTimeout: z.number().positive().optional(),
  defaultAction: z.enum(['approve', 'reject', 'cancel']).nullable().optional(),
  actionLabels: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
  }).optional(),
}).optional();

/**
 * Zod Schema for Resource Widget Config
 */
export const ResourceWidgetConfigSchema = z.object({
  autoRefresh: z.boolean().optional(),
  refreshInterval: z.number().positive().optional(),
  dataSource: z.string().optional(),
  filterable: z.boolean().optional(),
  sortable: z.boolean().optional(),
  pageable: z.boolean().optional(),
}).optional();

/**
 * Zod Schema for Widget Type Metadata
 */
export const WidgetTypeMetadataSchema = z.object({
  type: WidgetTypeSchema,
  capabilities: WidgetCapabilitiesSchema,
  actionConfig: ActionWidgetConfigSchema,
  resourceConfig: ResourceWidgetConfigSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  documentationUrl: z.string().url().optional(),
});

/**
 * Type guard to check if a widget is a Resource widget
 */
export function isResourceWidget(metadata: WidgetTypeMetadata): boolean {
  return metadata.type === WidgetType.Resource;
}

/**
 * Type guard to check if a widget is an Action widget
 */
export function isActionWidget(metadata: WidgetTypeMetadata): boolean {
  return metadata.type === WidgetType.Action;
}

/**
 * Validates widget type metadata using Zod schema
 */
export function validateWidgetMetadata(metadata: unknown): WidgetTypeMetadata {
  return WidgetTypeMetadataSchema.parse(metadata);
}

/**
 * Generates a widget name with the appropriate prefix
 *
 * @param baseName - The base name of the widget (e.g., "AccountSnapshot")
 * @param type - The widget type
 * @returns The prefixed widget name (e.g., "__Resource__AccountSnapshot")
 *
 * @example
 * ```ts
 * getWidgetName('AccountSnapshot', WidgetType.Resource)
 * // Returns: "__Resource__AccountSnapshot"
 *
 * getWidgetName('ApproveTransaction', WidgetType.Action)
 * // Returns: "__Action__ApproveTransaction"
 * ```
 */
export function getWidgetName(baseName: string, type: WidgetType): string {
  const prefix = WIDGET_TYPE_PREFIX[type];
  return `${prefix}${baseName}`;
}

/**
 * Parses a prefixed widget name to extract the base name and type
 *
 * @param fullName - The full widget name with prefix
 * @returns Object containing base name and type, or null if invalid
 *
 * @example
 * ```ts
 * parseWidgetName('__Resource__AccountSnapshot')
 * // Returns: { baseName: 'AccountSnapshot', type: WidgetType.Resource }
 *
 * parseWidgetName('__Action__ApproveTransaction')
 * // Returns: { baseName: 'ApproveTransaction', type: WidgetType.Action }
 * ```
 */
export function parseWidgetName(fullName: string): { baseName: string; type: WidgetType } | null {
  for (const [type, prefix] of Object.entries(WIDGET_TYPE_PREFIX)) {
    if (fullName.startsWith(prefix)) {
      return {
        baseName: fullName.slice(prefix.length),
        type: type as WidgetType,
      };
    }
  }
  return null;
}

/**
 * Creates a complete widget metadata object with defaults
 *
 * @param baseName - The base name of the widget
 * @param type - The widget type
 * @param config - Additional configuration
 * @returns Complete widget metadata
 */
export function createWidgetMetadata(
  baseName: string,
  type: WidgetType,
  config: Partial<WidgetTypeMetadata> = {}
): WidgetTypeMetadata & { name: string } {
  const name = getWidgetName(baseName, type);

  const metadata: WidgetTypeMetadata = {
    type,
    capabilities: {
      supportsDarkMode: true,
      supportsPiP: true,
      ...config.capabilities,
    },
    ...config,
  };

  // Validate the metadata
  validateWidgetMetadata(metadata);

  return {
    name,
    ...metadata,
  };
}
