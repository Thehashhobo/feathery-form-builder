// componentsMap.tsx
import React from "react";
import type { FormComponentType } from "./types";

export const componentRegistry: Record<FormComponentType, React.FC<any>> = {
  heading: () => <h3>Sign Up</h3>,
  text: () => <input type="text" placeholder="First Name" />,
  email: () => <input type="email" placeholder="Email Address" />,
  phone: () => <input type="tel" placeholder="Phone Number" />,
  button: () => <button>Submit</button>,
};
