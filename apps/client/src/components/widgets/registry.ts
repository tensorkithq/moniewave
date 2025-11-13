/**
 * Widget Component Registry
 *
 * Maps widget type strings to React components for rendering.
 */

import type { ComponentType } from 'react';
import type { WidgetNode, RendererProps, WidgetMetadata } from './types';
import { WIDGET_METADATA } from './types';

// Component registry type
export type WidgetComponent = ComponentType<WidgetNode & RendererProps>;

// Registry mapping widget types to components
export const primitiveRegistry: Record<string, WidgetComponent> = {};

/**
 * Register a widget component
 */
export function registerWidget(type: string, component: WidgetComponent) {
  primitiveRegistry[type] = component;
}

/**
 * Get a widget component by type
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return primitiveRegistry[type];
}

/**
 * Check if a widget type is registered
 */
export function hasWidget(type: string): boolean {
  return type in primitiveRegistry;
}

// Metadata registry (initialized on import)
export const metadataRegistry: Record<string, WidgetMetadata> = {
  ...WIDGET_METADATA,
};

/**
 * Get widget metadata
 */
export function getWidgetMetadata(
  type: string
): WidgetMetadata | undefined {
  return metadataRegistry[type];
}

/**
 * Check if widget type is registered and valid
 */
export function isValidWidgetType(
  type: string
): type is keyof typeof WIDGET_METADATA {
  return type in metadataRegistry;
}

/**
 * Get all widgets of a specific kind
 */
export function getWidgetsOfKind(kind: 'Resource' | 'Action'): string[] {
  return Object.entries(metadataRegistry)
    .filter(([_, meta]) => meta.kind === kind)
    .map(([type, _]) => type);
}

/**
 * Validate widget can emit an action
 */
export function canEmitAction(widgetType: string, actionType: string): boolean {
  const meta = getWidgetMetadata(widgetType);
  if (!meta || !meta.mutable) return false;
  return meta.allowedActions
    ? meta.allowedActions.includes(actionType as any)
    : false;
}
