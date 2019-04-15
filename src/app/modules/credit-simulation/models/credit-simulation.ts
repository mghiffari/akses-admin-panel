import { CSSubComp } from './cs-sub-comp';

//credit simulation
export class CreditSimulation{
    id: string;
    area_id: string;
    prod_id: string;
    tnr_3m: number;
    tnr_6m: number;
    tnr_9m: number;
    tnr_12m: number;
    tnr_15m: number;
    tnr_18m: number;
    tnr_21m: number;
    tnr_24m: number;
    tnr_30m: number;
    tnr_36m: number;
    tnr_42m: number;
    tnr_48m: number;
    tnr_54m: number;
    tnr_60m: number;
    tnr_1: number;
    tnr_2: number;
    tnr_3: number;
    tnr_4: number;
    tnr_5: number;
    component_id: string;
    created_by: string;
    created_dt: Date;
    modified_dt: Date;
    modified_by: string;
    is_deleted: boolean;
    component: CSSubComp;
    product: {name: any};
    area: {name: any};
}