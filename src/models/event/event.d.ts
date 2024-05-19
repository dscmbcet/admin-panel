import { Individual } from "../entity/individual";
import { Sponsorship } from "../sponsorship";
import { Testimonial } from "../testimonial";
import { EventSchedule } from "./event-schedule";
import { EventShort } from "./event-short";
import { Skill } from "./skill";

interface Event extends EventShort{
    schedule: EventSchedule[],
    location?:string,
    description:string,
    
    skills:{[id:string]:Skill},
    prerequisites:{[id:string]:Skill}
    
    mentors:{[id:string]:Individual}
    
    gallery: string[],
    testimonials: {[id:string]:Testimonial},
    sponsors: {[id:string]:Sponsorship}
    
    displayShedule: boolean,
}
