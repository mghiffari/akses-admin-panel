export class BalanceData {
    oid: string;
    vaNumber: string;
    name: string;
    phoneNumber: string;
    aksesPayBalance: number;
    timestamp: Date;
}

export class TransBalanceData {
    transCode: string;
    transDesc: string;
    amount: number;
    VANumberDest: string;
    sourceVANumber: string;
    transDate: Date;
    transSequence: string;
}