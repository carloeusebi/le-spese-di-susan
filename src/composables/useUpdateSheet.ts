import {Expense} from '@/types/types';
import axios from 'axios';

/*
 * https://docs.sheetdb.io/
 */
export const useUpdateSheet = () => {
    const sheetId = import.meta.env.VITE_SHEET_ID;
    const baseURL = `https://sheetdb.io/api/v1/${sheetId}`;

    const createPayload = (expense: Expense) => {
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
        return {
            id: expense.id,
            M: new Date(expense.date).getMonth() + 1,
            D: new Date(expense.date).getDate(),
            Expense: expense.title,
            Amount: ((expense.amount as number) / 2),
            Primary: mapType(expense.type),
            Notes: expense.description ? 'Susan: ' + expense.description : 'Susan',
        };
    };

    const getSheetName = (date: string) => new Date(date).getFullYear() + ' Expenses';

    const addRow = async (expense: Expense) => {
        const payload = createPayload(expense);
        await axios.post(`${baseURL}?sheet=${getSheetName(expense.date)}`, payload);
    };

    const updateRow = async (expense: Expense, id: number) => {
        const payload = createPayload(expense);
        await axios.patch(`${baseURL}/id/${id}?sheet=${getSheetName(expense.date)}`, payload);
    };

    const deleteRow = async (expense: Expense) => {
        await axios.delete(`${baseURL}/id/${expense.id}?sheet=${getSheetName(expense.date)}`);
    };

    return {addRow, updateRow, deleteRow};
};