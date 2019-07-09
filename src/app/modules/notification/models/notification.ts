export class Notification {
    id: string;
    is_deleted: boolean;
    link_type: string;
    link_id: string;
    title: string;
    schedule_sending: Date;
    edited_date: Date;
    edited_by: string;
    total_users: number;
    content: string;
    scheduled_flg: boolean;
    is_editable: boolean;
    large_icon: string;
    large_image: string;
    recipient_all_flg: boolean;
    recipient_list: string;
    sent: number;
    clicked: number
}