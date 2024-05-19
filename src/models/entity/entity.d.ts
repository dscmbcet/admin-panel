import { Socials } from "../socials";
import { Sponsorship } from "../sponsorship";

export interface Entity
{
    id:string,
    name:string,
    imageURL?: string,
    description?: string,
    socials?: Socials
    sponsorships?: {[id:string]:Sponsorship},
}