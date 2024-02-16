export interface Month {
    label: string;
    month: number;
    year: number;
}

export interface Expense {
    id: number;
    title: string;
    date: string;
    amount?: number;
    type: string;
    toSplit: boolean;
    description: string;
}