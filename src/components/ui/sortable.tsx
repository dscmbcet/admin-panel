// Sortable.tsx
import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import SortableLinks from "./sortable-links";
import { EventSchedule } from "@/models/event/event-schedule";

interface ScheduleItem {
  item: EventSchedule;
  id: string;
}

interface SortableProps {
  items: ScheduleItem[];
  onDragEnd: (newOrder: ScheduleItem[]) => void;
  onDelete: (id: string) => void;
  renderItems: (item: ScheduleItem, index: number) => React.ReactNode;
}

const Sortable: React.FC<SortableProps> = ({
  items,
  onDragEnd,
  onDelete,
  renderItems,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);
      onDragEnd(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortableLinks
            key={item.id}
            id={{
              id: item.id,
              name: item.item.name,
            }}
            onDelete={onDelete}
            renderItems={() =>
              renderItems(
                {
                  item: item.item,
                  id: item.id,
                },
                index
              )
            }
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default Sortable;
