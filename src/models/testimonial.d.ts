import { Individual } from "./entity/individual";

export interface Testimonial
{
    id: string,
    content: string,
    individual: Individual,
    date: string,
}