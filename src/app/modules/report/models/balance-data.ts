// Model of balance data
export class BalanceData {
    oid: string;
    vaNumber: string;
    firstname: string;
    lastname: string;
    mobileNumber: string;
    vaBalance: string;
    timestamp: string;
}

// Model of transaction list
export class TransBalanceData {
    id: string;
    created_dt: string;
    created_by: string;
    modified_dt: string;
    modified_by: string;
    is_deleted: boolean;
    account_id: string;
    debit_credit: string;
    fund_trx_code: string;
    fund_trx_sequences: string;
    fund_trx_date: string;
    fund_init_va_group: string;
    fund_init_va_no: string;
    fund_init_va_name: string;
    fund_dest_va_group: string;
    fund_dest_va_no: string;
    fund_dest_va_name: string;
    fund_bank_flag: string;
    fund_bi_code: string;
    fund_amt_va: number;
    fund_amt_fee: number;
    fund_amt_ppn: number;
    fund_amt_bank_adm: number;
    fund_send_status: string;
    fund_proses_status: string;
    no_kontrak: string;
    nama: string;
    no_angsuran: string;
    nilai_angsuran: string;
    nilai_denda: string;
    no_pengesahan: string;
    ca_code: string;
    szbranchid: string;
    biller_nominal_fee: string;
    biller_nominal_ppn: string;
    biller_nominal_pph: string;
    biller_trx_reffnum: string;
    biller_trx_status: string;
    transaction_type: string;
}