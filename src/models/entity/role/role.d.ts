import { Organisation } from "../organisation";

export interface Role
{
    name: string,
    organisation: Organisation
    date_start: string,
    date_end: string,
}