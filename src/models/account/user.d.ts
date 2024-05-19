import {Individual} from "../entity/individual";
import {AccountStatus} from "./account-status";
import {AccountType} from "./account-type"

export interface User extends Omit<Individual, 'sponsorships'>
{
    id:string,
    join_date: string,
    status: AccountStatus,
    type: AccountType,
    individualId?: string,
}