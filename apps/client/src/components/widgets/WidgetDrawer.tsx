/**
 * Widget Drawer Component
 *
 * A bottom drawer specifically designed for displaying widgets with:
 * - Max width: 428px
 * - Min height: 50% of viewport (expandable to 100%)
 * - Black background
 * - Gray-800 ring with 0.50 opacity
 * - Padding: 24px bottom, 12px left/right
 * - Border radius: lg
 */

import { useState } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface WidgetDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function WidgetDrawer({ open, onOpenChange, children }: WidgetDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        showHandle={false}
        className={cn(
          // Position and dimensions
          "fixed bottom-0 left-1/2 -translate-x-1/2",
          "max-w-[428px] w-full",
          isExpanded ? "h-screen" : "min-h-[50vh]",
          // Styling
          "bg-black",
          "rounded-t-lg",
          "ring-1 ring-gray-800/50",
          "border-0",
          // Padding
          "pb-6 px-3",
          // Animation
          "transition-all duration-300 ease-in-out",
          // Remove default margin-top
          "mt-0"
        )}
      >
        {/* Custom Header with Expand/Collapse and Close buttons */}
        <div className="flex items-center justify-between pt-4 pb-2 px-1">
          {/* Drag Handle (visual only) */}
          <div className="flex-1 flex justify-center">
            <div className="h-1.5 w-12 rounded-full bg-gray-700" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              aria-label={isExpanded ? "Collapse drawer" : "Expand drawer"}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Close Button */}
            <DrawerClose asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </DrawerClose>
          </div>
        </div>

        {/* Widget Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
