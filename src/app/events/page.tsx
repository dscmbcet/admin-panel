"use client";
import { useState } from "react";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import firebase_app from "../../lib/firebase/config";
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

import React from "react";
import { EventShort } from "@/models/event/event-short";

import getDefaultEvent from "./utils/get-default-event";
import useFetchEventShorts from "@/hooks/fetch-event-shorts";
import EventForm from "./components/EventForm";

export default function Events() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [eventShort, setEventShort] = useState<EventShort | null>(null);

  const [isNewEvent, setIsNewEvent] = useState(false);

  const { eventsShort, loading, error, refetchEventShorts } =
    useFetchEventShorts();

  const handleEdit = (event: EventShort | null, isNew: boolean) => {
    setEventShort(event);
    setIsNewEvent(isNew);
    setEditMode(true);
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
      refetchEventShorts();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const closeEventForm = () => {
    setEditMode(false);
    setEventShort(null);
    refetchEventShorts();
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
              <DropdownMenuItem
                onClick={() => {
                  setEventShort(event);
                  handleEdit(event, false);
                }}
              >
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
    <div className="container mx-auto mt-8 max-w-full">
      {/* {JSON.stringify(eventsShort)} */}

      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button onClick={() => handleEdit(null, true)}>Create Event</Button>
        </div>

        <div className="bg-white">
          <DataTable columns={columns} data={eventsShort} />
        </div>
      </div>

      <EventForm
        open={editMode}
        eventId={eventShort?.id ?? ""}
        closeEventForm={closeEventForm}
        isNewEvent={isNewEvent}
      ></EventForm>
    </div>
  );
}
