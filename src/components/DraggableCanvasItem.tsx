import { useDraggable } from "@dnd-kit/core";
import { componentRegistry } from "../componentRegistry";
import type { CanvasFormComponent } from "../types";

interface DraggableCanvasItemProps {
  component: CanvasFormComponent;
  value?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  disabled?: boolean;
  isPreviewMode?: boolean;
}

export function DraggableCanvasItem({ component, value, onChange, onClick, disabled, isPreviewMode }: DraggableCanvasItemProps) {

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ 
      id: component.id,
      data: { 
        type: 'canvas-item',
        component 
      }
    });

  const Element = componentRegistry[component.type];

  // Dynamic classes for canvas items
  const canvasClasses = [
    "canvas-item",
    `type-${component.type}`,
    isDragging ? "dragging" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={setNodeRef}
      {...(!isPreviewMode ? listeners : {})}
      {...(!isPreviewMode ? attributes : {})}
      className={canvasClasses}
      aria-label={`${component.displayName || component.type} form element`}
      aria-roledescription="placed form element"
      title={`${component.displayName || component.type} (${component.type})`}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        cursor: isPreviewMode ? 'default' : 'grab'
      }}
    >
      <div className="canvas-item-content">
        <Element 
          displayName={component.displayName}
          placeholder={component.placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
