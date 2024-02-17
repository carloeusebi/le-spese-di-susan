import {Expense, Row} from '@/types/types';
import axios from 'axios';

/*
 * https://sheetapi.rest/dashboard
 */
export const useUpdateSheet = () => {
    const sheetId = import.meta.env.VITE_SHEET_ID;

    const mapType = (type: string) => {
        switch (type) {
            case 'Casa':
                return 'Housing';
            case 'Salute':
                return 'Health';
            case 'Spesa':
                return 'Groceries';
            case 'Trasporto':
                return 'Transportation';
            case 'Animali':
                return 'Animals';
            case 'Fuori':
                return 'Out';
            case 'Piacere':
                return 'Leisure';
            case 'Vacanza':
                return 'Holiday';
            case 'Regali':
                return 'Gifts';
            case 'Altro':
                return 'OtherExpenses';
        }
    };

    const getUrl = (year: number) => `https://api.sheetapi.rest/api/v1/sheet/${sheetId}/tabs/${year} Expenses`;

    const createPayload = (expense: Expense, date: Date) => {
        return {
            M: date.getMonth() + 1,
            D: date.getDate(),
            Expense: expense.title,
            Amount: ((expense.amount as number) / 2),
            Primary: mapType(expense.type),
            Notes: expense.description ? 'Susan: ' + expense.description : 'Susan',
        };
    };

    const getIndex = async (expense: Expense, url: string) => {
        const {data: rows} = await axios.get<Row[]>(url);
        const date = new Date(expense.date);
        return rows.findIndex(row =>
            Number(row.M) === date.getMonth() + 1
            && Number(row.D) === date.getDate()
            && row.Expense === expense.title
            && row.Amount === (expense.amount! / 2).toFixed(2),
        );
    };

    const addRow = async (expense: Expense) => {
        const date = new Date(expense.date);
        const url = getUrl(date.getFullYear());
        const payload = createPayload(expense, date);
        await axios.post(url, payload);
    };

    const updateRow = async (expense: Expense, oldExpense: Expense) => {
        const date = new Date(expense.date);
        const url = getUrl(date.getFullYear());
        const payload = createPayload(expense, date);
        const index = await getIndex(oldExpense, url);
        if (index !== -1)
            await axios.patch(`${url}/${index}`, payload);
    };

    const deleteRow = async (expense: Expense) => {
        const date = new Date(expense.date);
        const url = getUrl(date.getFullYear());
        const index = await getIndex(expense, url);
        if (index !== -1)
            await axios.delete(`${url}/${index}`);
    };

    return {addRow, updateRow, deleteRow};
};