import { useDraggable } from "@dnd-kit/core";
import type { TrayElement } from "../types";

interface DraggableTrayItemProps {
  element: TrayElement;
}

export function DraggableTrayItem({ element }: DraggableTrayItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ 
      id: element.id, // Unique tray element ID
      data: { 
        type: 'tray-item',
        componentType: element.type, // The actual form component type
        displayName: element.displayName,
        trayElement: element
      }
    });

  // Dynamic classes based on type and drag state
  const trayClasses = [
    "element-placeholder",
    `type-${element.type}`,
    isDragging ? "dragging" : "",
  ].filter(Boolean).join(" ");

  // Default icon mapping, but allow custom icons
  const getIcon = (element: TrayElement) => {
    if (element.icon) return element.icon;
    
    const defaultIcons: Record<string, string> = {
      heading: "📄",
      text: "📝",
      email: "📧",
      phone: "📞",
      button: "🔘"
    };
    return defaultIcons[element.type] || "📝";
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={trayClasses}
      aria-label={`${element.displayName} form element template`}
      aria-roledescription="form element template"
      title={element.description} // Tooltip
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div className="tray-item-content">
        <div className="tray-item-icon">{getIcon(element)}</div>
        <div className="tray-item-label">{element.displayName}</div>
      </div>
    </div>
  );
}
