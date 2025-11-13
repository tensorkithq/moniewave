/**
 * Extended Tool Metadata with Widget Type System
 *
 * Extends the base xmcp ToolMetadata to include widget type classification
 */

import type { ToolMetadata } from 'xmcp';
import type { WidgetTypeMetadata } from './widget-types';

/**
 * Extended OpenAI Metadata
 *
 * Includes widget type information in the _meta.openai section
 */
export interface ExtendedOpenAIMetadata {
  /** Tool invocation messages */
  toolInvocation?: {
    invoking: string;
    invoked: string;
  };

  /** Whether the widget is accessible in ChatGPT */
  widgetAccessible?: boolean;

  /** Whether the widget prefers a border */
  widgetPrefersBorder?: boolean;

  /** Initial widget state */
  widgetState?: Record<string, any>;

  /** Widget type classification and metadata */
  widgetType?: WidgetTypeMetadata;

  /** Output template for rendering */
  outputTemplate?: string;
}

/**
 * Extended Tool Metadata
 *
 * Complete tool metadata including widget type system
 */
export interface ExtendedToolMetadata extends Omit<ToolMetadata, '_meta'> {
  /** Extended metadata including widget type */
  _meta?: {
    openai?: ExtendedOpenAIMetadata;
    [key: string]: any;
  };
}

/**
 * Helper function to create tool metadata with widget type
 *
 * @param name - The tool name (will be prefixed based on widget type)
 * @param description - Tool description
 * @param widgetType - Widget type metadata
 * @param options - Additional options
 * @returns Complete tool metadata
 *
 * @example
 * ```ts
 * const metadata = createToolMetadata(
 *   'AccountSnapshot',
 *   'Displays account balance and recent transactions',
 *   {
 *     type: WidgetType.Resource,
 *     capabilities: {
 *       refreshable: true,
 *       supportsDarkMode: true,
 *     },
 *     resourceConfig: {
 *       autoRefresh: true,
 *       refreshInterval: 30,
 *     },
 *   }
 * );
 * ```
 */
export function createToolMetadata(
  name: string,
  description: string,
  widgetType: WidgetTypeMetadata,
  options: {
    widgetAccessible?: boolean;
    widgetPrefersBorder?: boolean;
    widgetState?: Record<string, any>;
    invokingMessage?: string;
    invokedMessage?: string;
  } = {}
): ExtendedToolMetadata {
  const {
    widgetAccessible = true,
    widgetPrefersBorder = true,
    widgetState,
    invokingMessage,
    invokedMessage,
  } = options;

  return {
    name,
    description,
    _meta: {
      openai: {
        toolInvocation: {
          invoking: invokingMessage || `Loading ${name}...`,
          invoked: invokedMessage || `${name} loaded`,
        },
        widgetAccessible,
        widgetPrefersBorder,
        widgetState,
        widgetType,
      },
    },
  };
}

/**
 * Type guard to check if metadata includes widget type
 */
export function hasWidgetType(metadata: ToolMetadata): metadata is ExtendedToolMetadata {
  return (
    metadata._meta !== undefined &&
    metadata._meta.openai !== undefined &&
    'widgetType' in metadata._meta.openai
  );
}

/**
 * Extracts widget type metadata from tool metadata
 */
export function getWidgetType(metadata: ToolMetadata): WidgetTypeMetadata | null {
  if (hasWidgetType(metadata)) {
    return metadata._meta?.openai?.widgetType || null;
  }
  return null;
}
