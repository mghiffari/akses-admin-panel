export class TransactionReport{
    oid: string;
    va_number: string;
    customer_name: string;
    mobile_number: string;
    transaction_code: string;
    transaction_type: string;
    amount: number;
    penalty_fee: number;
    fee: number;
    bank_admin_fee: number;
    ppn: number;
    transaction_sequence: string;
    va_name: string;
    source_va: string;
    destination_va: string;
    transaction_date: Date;
}