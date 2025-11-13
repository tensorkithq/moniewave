/**
 * Sandbox Page
 *
 * Preview and test all widget primitives
 */

import { useState } from 'react';
import { WidgetRenderer } from '@/components/widgets/WidgetRenderer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WidgetNode } from '@/components/widgets/types';

// Example widget specifications
const widgetExamples: Record<string, { name: string; description: string; spec: WidgetNode }> = {
  frame: {
    name: 'Frame',
    description: 'Container for widgets with different sizes and padding',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'Text',
          value: 'This is a Frame container with medium size and padding',
          size: 'md',
        },
      ],
    },
  },
  text: {
    name: 'Text',
    description: 'Text component with various sizes, weights, and colors',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Extra small text', size: 'xs' },
        { type: 'Text', value: 'Small text', size: 'sm' },
        { type: 'Text', value: 'Medium text', size: 'md' },
        { type: 'Text', value: 'Large text', size: 'lg' },
        { type: 'Text', value: 'Extra large text', size: 'xl' },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Regular weight', weight: 'regular' },
        { type: 'Text', value: 'Medium weight', weight: 'medium' },
        { type: 'Text', value: 'Semibold weight', weight: 'semibold' },
        { type: 'Text', value: 'Bold weight', weight: 'bold' },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Default color', color: 'default' },
        { type: 'Text', value: 'Secondary color', color: 'secondary' },
        { type: 'Text', value: 'Emphasis color', color: 'emphasis' },
        { type: 'Text', value: 'Muted color', color: 'muted' },
        { type: 'Text', value: 'Danger color', color: 'danger' },
        { type: 'Text', value: 'Success color', color: 'success' },
        { type: 'Text', value: 'Warning color', color: 'warning' },
      ],
    },
  },
  button: {
    name: 'Button',
    description: 'Interactive button with variants and sizes',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Button Variants:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'ButtonGroup',
          orientation: 'vertical',
          gap: 'sm',
          buttons: [
            { type: 'Button', label: 'Default Button', variant: 'default' },
            { type: 'Button', label: 'Secondary Button', variant: 'secondary' },
            { type: 'Button', label: 'Outline Button', variant: 'outline' },
            { type: 'Button', label: 'Ghost Button', variant: 'ghost' },
            { type: 'Button', label: 'Destructive Button', variant: 'destructive' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Button Sizes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'sm',
          children: [
            { type: 'Button', label: 'Small', size: 'sm' },
            { type: 'Button', label: 'Medium', size: 'md' },
            { type: 'Button', label: 'Large', size: 'lg' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'With Icons:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'sm',
          children: [
            { type: 'Button', label: 'Left Icon', icon: 'arrow-left', iconPosition: 'left' },
            { type: 'Button', label: 'Right Icon', icon: 'arrow-right', iconPosition: 'right' },
          ],
        },
      ],
    },
  },
  layout: {
    name: 'Layout',
    description: 'Row, Column, and spacing primitives',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Row Layout (horizontal):', weight: 'semibold' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'md',
          children: [
            { type: 'Badge', label: 'Item 1', variant: 'default' },
            { type: 'Badge', label: 'Item 2', variant: 'secondary' },
            { type: 'Badge', label: 'Item 3', variant: 'success' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Column Layout (vertical):', weight: 'semibold' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Col',
          gap: 'sm',
          align: 'start',
          children: [
            { type: 'Text', value: 'First item', size: 'sm' },
            { type: 'Text', value: 'Second item', size: 'sm' },
            { type: 'Text', value: 'Third item', size: 'sm' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Row with alignment:', weight: 'semibold' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'between',
          gap: 'md',
          children: [
            { type: 'Text', value: 'Start', size: 'sm' },
            { type: 'Text', value: 'End', size: 'sm' },
          ],
        },
      ],
    },
  },
  badge: {
    name: 'Badge',
    description: 'Status badges with different variants',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Badge Variants:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'sm',
          wrap: true,
          children: [
            { type: 'Badge', label: 'Default', variant: 'default' },
            { type: 'Badge', label: 'Secondary', variant: 'secondary' },
            { type: 'Badge', label: 'Success', variant: 'success' },
            { type: 'Badge', label: 'Warning', variant: 'warning' },
            { type: 'Badge', label: 'Danger', variant: 'danger' },
            { type: 'Badge', label: 'Outline', variant: 'outline' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Badge Sizes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'sm',
          children: [
            { type: 'Badge', label: 'Small', size: 'sm', variant: 'default' },
            { type: 'Badge', label: 'Medium', size: 'md', variant: 'default' },
          ],
        },
      ],
    },
  },
  icon: {
    name: 'Icon',
    description: 'Icon primitives with different sizes and colors',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Icon Sizes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'md',
          children: [
            { type: 'Icon', name: 'check-circle', size: 'xs' },
            { type: 'Icon', name: 'check-circle', size: 'sm' },
            { type: 'Icon', name: 'check-circle', size: 'md' },
            { type: 'Icon', name: 'check-circle', size: 'lg' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Icon Colors:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'md',
          children: [
            { type: 'Icon', name: 'star', color: 'default' },
            { type: 'Icon', name: 'star', color: 'success' },
            { type: 'Icon', name: 'star', color: 'warning' },
            { type: 'Icon', name: 'star', color: 'danger' },
          ],
        },
      ],
    },
  },
  avatar: {
    name: 'Avatar',
    description: 'User avatars with fallbacks',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Avatar Sizes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'md',
          children: [
            { type: 'Avatar', fallback: 'JD', size: 'sm' },
            { type: 'Avatar', fallback: 'JD', size: 'md' },
            { type: 'Avatar', fallback: 'JD', size: 'lg' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Avatar Shapes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Row',
          align: 'start',
          gap: 'md',
          children: [
            { type: 'Avatar', fallback: 'AB', shape: 'circle' },
            { type: 'Avatar', fallback: 'CD', shape: 'square' },
          ],
        },
      ],
    },
  },
  amount: {
    name: 'Amount',
    description: 'Currency amount display',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Amount Sizes:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Col',
          gap: 'sm',
          children: [
            { type: 'Amount', value: 10000, currency: 'NGN', showCurrency: true, size: 'xs' },
            { type: 'Amount', value: 10000, currency: 'NGN', showCurrency: true, size: 'sm' },
            { type: 'Amount', value: 10000, currency: 'NGN', showCurrency: true, size: 'md' },
            { type: 'Amount', value: 10000, currency: 'NGN', showCurrency: true, size: 'lg' },
            { type: 'Amount', value: 10000, currency: 'NGN', showCurrency: true, size: 'xl' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        { type: 'Text', value: 'Amount Colors:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Col',
          gap: 'sm',
          children: [
            { type: 'Amount', value: 5000, currency: 'USD', showCurrency: true, color: 'default' },
            { type: 'Amount', value: 5000, currency: 'USD', showCurrency: true, color: 'success' },
            { type: 'Amount', value: -5000, currency: 'USD', showCurrency: true, color: 'danger' },
            { type: 'Amount', value: 5000, currency: 'USD', showCurrency: true, color: 'warning' },
          ],
        },
      ],
    },
  },
  time: {
    name: 'Time',
    description: 'Date and time formatting',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        { type: 'Text', value: 'Time Formats:', weight: 'semibold', size: 'md' },
        { type: 'Spacer', grow: 1 },
        {
          type: 'Col',
          gap: 'sm',
          children: [
            {
              type: 'Row',
              align: 'between',
              children: [
                { type: 'Text', value: 'Relative:', size: 'sm', color: 'muted' },
                { type: 'Time', value: new Date().toISOString(), format: 'relative' },
              ],
            },
            {
              type: 'Row',
              align: 'between',
              children: [
                { type: 'Text', value: 'Absolute:', size: 'sm', color: 'muted' },
                { type: 'Time', value: new Date().toISOString(), format: 'absolute' },
              ],
            },
            {
              type: 'Row',
              align: 'between',
              children: [
                { type: 'Text', value: 'Date only:', size: 'sm', color: 'muted' },
                { type: 'Time', value: new Date().toISOString(), format: 'date' },
              ],
            },
            {
              type: 'Row',
              align: 'between',
              children: [
                { type: 'Text', value: 'Time only:', size: 'sm', color: 'muted' },
                { type: 'Time', value: new Date().toISOString(), format: 'time' },
              ],
            },
          ],
        },
      ],
    },
  },
  keyvalue: {
    name: 'Key-Value',
    description: 'Key-value pairs and lists',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'KeyValueList',
          dividers: true,
          gap: 'sm',
          items: [
            {
              type: 'KeyValueRow',
              label: 'Customer',
              value: { type: 'Text', value: 'John Doe', weight: 'medium' },
            },
            {
              type: 'KeyValueRow',
              label: 'Email',
              value: { type: 'Text', value: 'john@example.com', color: 'secondary' },
            },
            {
              type: 'KeyValueRow',
              label: 'Status',
              value: { type: 'Badge', label: 'Active', variant: 'success' },
            },
            {
              type: 'KeyValueRow',
              label: 'Amount',
              value: { type: 'Amount', value: 25000, currency: 'NGN', showCurrency: true },
              emphasis: true,
            },
          ],
        },
      ],
    },
  },
  transaction: {
    name: 'Transaction Card',
    description: 'Complete transaction widget example',
    spec: {
      type: 'Frame',
      size: 'md',
      padding: 'md',
      children: [
        {
          type: 'FrameHeader',
          title: 'Transaction Details',
          expandable: true,
        },
        {
          type: 'Row',
          align: 'between',
          gap: 'md',
          children: [
            {
              type: 'Row',
              align: 'start',
              gap: 'md',
              children: [
                { type: 'Avatar', fallback: 'JD', size: 'md' },
                {
                  type: 'Col',
                  gap: 'none',
                  children: [
                    { type: 'Text', value: 'John Doe', weight: 'semibold', size: 'md' },
                    { type: 'Text', value: 'john@example.com', color: 'muted', size: 'sm' },
                  ],
                },
              ],
            },
            { type: 'Badge', label: 'Success', variant: 'success' },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        {
          type: 'KeyValueList',
          gap: 'sm',
          items: [
            {
              type: 'KeyValueRow',
              label: 'Reference',
              value: { type: 'Text', value: 'TRX-12345678', size: 'sm', color: 'secondary' },
            },
            {
              type: 'KeyValueRow',
              label: 'Date',
              value: { type: 'Time', value: new Date().toISOString(), format: 'absolute' },
            },
            {
              type: 'KeyValueRow',
              label: 'Amount',
              value: {
                type: 'Amount',
                value: 50000,
                currency: 'NGN',
                showCurrency: true,
                color: 'success',
                weight: 'semibold',
              },
              emphasis: true,
            },
          ],
        },
        { type: 'Divider', spacing: 'md' },
        {
          type: 'ButtonGroup',
          orientation: 'horizontal',
          gap: 'sm',
          buttons: [
            { type: 'Button', label: 'View Receipt', variant: 'default', fullWidth: true },
            { type: 'Button', label: 'Refund', variant: 'outline', fullWidth: true },
          ],
        },
      ],
    },
  },
};

export default function Sandbox() {
  const [selectedWidget, setSelectedWidget] = useState('frame');

  const handleAction = (action: any, ctx: any) => {
    console.log('Widget action:', action, ctx);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Widget Sandbox</h1>
          <p className="text-muted-foreground">
            Preview and test all available widget primitives
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget Selector */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Widgets</h2>
              <Tabs
                orientation="vertical"
                value={selectedWidget}
                onValueChange={setSelectedWidget}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1">
                  {Object.entries(widgetExamples).map(([key, example]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="w-full justify-start data-[state=active]:bg-accent"
                    >
                      <div className="text-left">
                        <div className="font-medium">{example.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {example.description}
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </Card>
          </div>

          {/* Widget Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">
                  {widgetExamples[selectedWidget].name}
                </h2>
                <p className="text-muted-foreground">
                  {widgetExamples[selectedWidget].description}
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-muted/50 flex justify-center items-start min-h-[300px]">
                <WidgetRenderer
                  spec={widgetExamples[selectedWidget].spec}
                  options={{ onAction: handleAction }}
                />
              </div>
            </Card>

            {/* JSON Spec */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Widget Specification</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(widgetExamples[selectedWidget].spec, null, 2)}
              </pre>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
