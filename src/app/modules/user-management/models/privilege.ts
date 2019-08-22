export class Privilege {
    id: string;
    name: string;
    unique_tag: string;
    description: string;
    created_dt: Date;
    created_by: string;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    group_id: string;
    pages_id: string
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    download: boolean;
}