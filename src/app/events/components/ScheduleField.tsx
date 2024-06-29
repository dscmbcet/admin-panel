import { Button } from "@/components/ui/button";

import Sortable from "@/components/ui/sortable";

import { EventSchedule } from "@/models/event/event-schedule";
import getDateString from "@/utils/date-string";
import { Edit2, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import NewScheduleDialogue, { ScheduleItem } from "./NewScheduleDialogue";

interface ScheduleProps {
  key: string;
  schedule: EventSchedule[];
  getSchedule: (schedule: EventSchedule[]) => void;
}

export default function ScheduleField({
  key,
  schedule,
  getSchedule,
}: ScheduleProps) {
  const [editedSchedule, setEditedSchedule] = useState<ScheduleItem[]>(
    schedule.map((scheduleItem, index) => {
      return {
        id: index.toString(),
        item: scheduleItem,
      };
    })
  );

  useEffect(() => {
    const newSchedule = editedSchedule.map((scheduleItem) => scheduleItem.item);

    if (JSON.stringify(schedule) !== JSON.stringify(newSchedule)) {
      getSchedule(newSchedule);
    }
  }, [editedSchedule, getSchedule, schedule]);

  const [showSchedule, setShowSchedule] = useState(false);

  function addSchedule(scheduleItem: EventSchedule, id?: string) {
    const newSchedule = [
      ...editedSchedule.filter((item) => item.id != id),
      {
        item: scheduleItem,
        id: id ?? editedSchedule.length.toString(),
      },
    ].sort((item_a, item_b) => Number(item_a.id) - Number(item_b.id));

    setEditedSchedule(newSchedule);
  }

  const handleDragEnd = (newOrder: ScheduleItem[]) => {
    setEditedSchedule(newOrder);
  };

  const handleDelete = (idToDelete: string) => {
    setEditedSchedule((prevItems) =>
      prevItems.filter((item) => item.id !== idToDelete)
    );
  };

  const toggleDialogue = () => {
    const oldSchedule = showSchedule;
    setShowSchedule(!oldSchedule);
  };

  const [currentSchedule, setCurrentSchedule] = useState<ScheduleItem | null>(
    null
  );

  return (
    <div>
      {showSchedule && (
        <NewScheduleDialogue
          schedule={currentSchedule}
          addSchedule={(scheduleItem, id) => {
            addSchedule(scheduleItem, id);
          }}
          closeDialogue={toggleDialogue}
        />
      )}

      <label className="flex flex-col mb-4 gap-2">
        <div className="flex justify-between">
          <span className="font-bold">Schedule</span>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentSchedule(null);
              toggleDialogue();
            }}
          >
            Add Day
          </Button>
        </div>
      </label>

      <div
        className="flex flex-col grow gap-2 box-border overflow-hidden w-full"
        onMouseEnter={(e) => e.preventDefault()}
      >
        <Sortable
          key={key}
          items={editedSchedule != undefined ? editedSchedule : []}
          renderItems={(item, index) => (
            <div className="p-4 border grow justify-start flex gap-4 rounded-lg overflow-auto">
              <GripVertical width={16} height={16} className="shrink-0" />
              <div className="flex grow min-w-0">
                <div className="flex flex-col grow min-w-0">
                  <p className="text-xs">{`Slot ${index + 1}`}</p>
                  <p>{item.item.name}</p>
                  <p className="text-sm grow box-border truncate min-w-0">
                    {item.item.description}
                  </p>
                  <p className="text-sm">
                    {getDateString(item.item.start_date, item.item.end_date)}
                  </p>
                </div>

                <Button
                  variant={"ghost"}
                  onClick={(e) => {
                    setCurrentSchedule(item);
                    toggleDialogue();
                  }}
                >
                  <Edit2 width={16} height={16} />
                </Button>
              </div>
            </div>
          )}
          onDragEnd={handleDragEnd}
          onDelete={handleDelete}
        ></Sortable>
      </div>
    </div>
  );
}
