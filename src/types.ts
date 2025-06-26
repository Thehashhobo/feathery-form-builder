// types.ts
export type FormComponentType = "heading" | "text" | "email" | "phone" | "button";

export interface FormComponent {
  id: string; // unique instance ID
  type: FormComponentType;
  props?: Record<string, any>;
}
