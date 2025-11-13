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
} from '../schemas';

describe('Widget Schema Validation', () => {
  it('should validate a simple Text widget', () => {
    const widget = {
      type: 'Text',
      kind: 'Resource',
      value: 'Hello World'
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Text');
    expect(result.kind).toBe('Resource');
    expect(result.value).toBe('Hello World');
    expect(result.size).toBe('md'); // default
  });

  it('should validate a Frame with children', () => {
    const widget = {
      type: 'Frame',
      kind: 'Resource',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'Text',
          kind: 'Resource',
          value: 'Test'
        }
      ]
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Frame');
    expect(result.kind).toBe('Resource');
    expect(result.children).toHaveLength(1);
  });

  it('should validate an Amount widget', () => {
    const widget = {
      type: 'Amount',
      kind: 'Resource',
      value: 150000,
      currency: 'NGN'
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Amount');
    expect(result.kind).toBe('Resource');
    expect(result.value).toBe(150000);
    expect(result.currency).toBe('NGN');
    expect(result.showCurrency).toBe(true); // default
  });

  it('should validate a KeyValueRow with nested value', () => {
    const widget = {
      type: 'KeyValueRow',
      kind: 'Resource',
      label: 'Total Amount',
      value: {
        type: 'Amount',
        kind: 'Resource',
        value: 150000,
        currency: 'NGN'
      }
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('KeyValueRow');
    expect(result.kind).toBe('Resource');
    expect(result.label).toBe('Total Amount');
    expect(result.value.type).toBe('Amount');
  });

  it('should reject invalid widget type', () => {
    const widget = {
      type: 'InvalidType',
      kind: 'Resource',
      value: 'Test'
    };

    expect(() => validateWidget(widget)).toThrow();
  });

  it('should reject missing required fields', () => {
    const widget = {
      type: 'Text',
      kind: 'Resource'
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
      kind: 'Resource',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'FrameHeader',
          kind: 'Resource',
          title: 'Payment Batch',
          expandable: true
        },
        {
          type: 'Row',
          kind: 'Resource',
          align: 'between',
          children: [
            {
              type: 'Text',
              kind: 'Resource',
              value: 'BATCH-2024-001',
              size: 'lg',
              weight: 'semibold'
            },
            {
              type: 'Badge',
              kind: 'Resource',
              label: 'Queued',
              variant: 'warning'
            }
          ]
        },
        {
          type: 'Divider',
          kind: 'Resource',
          spacing: 'md'
        },
        {
          type: 'KeyValueList',
          kind: 'Resource',
          gap: 'md',
          items: [
            {
              type: 'KeyValueRow',
              kind: 'Resource',
              label: 'Total Amount',
              value: {
                type: 'Amount',
                kind: 'Resource',
                value: 150000,
                currency: 'NGN'
              }
            },
            {
              type: 'KeyValueRow',
              kind: 'Resource',
              label: 'Recipients',
              value: {
                type: 'Text',
                kind: 'Resource',
                value: '5'
              }
            }
          ]
        }
      ]
    };

    const result = validateWidget(widget);
    expect(result.type).toBe('Frame');
    expect(result.kind).toBe('Resource');
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

describe('Widget Kind Field', () => {
  it('should validate Resource widget kind', () => {
    const widget = {
      type: 'Frame',
      kind: 'Resource',
      size: 'md'
    };

    const result = validateWidget(widget);
    expect(result.kind).toBe('Resource');
  });

  it('should validate Action widget kind', () => {
    const widget = {
      type: 'Button',
      kind: 'Action',
      label: 'Click me'
    };

    const result = validateWidget(widget);
    expect(result.kind).toBe('Action');
  });

  it('should reject widgets with wrong kind', () => {
    const widget = {
      type: 'Frame',
      kind: 'InvalidKind',
      size: 'md'
    };

    expect(() => validateWidget(widget)).toThrow();
  });

  it('should reject widgets without kind', () => {
    const widget = {
      type: 'Frame',
      size: 'md'
    };

    expect(() => validateWidget(widget)).toThrow();
  });
});
