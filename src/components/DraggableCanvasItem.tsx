import { useDraggable } from "@dnd-kit/core";
import { componentRegistry } from "../componentRegistry";
import type { CanvasFormComponent } from "../types";

interface DraggableCanvasItemProps {
  component: CanvasFormComponent;
}

export function DraggableCanvasItem({ component }: DraggableCanvasItemProps) {
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

  // Get display name if available, fallback to type
  const displayText = component.displayName || component.type;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={canvasClasses}
      aria-label={`${displayText} form element`}
      aria-roledescription="placed form element"
      title={`${displayText} (${component.type})`} // Tooltip showing both display name and type
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div className="canvas-item-content">
        <Element 
          displayName={component.displayName}
          placeholder={component.placeholder}
        />
        <div className="canvas-item-label">{displayText}</div>
      </div>
    </div>
  );
}
