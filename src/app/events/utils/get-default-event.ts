import { Event } from "@/models/event/event";
import { EventStatus } from "@/models/event/event-status.d";
import { EventType } from "@/models/event/event-type.d";

export default function getDefaultEvent(): Event {
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