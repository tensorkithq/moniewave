/**
 * Widget Primitives Tests
 *
 * Example tests for widget primitives and renderer.
 */

import { describe, it, expect } from 'vitest';
import {
  validateWidget,
  safeValidateWidget,
  ActionSchema,
  validateWidgetTypeWithMetadata,
} from '../schemas';
import {
  getWidgetMetadata,
  isValidWidgetType,
  getWidgetsOfKind,
  canEmitAction,
} from '../registry';
import { WIDGET_METADATA } from '../types';

describe('Widget Schema Validation', () => {
  it('should validate a simple Text widget', () => {
    const widget = {
      type: 'Text',
      value: 'Hello World'
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Text');
    expect(result.value).toBe('Hello World');
    expect(result.size).toBe('md'); // default
  });

  it('should validate a Frame with children', () => {
    const widget = {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'Text',
          value: 'Test'
        }
      ]
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Frame');
    expect(result.children).toHaveLength(1);
  });

  it('should validate an Amount widget', () => {
    const widget = {
      type: 'Amount',
      value: 150000,
      currency: 'NGN'
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Amount');
    expect(result.value).toBe(150000);
    expect(result.currency).toBe('NGN');
    expect(result.showCurrency).toBe(true); // default
  });

  it('should validate a KeyValueRow with nested value', () => {
    const widget = {
      type: 'KeyValueRow',
      label: 'Total Amount',
      value: {
        type: 'Amount',
        value: 150000,
        currency: 'NGN'
      }
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('KeyValueRow');
    expect(result.label).toBe('Total Amount');
    expect(result.value.type).toBe('Amount');
  });

  it('should reject invalid widget type', () => {
    const widget = {
      type: 'InvalidType',
      value: 'Test'
    };

    expect(() => validateWidget(widget)).toThrow();
  });

  it('should reject missing required fields', () => {
    const widget = {
      type: 'Text'
      // missing value
    };

    expect(() => validateWidget(widget)).toThrow();
  });

  it('should use safe validation', () => {
    const widget = {
      type: 'InvalidType'
    };

    const result = safeValidateWidget(widget);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it('should validate a complete payment widget', () => {
    const widget = {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'FrameHeader',
          title: 'Payment Batch',
          expandable: true
        },
        {
          type: 'Row',
          align: 'between',
          children: [
            {
              type: 'Text',
              value: 'BATCH-2024-001',
              size: 'lg',
              weight: 'semibold'
            },
            {
              type: 'Badge',
              label: 'Queued',
              variant: 'warning'
            }
          ]
        },
        {
          type: 'Divider',
          spacing: 'md'
        },
        {
          type: 'KeyValueList',
          gap: 'md',
          items: [
            {
              type: 'KeyValueRow',
              label: 'Total Amount',
              value: {
                type: 'Amount',
                value: 150000,
                currency: 'NGN'
              }
            },
            {
              type: 'KeyValueRow',
              label: 'Recipients',
              value: {
                type: 'Text',
                value: '5'
              }
            }
          ]
        }
      ]
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Frame');
    expect(result.children).toHaveLength(4);
  });
});

describe('Widget Component Registry', () => {
  it('should have all primitives registered', async () => {
    const { getWidget, hasWidget } = await import('../registry');

    // Import primitives to register them
    await import('../primitives');

    // Check layout primitives
    expect(hasWidget('Frame')).toBe(true);
    expect(hasWidget('FrameHeader')).toBe(true);
    expect(hasWidget('Row')).toBe(true);
    expect(hasWidget('Col')).toBe(true);
    expect(hasWidget('Spacer')).toBe(true);
    expect(hasWidget('Divider')).toBe(true);

    // Check content primitives
    expect(hasWidget('Text')).toBe(true);
    expect(hasWidget('Icon')).toBe(true);
    expect(hasWidget('Avatar')).toBe(true);
    expect(hasWidget('Amount')).toBe(true);
    expect(hasWidget('Time')).toBe(true);
    expect(hasWidget('Badge')).toBe(true);

    // Check interactive primitives
    expect(hasWidget('Button')).toBe(true);

    // Check pattern components
    expect(hasWidget('KeyValueRow')).toBe(true);
    expect(hasWidget('KeyValueList')).toBe(true);
    expect(hasWidget('ButtonGroup')).toBe(true);
  });

  it('should return undefined for unknown widget', async () => {
    const { getWidget } = await import('../registry');
    await import('../primitives');

    expect(getWidget('UnknownWidget')).toBeUndefined();
  });
});

describe('Widget Action Types', () => {
  it('should validate approve_tool action', () => {
    const action = {
      type: 'approve_tool',
      toolCallId: 'test-123'
    };

    const result = ActionSchema.parse(action);
    expect(result.type).toBe('approve_tool');
    expect(result.toolCallId).toBe('test-123');
  });

  it('should validate expand action', () => {
    const action = {
      type: 'expand',
      target: 'fullscreen'
    };

    const result = ActionSchema.parse(action);
    expect(result.type).toBe('expand');
    expect(result.target).toBe('fullscreen');
  });
});

describe('Widget Type Schema', () => {
  it('should classify widgets correctly', () => {
    const resources = getWidgetsOfKind('Resource');
    const actions = getWidgetsOfKind('Action');

    // Check Resource widgets
    expect(resources).toContain('Frame');
    expect(resources).toContain('Text');
    expect(resources).toContain('Row');
    expect(resources).toContain('Col');
    expect(resources).toContain('Spacer');
    expect(resources).toContain('Divider');
    expect(resources).toContain('Icon');
    expect(resources).toContain('Avatar');
    expect(resources).toContain('Amount');
    expect(resources).toContain('Time');
    expect(resources).toContain('Badge');
    expect(resources).toContain('KeyValueRow');
    expect(resources).toContain('KeyValueList');

    // Check Action widgets
    expect(actions).toContain('Button');
    expect(actions).toContain('ButtonGroup');

    // Verify counts
    expect(resources.length).toBe(14);
    expect(actions.length).toBe(2);
  });

  it('should validate widget metadata', () => {
    const frameMeta = getWidgetMetadata('Frame');
    expect(frameMeta).toBeDefined();
    expect(frameMeta?.kind).toBe('Resource');
    expect(frameMeta?.category).toBe('layout');
    expect(frameMeta?.mutable).toBe(false);
    expect(frameMeta?.description).toBe('Main widget container');

    const buttonMeta = getWidgetMetadata('Button');
    expect(buttonMeta).toBeDefined();
    expect(buttonMeta?.kind).toBe('Action');
    expect(buttonMeta?.category).toBe('interactive');
    expect(buttonMeta?.mutable).toBe(true);
    expect(buttonMeta?.allowedActions).toContain('approve_tool');
    expect(buttonMeta?.allowedActions).toContain('reject_tool');
  });

  it('should validate action targeting', () => {
    // Button can emit allowed actions
    expect(canEmitAction('Button', 'approve_tool')).toBe(true);
    expect(canEmitAction('Button', 'reject_tool')).toBe(true);
    expect(canEmitAction('Button', 'navigate')).toBe(true);
    expect(canEmitAction('Button', 'share')).toBe(true);
    expect(canEmitAction('Button', 'download')).toBe(true);
    expect(canEmitAction('Button', 'emit')).toBe(true);

    // Button cannot emit unknown actions
    expect(canEmitAction('Button', 'unknown_action')).toBe(false);

    // Resource widgets cannot emit actions
    expect(canEmitAction('Frame', 'approve_tool')).toBe(false);
    expect(canEmitAction('Text', 'navigate')).toBe(false);
    expect(canEmitAction('Badge', 'share')).toBe(false);
  });

  it('should reject Resource widgets with actions', () => {
    const spec = {
      type: 'Text',
      value: 'Click me',
      onClickAction: { type: 'approve_tool', toolCallId: '123' },
    };

    const result = validateWidgetTypeWithMetadata(spec);
    expect(result).toBe(false);
  });

  it('should accept Action widgets with allowed actions', () => {
    const spec = {
      type: 'Button',
      label: 'Approve',
      onClickAction: { type: 'approve_tool', toolCallId: '123' },
    };

    const result = validateWidgetTypeWithMetadata(spec);
    expect(result).toBe(true);
  });

  it('should reject Action widgets with disallowed actions', () => {
    const spec = {
      type: 'Button',
      label: 'Click me',
      onClickAction: { type: 'unknown_action', payload: {} },
    };

    const result = validateWidgetTypeWithMetadata(spec);
    expect(result).toBe(false);
  });

  it('should validate widget type existence', () => {
    expect(isValidWidgetType('Frame')).toBe(true);
    expect(isValidWidgetType('Button')).toBe(true);
    expect(isValidWidgetType('Text')).toBe(true);
    expect(isValidWidgetType('UnknownWidget')).toBe(false);
  });

  it('should have metadata for all 16 widgets', () => {
    const expectedWidgets = [
      // Layout
      'Frame',
      'FrameHeader',
      'Row',
      'Col',
      'Spacer',
      'Divider',
      // Content
      'Text',
      'Icon',
      'Avatar',
      'Amount',
      'Time',
      'Badge',
      // Interactive
      'Button',
      // Patterns
      'KeyValueRow',
      'KeyValueList',
      'ButtonGroup',
    ];

    expectedWidgets.forEach((widgetType) => {
      const meta = getWidgetMetadata(widgetType);
      expect(meta).toBeDefined();
      expect(meta?.kind).toBeDefined();
      expect(meta?.category).toBeDefined();
      expect(meta?.mutable).toBeDefined();
    });

    expect(Object.keys(WIDGET_METADATA).length).toBe(16);
  });

  it('should categorize widgets correctly', () => {
    // Layout category
    expect(getWidgetMetadata('Frame')?.category).toBe('layout');
    expect(getWidgetMetadata('Row')?.category).toBe('layout');
    expect(getWidgetMetadata('Col')?.category).toBe('layout');

    // Content category
    expect(getWidgetMetadata('Text')?.category).toBe('content');
    expect(getWidgetMetadata('Icon')?.category).toBe('content');
    expect(getWidgetMetadata('Amount')?.category).toBe('content');

    // Interactive category
    expect(getWidgetMetadata('Button')?.category).toBe('interactive');

    // Pattern category
    expect(getWidgetMetadata('KeyValueRow')?.category).toBe('pattern');
    expect(getWidgetMetadata('KeyValueList')?.category).toBe('pattern');
    expect(getWidgetMetadata('ButtonGroup')?.category).toBe('pattern');
  });
});
