import "./App.css";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { DraggableTrayItem, DroppableCell } from "./components";
import type { TrayElement, CanvasFormComponent } from "./types";
import { v4 as uuidv4 } from "uuid";

const trayElements: TrayElement[] = [
  { 
    id: "heading-main", 
    type: "heading", 
    displayName: "Sign Up",
    description: "Main page heading",
    icon: "📄",
  },
  { 
    id: "text-first-name", 
    type: "text", 
    displayName: "First Name",
    description: "First name input field",
    placeholder: "Enter your first name"
  },
  { 
    id: "text-last-name", 
    type: "text", 
    displayName: "Last Name",
    description: "Last name input field",
    placeholder: "Enter your last name"
  },
  { 
    id: "email-contact", 
    type: "email", 
    displayName: "Email",
    description: "Email address input",
    placeholder: "your.email@example.com"
  },
  { 
    id: "phone-mobile", 
    type: "phone", 
    displayName: "Phone",
    description: "Phone number input",
    placeholder: "(555) 123-4567"
  },
  { 
    id: "button-submit", 
    type: "button", 
    displayName: "Submit",
    description: "Submit form button",
  },

];

function App() {
  const [canvasMap, setCanvasMap] = useState<Record<string, CanvasFormComponent>>({});
  const handleDragEnd = (event: any) => {
    // active: the item being dragged
    // over: the target cell where the item is dropped
    const { active, over } = event;

    const dragData = active.data.current;
    // Handle dragging canvas items outside (removes from canvas)
    if (dragData?.type === 'canvas-item' && !over) {
      const draggedComponent = dragData.component;
      const sourceCellId = Object.keys(canvasMap).find(
        cellId => canvasMap[cellId]?.id === draggedComponent.id
      );
      
      if (sourceCellId) {
        setCanvasMap((prev) => {
          const newMap = { ...prev };
          delete newMap[sourceCellId];
          return newMap;
        });
      }
      return;
    }


    const targetCellId = over.id;

    // Dragging from tray - create new component
    if (dragData?.type === 'tray-item') {
      setCanvasMap((prev) => ({
        ...prev,
        [targetCellId]: {
          id: uuidv4(),
          type: dragData.componentType, // Use the actual form component type
          displayName: dragData.displayName, // Store the display name from tray
          placeholder: dragData.trayElement.placeholder,
        },
      }));
    } 

    // Dragging from canvas - move existing component
    else if (dragData?.type === 'canvas-item') {
      
      const draggedComponent = dragData.component;
      
      const sourceCellId = Object.keys(canvasMap).find(
        cellId => canvasMap[cellId]?.id === draggedComponent.id
      );
      // If source cell exists and is different from target, swap components
      if (sourceCellId && sourceCellId !== targetCellId) {
        setCanvasMap((prev) => {
          const newMap = { ...prev };
          const targetComponent = newMap[targetCellId];
          
          
          newMap[targetCellId] = draggedComponent;
          if (targetComponent) {
            newMap[sourceCellId] = targetComponent;
          } else {
            delete newMap[sourceCellId];
          }
          
          return newMap;
        });
      } 
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="element-tray">
        {trayElements.map((element) => (
          <DraggableTrayItem key={element.id} element={element} />
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
