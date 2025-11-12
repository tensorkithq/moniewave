/**
 * Badge Primitive
 *
 * Status indicator badge.
 */

import { cn } from '@/lib/utils';
import { Badge as BadgeUI } from '@/components/ui/badge';
import type { BadgeProps, RendererProps } from '../types';

export function Badge({
  label,
  variant = 'default',
  size = 'sm',
  visible = true,
  id,
  testId,
  aria,
}: BadgeProps & RendererProps) {
  if (!visible) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  // Map our variant names to shadcn/ui badge variants
  const variantMap = {
    default: 'default',
    secondary: 'secondary',
    success: 'default',
    warning: 'default',
    danger: 'destructive',
    outline: 'outline',
  } as const;

  const customColorClasses = {
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };

  const mappedVariant = variantMap[variant];
  const customClass = variant === 'success' || variant === 'warning'
    ? customColorClasses[variant]
    : '';

  return (
    <BadgeUI
      id={id}
      data-testid={testId}
      variant={mappedVariant}
      className={cn('widget-badge', sizeClasses[size], customClass)}
      {...aria}
    >
      {label}
    </BadgeUI>
  );
}
