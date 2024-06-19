import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sortable from "@/components/ui/sortable";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import { EventSchedule } from "@/models/event/event-schedule";
import getDateString from "@/utils/date-string";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit2, GripVertical } from "lucide-react";
import { useState } from "react";

interface ScheduleItem {
  item: EventSchedule;
  id: string;
}

interface ScheduleProps {
  schedule: EventSchedule[];
  getSchedule: (schedule: EventSchedule[]) => void;
}

export default function ScheduleField({
  schedule,
  getSchedule,
}: ScheduleProps) {
  console.log(schedule);
  const [editedSchedule, setEditedSchedule] = useState<ScheduleItem[]>(
    schedule !== undefined
      ? schedule.map((item, index) => {
          return { item: item, id: index.toString() };
        })
      : []
  );

  const [showSchedule, setShowSchedule] = useState(false);

  function addSchedule(scheduleItem: EventSchedule, id?: string) {
    console.log(id);
    setEditedSchedule(
      [
        ...editedSchedule.filter((item) => item.id != id),
        {
          item: scheduleItem,
          id: id ?? editedSchedule.length.toString(),
        },
      ].sort((item_a, item_b) => Number(item_a.id) - Number(item_b.id))
    );
    console.log(editedSchedule);
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
            getSchedule(
              editedSchedule.map((scheduleItem) => scheduleItem.item)
            );
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

export function NewScheduleDialogue({
  // children,
  addSchedule,
  closeDialogue,
  schedule,
}: {
  // children: ReactNode | ReactNode[];
  addSchedule: (scheduleItem: EventSchedule, id?: string) => void;
  closeDialogue: () => void;
  schedule: ScheduleItem | null;
}) {
  const isNewSchedule: boolean = schedule === null;

  const [newScheduleItem, setNewScheduleitem] = useState<EventSchedule>(
    isNewSchedule
      ? {
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          display: true,
        }
      : schedule!.item
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, valueAsDate } = e.target;
    if (name === "name" || name === "description")
      setNewScheduleitem({
        ...newScheduleItem,
        [name]: value,
      });
    else if (name === "start_date" || name === "end_date")
      setNewScheduleitem({
        ...newScheduleItem,
        [name]: valueAsDate?.getTime().toString(),
      });
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a day</DialogTitle>
          <DialogDescription>Add a day to your schedule</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* {JSON.stringify(newScheduleItem)} */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Day 1"
              value={newScheduleItem.name}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Enter a random description"
              value={newScheduleItem.description}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <DateTimePicker
              initialDate={new Date(Number(newScheduleItem.start_date))}
              onSelect={(date) =>
                handleChange({
                  target: {
                    name: "start_date",
                    valueAsDate: date,
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            ></DateTimePicker>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <DateTimePicker
              initialDate={new Date(Number(newScheduleItem.end_date))}
              onSelect={(date) =>
                handleChange({
                  target: {
                    name: "end_date",
                    valueAsDate: date,
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            ></DateTimePicker>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={closeDialogue}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              addSchedule(newScheduleItem, schedule?.id);
              closeDialogue();
            }}
          >
            Save Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
