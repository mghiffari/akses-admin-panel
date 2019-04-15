import { CSProdCompComp } from './cs-prod-comp-comp';

//credit simulation product component
export class CSProductComp{
    id: string;
    prod_id: string;
    component_id: string;
    created_by: string;
    created_dt: Date;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    component: CSProdCompComp;
}