export interface Month {
    label: string;
    month: number;
    year: number;
}

export interface Expense {
    date: string;
    amount: number;
    type: string;
    description: string;
    dateObject?: Date;
}