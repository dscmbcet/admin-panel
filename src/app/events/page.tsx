"use client";
import { ReactNode, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import firebase_app from "../../lib/firebase/config";
import { Event } from "@/models/event/event";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  Copy,
  Edit,
  Edit2,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropdownWithOptions from "@/components/ui/dropdown";

import { Input } from "@/components/ui/input";
import { EventType } from "@/models/event/event-type.d";
import { EventStatus } from "@/models/event/event-status.d";

import React from "react";
import { EventShort } from "@/models/event/event-short";

function convertEventToEventShort(event: Event): EventShort {
  const {
    id,
    name,
    imageURL,
    description_short,
    start_date,
    status,
    category,
    type,
    iteration,
  } = event;

  const eventShort: EventShort = {
    id,
    name,
    imageURL,
    description_short,
    start_date,
    status,
    category,
    type,
  };

  return eventShort;
}

import { EventCategory } from "@/models/event/event-category";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UniqueIdentifier } from "@dnd-kit/core";
import Sortable from "@/components/ui/sortable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { EventSchedule } from "@/models/event/event-schedule";

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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  const [eventsShort, setEventsShort] = useState<EventShort[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);

  const [isNewEvent, setIsNewEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const db = getFirestore(firebase_app);
        const eventsCollection = collection(db, "events");
        const shortEventRef = doc(db, "data", "events");
        const shortEvents = await getDoc(shortEventRef);
        const shortEventsData = shortEvents.data();
        if (shortEventsData !== undefined)
          setEventsShort(Object.values(shortEventsData["events"]));
        const querySnapshot = await getDocs(eventsCollection);
        const fetchedEvents = querySnapshot.docs.map((doc) => doc.data());
        setEvents(fetchedEvents as Event[]);
        setLoading(false);
      } catch (error) {
        setError("Error fetching events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (event: any, isNew: boolean) => {
    setIsNewEvent(isNew);
    setEditMode(true);
    setEditedEvent({
      ...event,
      category: Array.isArray(event.category) ? event.category : [],
    });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getFirestore(firebase_app);
      const newId = `event-${editedEvent!.name}-123`;

      const eventRef = doc(db, "events", isNewEvent ? newId : editedEvent!.id);
      const shortEventRef = doc(db, "data", "events");

      // Update event with new data
      if (isNewEvent === true) {
        await setDoc(eventRef, { ...editedEvent, id: newId });
      } else await updateDoc(eventRef, { ...editedEvent });

      const shortEvent: EventShort = convertEventToEventShort(editedEvent!);

      await updateDoc(shortEventRef, {
        [`events.${isNewEvent ? newId : editedEvent!.id}`]: isNewEvent
          ? {
              ...shortEvent,
              id: newId,
            }
          : shortEvent,
      });
      // Fetch updated events
      const updatedEvents = isNewEvent
        ? [{ ...editedEvent!, id: newId }, ...events]
        : events.map((event) =>
            event.id === editedEvent!.id ? editedEvent! : event
          );

      const updatedShortEvents = eventsShort.map((event) =>
        event.id === shortEvent.id ? shortEvent : event
      );
      setEvents(updatedEvents);
      setEventsShort(updatedShortEvents);
      setEditMode(false);
      setEditedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const db = getFirestore(firebase_app);
      const eventRef = doc(db, "events", eventId);
      const shortEventRef = doc(db, "data", "events");

      await deleteDoc(eventRef);

      await updateDoc(shortEventRef, {
        [`events.${eventId}`]: deleteField(),
      });

      setEvents(events.filter((event) => event.id != eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  function titleCase(str: string) {
    return str
      .split(" ")
      .map(function (val) {
        return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
      })
      .join(" ");
  }

  function createTestEvent(): Event {
    const event: Event = {
      schedule: [],
      description: "",
      skills: {},
      prerequisites: {},
      mentors: {},
      gallery: [],
      testimonials: {},
      sponsors: {},
      displayShedule: false,
      id: "test",
      name: "",
      imageURL: "",
      description_short: "",
      start_date: "",
      status: EventStatus.Upcoming,
      category: [],
      type: EventType.Virtual,
    };
    return event;
  }

  const handleCancel = () => {
    setEditMode(false);
    setEditedEvent(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: ColumnDef<EventShort>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description_short",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {(row.getValue("description_short") as string).substring(0, 100)}
          {(row.getValue("description_short") as string).length > 100
            ? "..."
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {new Date(Number(row.getValue("start_date"))).toLocaleDateString()}
        </div>
      ),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className="font-medium"
          variant={
            row.getValue("status") === "ongoing"
              ? "default"
              : row.getValue("status") === "upcoming"
              ? "secondary"
              : row.getValue("status") === "cancelled"
              ? "destructive"
              : "outline"
          }
        >
          {row.getValue("status") as string}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          className="font-medium text-nowrap"
          variant={
            row.getValue("type") === "in-person" ? "default" : "secondary"
          }
        >
          {row.getValue("type") as string}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Categories",
      cell: ({ row }) => (
        <div className="flex gap-2 flex-wrap">
          {(
            row.getValue("category") as Array<{
              id: string;
              label: string;
            }>
          ).map((category, index) => (
            <Badge
              key={index}
              className="font-medium text-nowrap"
              variant={"secondary"}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(event, false)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(event.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(event.id)}>
                Delete
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      {JSON.stringify(eventsShort)}

      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button onClick={() => handleEdit(createTestEvent(), true)}>
            Create Event
          </Button>
        </div>

        <div className="bg-white">
          <DataTable columns={columns} data={eventsShort} />
        </div>
      </div>

      {editMode && editedEvent && (
        <Sheet open={editMode && editedEvent != null}>
          {/* <DialogTrigger>Open</DialogTrigger> */}

          <SheetContent className="w-[900px] h-full flex flex-col">
            <SheetHeader>
              <SheetTitle>Edit Event</SheetTitle>
              <SheetDescription>{`Modify your event`}</SheetDescription>
            </SheetHeader>

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

              <Schedule schedule={editedEvent!.schedule} />

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

            <SheetFooter>
              <div className="flex justify-end gap-2">
                <Button onClick={handleSubmit}>Save</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export function NewScheduleDialogue({
  children,
  addSchedule,
}: {
  children: ReactNode | ReactNode[];
  addSchedule: (scheduleItem: EventSchedule) => void;
}) {
  const [newScheduleItem, setNewScheduleitem] = useState<EventSchedule>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    display: true,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "name")
      setNewScheduleitem({
        ...newScheduleItem,
        name: value,
      });
    else if (name === "description")
      setNewScheduleitem({
        ...newScheduleItem,
        description: value,
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a day</DialogTitle>
          <DialogDescription>Add a day to your schedule</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue="Day 1"
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue="Enter a random description"
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => addSchedule(newScheduleItem)}>
            Save Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Schedule({ schedule }: { schedule: EventSchedule[] }) {
  interface ScheduleItem {
    item: EventSchedule;
    id: string;
  }

  const [editedSchedule, setEditedSchedule] = useState<ScheduleItem[]>(
    schedule != undefined
      ? schedule.map((item, index) => {
          return { item: item, id: index.toString() };
        })
      : []
  );

  function addSchedule(scheduleItem: EventSchedule) {
    setEditedSchedule([
      ...editedSchedule,
      {
        item: scheduleItem,
        id: editedSchedule.length.toString(),
      },
    ]);
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

  return (
    <label className="block mb-4">
      <div className="flex justify-between">
        <span className="font-bold">Schedule</span>
        <NewScheduleDialogue addSchedule={addSchedule}>
          <Button variant="outline">Add Day</Button>
        </NewScheduleDialogue>
      </div>

      <Sortable
        items={editedSchedule != undefined ? editedSchedule : []}
        renderItems={(item, index) => (
          <div className="mt-2 p-4 border w-full flex gap-4 items-start rounded-lg">
            <GripVertical width={16} height={16} />
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                <p className="text-xs">{`Slot ${index + 1}`}</p>
                <p>{item.item.name}</p>
              </div>
              <NewScheduleDialogue addSchedule={addSchedule}>
                <Edit2 width={16} height={16} />
              </NewScheduleDialogue>
            </div>
          </div>
        )}
        onDragEnd={handleDragEnd}
        onDelete={handleDelete}
      ></Sortable>
    </label>
  );
}
