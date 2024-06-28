import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "@/components/ui/multi-select";
import { EventShort } from "@/models/event/event-short";
import { Event } from "@/models/event/event";
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import convertEventToEventShort from "../utils/event-to-event-short";
import DropdownWithOptions from "@/components/ui/dropdown";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import useFetchEvent from "@/hooks/fetch-event";
import firebase_app from "@/lib/firebase/config";

import titleCase from "@/utils/title-case";
import { Sheet } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import getDefaultEvent from "../utils/get-default-event";
import ScheduleField from "./ScheduleField";
import { EventCategory } from "@/models/event/event-category.d";
import { EventType } from "@/models/event/event-type.d";
import { EventStatus } from "@/models/event/event-status.d";

interface EventFormProp {
  open: boolean;
  eventId: string;
  closeEventForm: any;
  isNewEvent: boolean;
}

export default function EventForm({
  open,
  eventId,
  closeEventForm,
  isNewEvent,
}: EventFormProp) {
  const skillOptions: EventCategory[] = [
    { label: "Web Dev", id: "web-dev" },
    { label: "Design", id: "design" },
    { label: "Remix", id: "remix" },
    { label: "Vite", id: "vite" },
    { label: "Nuxt", id: "nuxt" },
    { label: "Vue", id: "vue" },
    { label: "Svelte", id: "svelte" },
    { label: "Angular", id: "angular" },
    { label: "Ember", id: "ember" },
    { label: "Gatsby", id: "gatsby" },
    { label: "Astro", id: "astro" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    values?: MultiSelectOption[]
  ) => {
    const { name, value, valueAsDate } = e.target;
    if (name === "category") {
      setEditedEvent((prevState: any) => ({
        ...prevState,
        [name]: values?.map((value) => {
          return { id: value.value, label: value.label };
        }),
      }));
    } else if (name === "start_date") {
      setEditedEvent((prevState: any) => ({
        ...prevState,
        [name]: valueAsDate?.getTime().toString(),
      }));
    } else {
      setEditedEvent((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    event: Event,
    isNewEvent: boolean
  ) => {
    e.preventDefault();
    try {
      const db = getFirestore(firebase_app);
      const newId = `event-${event!.name}-123`;

      const eventRef = doc(db, "events", isNewEvent ? newId : event!.id);
      const shortEventRef = doc(db, "data", "events");

      console.log(JSON.stringify(event?.schedule));

      // Update event with new data
      if (isNewEvent === true) {
        await setDoc(eventRef, { ...event, id: newId });
      } else await updateDoc(eventRef, { ...event });

      const shortEvent: EventShort = convertEventToEventShort(event!);

      await updateDoc(shortEventRef, {
        [`events.${isNewEvent ? newId : event!.id}`]: isNewEvent
          ? {
              ...shortEvent,
              id: newId,
            }
          : shortEvent,
      });

      // setEditMode(false);
      setEditedEvent(null);
      closeEventForm();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const { event: existingEvent, loading, error } = useFetchEvent(eventId || "");

  const [editedEvent, setEditedEvent] = useState<Event | null>(existingEvent);

  useEffect(() => {
    if (isNewEvent) setEditedEvent(getDefaultEvent());
    else setEditedEvent(existingEvent);
  }, [existingEvent, isNewEvent]);

  return (
    <Sheet open={open}>
      <SheetContent className="w-[900px] h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetDescription>{`Modify your event`}</SheetDescription>
        </SheetHeader>
        {loading ? (
          <div>Loading...</div>
        ) : error && editedEvent === null ? (
          <div>Error: {error}</div>
        ) : isNewEvent ||
          (editedEvent !== undefined && editedEvent !== null) ? (
          <div className="w-full flex flex-col flex-grow h-full overflow-scroll">
            <label className="block mb-4">
              <span className="font-bold">Name</span>
              <Input
                type="text"
                name="name"
                value={editedEvent!.name}
                onChange={handleChange}
                className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Description</span>
              <Input
                type="text"
                name="description"
                value={editedEvent!.description}
                onChange={handleChange}
                className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Description Short</span>
              <Input
                type="text"
                name="description_short"
                value={editedEvent!.description_short}
                onChange={handleChange}
                className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Start Date</span>

              <DateTimePicker
                initialDate={new Date(Number(editedEvent?.start_date))}
                onSelect={(date) =>
                  handleChange({
                    target: {
                      name: "start_date",
                      valueAsDate: date,
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              ></DateTimePicker>
              <Input
                type="date"
                name="start_date"
                defaultValue={new Date(Number(editedEvent?.start_date))
                  .toLocaleDateString()
                  .split("/")
                  .reverse()
                  .join("-")}
                //   value={new Date(Number(editedEvent.start_date))
                //     .toLocaleDateString()
                //     .split("/")
                //     .reverse()
                //     .join("-")}
                onChange={handleChange}
                className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </label>
            {editedEvent!.schedule?.length ?? "nope"}
            {editedEvent!.name}

            <ScheduleField
              schedule={editedEvent!.schedule}
              getSchedule={(schedule) => {
                setEditedEvent({
                  ...editedEvent!,
                  schedule: schedule,
                });
              }}
            />

            <label className="block mb-4">
              <span className="font-bold">Image URL</span>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={editedEvent!.imageURL}
                  alt="image"
                  className="w-full h-auto"
                />
              }
              <input
                type="text"
                name="imageURL"
                value={editedEvent!.imageURL}
                onChange={handleChange}
                className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Status</span>
              <DropdownWithOptions
                options={Object.values(EventStatus).map((value) => ({
                  value,
                  label: titleCase(value.split("-").join(" ")),
                }))}
                selectedValue={editedEvent!.status}
                onChange={(value) =>
                  setEditedEvent({
                    ...editedEvent!,
                    status: value as EventStatus,
                  })
                }
                label="Select Status"
              />
            </label>

            <label className="block mb-4">
              <span className="font-bold">Type</span>
              <DropdownWithOptions
                options={Object.values(EventType).map((value) => ({
                  value,
                  label: titleCase(value.split("-").join(" ")),
                }))}
                selectedValue={editedEvent!.type}
                onChange={(value) =>
                  setEditedEvent({
                    ...editedEvent!,
                    type: value as EventType,
                  })
                }
                label="Select Type"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Categories</span>

              <MultiSelectDropdown
                options={editedEvent!.category
                  .concat(
                    skillOptions.filter(
                      (item2) =>
                        !editedEvent!.category.some(
                          (item1) => item1.id === item2.id
                        )
                    )
                  )
                  .map((option) => {
                    return { value: option.id, label: option.label };
                  })}
                values={editedEvent!.category.map((option) => {
                  return { value: option.id, label: option.label };
                })}
                onValuesChange={(options) =>
                  handleChange(
                    {
                      target: {
                        name: "category",
                      },
                    } as React.ChangeEvent<HTMLInputElement>,
                    options
                  )
                }
              />
            </label>
          </div>
        ) : (
          "null"
        )}

        <SheetFooter>
          <div className="flex justify-end gap-2">
            <Button onClick={(e) => handleSubmit(e, editedEvent!, isNewEvent)}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={closeEventForm}>
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
