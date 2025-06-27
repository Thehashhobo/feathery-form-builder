// types.ts
export type FormComponentType = "heading" | "text" | "email" | "phone" | "button";

export interface FormComponent {
  id: string; // unique instance ID
  type: FormComponentType;
  props?: Record<string, any>;
}

export interface TrayElement {
  id: string;                  // Unique ID for drag system
  type: FormComponentType;     // Component type for componentRegistry
  displayName: string;         // Main display text for both tray and canvas
  description?: string;        // Tooltip description
  icon?: string;               // Custom icon for tray
  placeholder?: string;        // Custom placeholder for input fields only
}

// Extended FormComponent for canvas items
export interface CanvasFormComponent extends FormComponent {
  displayName?: string; // Display name from the tray element
  placeholder?: string; // Custom placeholder text
}
