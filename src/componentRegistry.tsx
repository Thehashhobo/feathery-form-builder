// componentsMap.tsx
import React from "react";
import type { FormComponentType } from "./types.ts";

interface ComponentProps {
  displayName?: string;  // The main display text
  placeholder?: string;  // Only for input fields - overrides displayName as placeholder
}

export const componentRegistry: Record<FormComponentType, React.FC<ComponentProps>> = {
  heading: ({ displayName = "Heading" }) => (
    <h3>{displayName}</h3>
  ),
  text: ({ displayName = "Text Input", placeholder }) => (
    <input 
      type="text" 
      placeholder={placeholder || displayName} 
      readOnly 
    />
  ),
  email: ({ displayName = "Email", placeholder }) => (
    <input 
      type="email" 
      placeholder={placeholder || displayName} 
      readOnly 
    />
  ),
  phone: ({ displayName = "Phone", placeholder }) => (
    <input 
      type="tel" 
      placeholder={placeholder || displayName} 
      readOnly 
    />
  ),
  button: ({ displayName = "Button" }) => (
    <button type="button" disabled>
      {displayName}
    </button>
  ),
};
