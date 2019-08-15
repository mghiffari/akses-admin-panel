import { Privilege } from './privilege';

export class RolePrivilege {
    id: string;
    name: string;
    description: string;
    created_dt: Date;
    created_by: string;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    privileges: Privilege[];
}