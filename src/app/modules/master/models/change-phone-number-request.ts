export class ChangePhoneNumberRequest {
    id: string;
    requested_dt: Date;
    cust_name: string;
    request_age_days: number;
    request_age_hours: number;
    request_age_minutes: number;
    old_phone: string;
    new_phone: string;
    action_by: string;
    action_dt: Date;
    status: string;
    action: string;
    remarks: string;
}