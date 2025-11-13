/**
 * Widget Type System
 *
 * Exports all widget type definitions, schemas, and utilities
 */

export {
  // Enums
  WidgetType,

  // Constants
  WIDGET_TYPE_PREFIX,

  // Interfaces
  type WidgetCapabilities,
  type ActionWidgetConfig,
  type ResourceWidgetConfig,
  type WidgetTypeMetadata,

  // Schemas
  WidgetTypeSchema,
  WidgetCapabilitiesSchema,
  ActionWidgetConfigSchema,
  ResourceWidgetConfigSchema,
  WidgetTypeMetadataSchema,

  // Type guards
  isResourceWidget,
  isActionWidget,

  // Validation
  validateWidgetMetadata,

  // Utilities
  getWidgetName,
  parseWidgetName,
  createWidgetMetadata,
} from './widget-types';

export * from './tool-metadata';
