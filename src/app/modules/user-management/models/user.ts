export class User {
    id: string;
    firstname: string;
    lastname: string;
    created_dt: Date;
    created_by: string;
    modified_dt: Date;
    modified_by: string;
    status: string;
    is_deleted: boolean;
    pgroup: any;
}

export class UserForm {
    id: string;
    firstname: string;
    lastname: string;
    created_dt: Date;
    created_by: string;
    modified_dt: Date;
    modified_by: string;
    status: string;
    is_deleted: boolean;
    groupId: string;
}