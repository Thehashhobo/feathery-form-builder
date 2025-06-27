import React from "react";
import type { FormComponentType } from "./types.ts";

interface ComponentProps {
  displayName?: string;  // The main display text
  placeholder?: string;  // Only for input fields - overrides displayName as placeholder
  value?: string;        // Current input value
  onChange?: (value: string) => void; // Input change handler
  onClick?: () => void;  // Button click handler
  disabled?: boolean;    // Whether the input is disabled
}

// Helper function to determine autocomplete attribute
const getAutoCompleteAttribute = (displayName: string, placeholder: string, fieldType: string) => {
  const fieldText = (displayName + ' ' + placeholder).toLowerCase();
  
  if (fieldType === 'email') return 'email';
  if (fieldType === 'tel') return 'tel';
  
  // Text field auto-detection
  if (fieldText.includes('first name') || fieldText.includes('given name')) return 'given-name';
  if (fieldText.includes('last name') || fieldText.includes('family name') || fieldText.includes('surname')) return 'family-name';
  if (fieldText.includes('full name') || fieldText.includes('name')) return 'name';
  // cam be extended to include more fields (address, city, etc.)
  
  return 'off'; // Default to no autocomplete for unrecognized fields
};

// Component registry mapping component types to React components
export const componentRegistry: Record<FormComponentType, React.FC<ComponentProps>> = {
  heading: ({ displayName = "Heading" }) => (
    <h3>{displayName}</h3>
  ),
  text: ({ displayName = "Text Input", placeholder, value, onChange, disabled }) => {
    const autoComplete = getAutoCompleteAttribute(displayName, placeholder || '', 'text');
    return (
      <input 
        type="text" 
        name={displayName.toLowerCase().replace(/\s+/g, '-')}
        autoComplete={autoComplete}
        placeholder={placeholder || displayName} 
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    );
  },
  email: ({ displayName = "Email", placeholder, value, onChange, disabled }) => (
    <input 
      type="email" 
      name="email"
      autoComplete="email"
      placeholder={placeholder || displayName} 
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    />
  ),
  phone: ({ displayName = "Phone", placeholder, value, onChange, disabled }) => (
    <input 
      type="tel" 
      name="phone"
      autoComplete="tel"
      placeholder={placeholder || displayName} 
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    />
  ),
  button: ({ displayName = "Button", onClick, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {displayName}
    </button>
  ),
};
