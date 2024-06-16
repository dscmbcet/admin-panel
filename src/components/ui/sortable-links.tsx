// SortableLinks.jsx
import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Item {
  id: string;
  name: string;
}

interface SortableLinkCardProps {
  id: Item;
  onDelete: (id: string) => void;
  renderItems: (item: Item) => React.ReactNode;
}

const SortableLinks: FC<SortableLinkCardProps> = ({
  id,
  onDelete,
  renderItems,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleButtonClick = () => {
    onDelete(id.id);
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex relative ${
        isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      {...attributes}
      {...listeners}
    >
      {renderItems(id)}
      {/* <div
        className={`flex relative ${
          isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
        {...attributes}
        {...listeners}
      >
        {renderItems(id)}
        <div className="flex justify-center items-center gap-4">
          <button
            className="hidden group-hover:block"
            onClick={handleButtonClick}
          >
            <svg
              className="text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <button
            {...attributes}
            {...listeners}
            className={` ${
              isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
            aria-describedby={`DndContext-${id.id}`}
          >
            <GripVertical width={20} height={20}></GripVertical>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default SortableLinks;
