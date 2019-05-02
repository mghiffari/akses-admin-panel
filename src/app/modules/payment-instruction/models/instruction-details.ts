export class InstructionDetails {
    id: string;
    list_id: string;
    created_dt: Date;
    created_by: string;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    order: number;
    content: string;
    instruction_list: {
        icon: string,
        grp_title: string;
    }
}