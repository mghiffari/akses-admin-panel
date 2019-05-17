export class Notification {
    id: string;
    is_deleted: boolean;
    aks_adm_article_id: string;
    title: string;
    schedule_sending: Date;
    edited_date: Date;
    edited_by: string;
    total_users: number;
    content: string;
    scheduled_flg: boolean;
    is_editable: boolean;
}