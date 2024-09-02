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

import useFetchSkills from "@/hooks/fetch-skills";
import { Skill } from "@/models/event/skill.d";
// import EventForm from "./components/EventForm";

export default function Events() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [isNewSkill, setIsNewSkill] = useState(false);

  const { skills, loading, error, refetchSkills } = useFetchSkills();

  const handleEdit = (skill: Skill | null, isNew: boolean) => {
    setSelectedSkill(skill);
    setIsNewSkill(isNew);
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
      refetchSkills();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const closeEventForm = () => {
    setEditMode(false);
    setSelectedSkill(null);
    refetchSkills();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: ColumnDef<Skill>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {(row.getValue("description_short") as string)?.substring(0, 100)}
          {(row.getValue("description_short") as string)?.length > 100
            ? "..."
            : ""}
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
                  setSelectedSkill(event);
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
          <h1 className="text-3xl font-bold">Skills</h1>
          <Button onClick={() => handleEdit(null, true)}>Add Skill</Button>
        </div>

        <div className="bg-white">
          <DataTable columns={columns} data={skills} />
        </div>
      </div>

      {/* <EventForm
        open={editMode}
        eventId={eventShort?.id ?? ""}
        closeEventForm={closeEventForm}
        isNewEvent={isNewEvent}
      ></EventForm> */}
    </div>
  );
}
