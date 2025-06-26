import { useDraggable } from "@dnd-kit/core";

type Props = {
  id: string;
  type: "heading" | "text" | "email" | "phone" | "button";
};

export function DraggableFormElement({ id, type }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const renderElement = () => {
    switch (type) {
      case "heading":
        return <h3>Sign Up</h3>;
      case "text":
        return <input type="text" placeholder="First Name" />;
      case "email":
        return <input type="email" placeholder="Email Address" />;
      case "phone":
        return <input type="tel" placeholder="Phone Number" />;
      case "button":
        return <button>Submit</button>;
    }
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {renderElement()}
    </div>
  );
}
