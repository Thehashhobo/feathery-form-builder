import "./App.css";
import { 
  DndContext, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors,
  KeyboardSensor
} from "@dnd-kit/core";
import { useState } from "react";
import { DraggableTrayItem, DroppableCell, SubmissionsViewer } from "./components";
import type { TrayElement, CanvasFormComponent, FormData } from "./types";
import { mockBackendAPI } from "./api/mockBackend";
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
  // Configure sensors for multi-input support (mouse, touch, keyboard)
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay for touch devices to distinguish from scrolling
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);

  // Combine sensors for comprehensive input support
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [canvasMap, setCanvasMap] = useState<Record<string, CanvasFormComponent>>({});
  const [formData, setFormData] = useState<FormData>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Handle form field changes
  const handleFieldChange = (componentId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    console.log("Form submitted with data:", formData);
    
    // validation
    const errors: Record<string, string> = {};
    const formComponents = Object.values(canvasMap);
    
    formComponents.forEach(component => {
      const fieldValue = formData[component.id] || "";
      
      // Required field
      if (component.type !== 'button' && component.type !== 'heading' && !fieldValue.trim()) {
        errors[component.id] = `${component.displayName || component.type} is required`;
      }
      
      // Email validation
      if (component.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          errors[component.id] = 'Invalid email format';
        }
      }
      
      // Phone validation
      if (component.type === 'phone' && fieldValue) {
        const cleaned = fieldValue.replace(/\D/g, ''); // removes non-digits
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(cleaned)) {
          errors[component.id] = 'Phone format should be (555) 123-4567';
        }
      }
    });
    
    if (Object.keys(errors).length > 0) {
      alert('Please fix the following errors:\n' + Object.values(errors).join('\n'));
      return;
    }

    // Prepare form submission data
    const submissionData = {
      formId: 'dynamic-form-' + Date.now(),
      timestamp: new Date().toISOString(),
      fields: formComponents.map(component => ({
        id: component.id,
        type: component.type,
        label: component.displayName || component.type,
        value: formData[component.id] || ""
      }))
    };

    try {
      // Use mock backend API
      const result = await mockBackendAPI.submitForm(submissionData);
      
      if (result.status === 'success') {
        alert(`Form submitted successfully!\nSubmission ID: ${result.id}`);
        // Reset form
        setFormData({});
        // Trigger refresh for submissions viewer
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting form. Please try again.');
    }
  };

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
      const newComponentId = uuidv4();
      setCanvasMap((prev) => ({
        ...prev,
        [targetCellId]: {
          id: newComponentId,
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
        
        // Trigger success animation for moved items

      } 
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {/* Form Builder Controls */}
      <div className="form-builder-controls">
        <button 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="mode-toggle-btn"
        >
          {isPreviewMode ? "Edit Mode" : "Preview Mode"}
        </button>
        <SubmissionsViewer 
          refreshTrigger={refreshTrigger}
        />
      </div>

      <div className="element-tray">
        {trayElements.map((element) => (
          <DraggableTrayItem key={element.id} element={element} />
        ))}
      </div>

      <div className="form-canvas">
        {Array.from({ length: 8 }).map((_, i) => {
          const cellId = `cell-${i}`;
          const component = canvasMap[cellId];
          
          // For buttons, provide the form submission handler
          const handleClick = component?.type === 'button' ? handleFormSubmit : undefined;
          
          return (
            <DroppableCell
              key={cellId}
              id={cellId}
              component={component}
              value={component ? formData[component.id] || "" : ""}
              onChange={component ? (value) => handleFieldChange(component.id, value) : undefined}
              onClick={handleClick}
              disabled={!isPreviewMode}
              isPreviewMode={isPreviewMode}
            />
          );
        })}
      </div>
    </DndContext>
  );
}

export default App;
