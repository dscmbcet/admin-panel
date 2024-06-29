import { EventSchedule } from "@/models/event/event-schedule.d";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface ScheduleItem {
  item: EventSchedule;
  id: string;
}

export default function NewScheduleDialogue({
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
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    addSchedule(newScheduleItem, schedule?.id);
    closeDialogue();
  };

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
            {}
            <DateTimePicker
              initialDate={
                Number(newScheduleItem.start_date) !== 0
                  ? new Date(Number(newScheduleItem.start_date))
                  : undefined
              }
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
              initialDate={
                Number(newScheduleItem.end_date) !== 0
                  ? new Date(Number(newScheduleItem.end_date))
                  : undefined
              }
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
          <Button onClick={(e) => handleSubmit(e)}>Save Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
