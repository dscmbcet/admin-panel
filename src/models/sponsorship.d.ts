import { Socials } from "./socials"
import { EventShort } from "./event/event-short"
import { Individual } from "./entity/individual"
import { Organisation } from "./entity/organisation"

interface Sponsorship
{
    id: string,
    type: string,
    description: string,
    event?: EventShort
    sponsor?: Individual|Organisation
}