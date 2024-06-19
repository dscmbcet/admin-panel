import { EventShort } from "@/models/event/event-short";
import { Event } from "@/models/event/event";

export default function convertEventToEventShort(event: Event): EventShort {
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