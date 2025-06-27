import { useDroppable } from "@dnd-kit/core";
import { DraggableCanvasItem } from "./DraggableCanvasItem";
import type { CanvasFormComponent } from "../types";

interface DroppableCellProps {
  id: string;
  component?: CanvasFormComponent;
}

export function DroppableCell({ id, component }: DroppableCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Determine CSS classes based on state
  const cellClasses = [
    "form-cell",
    component ? "has-component" : "",
    isOver ? (component ? "drag-over-occupied" : "drag-over-empty") : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={setNodeRef} className={cellClasses}>
      {component && <DraggableCanvasItem component={component} />}
    </div>
  );
}
