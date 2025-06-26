import "./App.css";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { componentRegistry } from "./componentRegistry";
import type { FormComponent } from "./types.ts";
import { v4 as uuidv4 } from "uuid";

const trayElements: FormComponent[] = [
  { id: "heading", type: "heading" },
  { id: "text", type: "text" },
  { id: "email", type: "email" },
  { id: "phone", type: "phone" },
  { id: "button", type: "button" },
];

function DraggableTrayItem({ type }: { type: FormComponent["type"] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ 
      id: type,
      data: { 
        type: 'tray-item',
        componentType: type 
      }
    });

  const Preview = componentRegistry[type];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="element-placeholder"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      <Preview />
    </div>
  );
}

function DraggableCanvasItem({ component }: { component: FormComponent }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ 
      id: component.id,
      data: { 
        type: 'canvas-item',
        component 
      }
    });

  const Element = componentRegistry[component.type];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Element />
    </div>
  );
}

function DroppableCell({
  id,
  component,
}: {
  id: string;
  component?: FormComponent;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    background: isOver ? "#ccf" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #ccc",
    padding: "8px",
    minHeight: "75px",
  };

  return (
    <div ref={setNodeRef} className="form-cell" style={style}>
      {component && <DraggableCanvasItem component={component} />}
    </div>
  );
}

function App() {
  const [canvasMap, setCanvasMap] = useState<Record<string, FormComponent>>({});

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;

    const dragData = active.data.current;
    const targetCellId = over.id;

    if (dragData?.type === 'tray-item') {
      // Dragging from tray - create new component
      setCanvasMap((prev) => ({
        ...prev,
        [targetCellId]: {
          id: uuidv4(),
          type: dragData.componentType,
        },
      }));
    } else if (dragData?.type === 'canvas-item') {
      // Dragging from canvas - move existing component
      const draggedComponent = dragData.component;
      
      // Find the source cell
      const sourceCellId = Object.keys(canvasMap).find(
        cellId => canvasMap[cellId]?.id === draggedComponent.id
      );

      if (sourceCellId && sourceCellId !== targetCellId) {
        setCanvasMap((prev) => {
          const newMap = { ...prev };
          
          // Remove from source cell
          delete newMap[sourceCellId];
          
          // Add to target cell (this will overwrite if target has a component)
          newMap[targetCellId] = draggedComponent;
          
          return newMap;
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="element-tray">
        {trayElements.map((el) => (
          <DraggableTrayItem key={el.type} type={el.type} />
        ))}
      </div>

      <div className="form-canvas">
        {Array.from({ length: 8 }).map((_, i) => {
          const cellId = `cell-${i}`;
          return (
            <DroppableCell
              key={cellId}
              id={cellId}
              component={canvasMap[cellId]}
            />
          );
        })}
      </div>
    </DndContext>
  );
}

export default App;
