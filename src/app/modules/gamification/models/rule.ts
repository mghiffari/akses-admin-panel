export class Rule{
    id: string;
    created_by: string;
    created_dt: Date;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    reward: number;
    probability: number;
    blended: number;
    floor: number;
    ceiling: number;
    status: boolean;
}
