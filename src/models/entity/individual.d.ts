import { EntityType } from "./entity-type";
import { Entity } from "./entity";
import { Role } from "./role/role";
import { InstituteRole } from "./role/institute-role";
import { Skill } from "../event/skill";
import { ReferralSource } from "./referralSource";

export interface Individual extends Entity
{
    entityType:EntityType.Individual,
    preferred_name?: string,
    pronouns: string,
    gender: Gender
    email: string,
    number: string,
    skills: {[id:string]:Skill}
    roles:(Role|InstituteRole)[],
    referralSource: ReferralSource|string
}