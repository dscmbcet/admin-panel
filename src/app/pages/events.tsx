"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import firebase_app from "../../lib/firebase/config";
import "./events.css";
import { Event } from "@/models/event/event";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { EventType } from "@/models/event/event-type.d";
import { EventStatus } from "@/models/event/event-status.d";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editedEvent, setEditedEvent] = useState<any>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const db = getFirestore(firebase_app);
        const eventsCollection = collection(db, "events");
        const querySnapshot = await getDocs(eventsCollection);
        const fetchedEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    setSelectedEvent(event);
    setEditedEvent({
      ...event,
      category: Array.isArray(event.category) ? event.category : [],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, valueAsDate } = e.target;
    if (name === "category") {
      setEditedEvent((prevState: any) => ({
        ...prevState,
        [name]: value.split(",").map((item) => item.trim()),
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
      const newEventId = `event-${selectedEvent.name}-123`;
      const { id, ...eventDetails } = selectedEvent;
      if (isNewEvent === true)
        setSelectedEvent({
          ...eventDetails,
          id: newEventId,
        });

      const eventRef = doc(db, "events", selectedEvent.id);
      // Update event with new data
      isNewEvent === true
        ? await setDoc(eventRef, editedEvent)
        : await updateDoc(eventRef, editedEvent);
      // Fetch updated events
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? editedEvent : event
      );
      setEvents(updatedEvents);
      setEditMode(false);
      setSelectedEvent(null);
      setEditedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
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
    setSelectedEvent(null);
    setEditedEvent(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: ColumnDef<Event>[] = [
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
          {(row.getValue("category") as Array<string>).map(
            (category, index) => (
              <Badge
                key={index}
                className="font-medium text-nowrap"
                variant={"secondary"}
              >
                {category}
              </Badge>
            )
          )}
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

              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Events</h1>
      <Button onClick={() => handleEdit(createTestEvent(), true)}>
        Create Event
      </Button>
      <DataTable columns={columns} data={events} />

      {editMode && selectedEvent && (
        <Dialog open={editMode && selectedEvent}>
          {/* <DialogTrigger>Open</DialogTrigger> */}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>{`Modify your event`}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <label className="block mb-4">
                <span className="font-bold">Name</span>
                <Input
                  type="text"
                  name="name"
                  value={editedEvent.name}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Description</span>
                <Input
                  type="text"
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Description Short</span>
                <Input
                  type="text"
                  name="description_short"
                  value={editedEvent.description_short}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Start Date</span>
                <Input
                  type="date"
                  name="start_date"
                  defaultValue={new Date(Number(editedEvent.start_date))
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
              <label className="block mb-4">
                <span className="font-bold">Image URL</span>
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editedEvent.imageURL}
                    alt="image"
                    className="w-full h-auto"
                  />
                }
                <input
                  type="text"
                  name="imageURL"
                  value={editedEvent.imageURL}
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
                  selectedValue={editedEvent.status}
                  onChange={(value) =>
                    setEditedEvent({ ...editedEvent, status: value })
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
                  selectedValue={editedEvent.type}
                  onChange={(value) =>
                    setEditedEvent({ ...editedEvent, type: value })
                  }
                  label="Select Type"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Categories</span>
                <Input
                  type="text"
                  name="category"
                  value={
                    Array.isArray(editedEvent.category)
                      ? editedEvent.category.join(", ")
                      : ""
                  }
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
            </form>

            <DialogFooter>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* {editMode && selectedEvent && (
        <div className="edit-form-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="edit-form bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-4">
                <span className="font-bold">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={editedEvent.name}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Description:</span>
                <input
                  type="text"
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Description Short:</span>
                <input
                  type="text"
                  name="description_short"
                  value={editedEvent.description_short}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Start Date:</span>
                <input
                  type="text"
                  name="start_date"
                  value={new Date(
                    Number(editedEvent.start_date)
                  ).toLocaleDateString()}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Image URL:</span>
                <input
                  type="text"
                  name="imageURL"
                  value={editedEvent.imageURL}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Status:</span>
                <input
                  type="text"
                  name="status"
                  value={editedEvent.status}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Type:</span>
                <input
                  type="text"
                  name="type"
                  value={editedEvent.type}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <span className="font-bold">Categories:</span>
                <input
                  type="text"
                  name="category"
                  value={
                    Array.isArray(editedEvent.category)
                      ? editedEvent.category.join(", ")
                      : ""
                  }
                  onChange={handleChange}
                  className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Events;
