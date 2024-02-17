import {Expense} from '@/types/types';
import axios from 'axios';

// https://sheet.best/admin
// https://www.freecodecamp.org/news/react-and-googlesheets/
export const useUpdateSheet = () => {
    const sheetBestUrl = import.meta.env.VITE_SHEET_BEST_URL;

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

    const getUrl = (year: number) => `${sheetBestUrl}/tabs/${year} Expenses`;

    const createPayload = (expense: Expense, date: Date) => {
        return {
            M: date.getMonth() + 1,
            D: date.getDate(),
            Expense: expense.title,
            Amount: ((expense.amount as number) / 2),
            Primary: mapType(expense.type),
            Notes: expense.description || 'Spesa aggiunta da Susan',
        };
    };

    const createFilters = (expense: Expense) =>
        `/search?M=${new Date(expense.date).getMonth() + 1}&D=${new Date(expense.date).getDate()}&Expense=${expense.title}&Amount=${(expense.amount! / 2).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

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
        const filters = createFilters(oldExpense);
        await axios.put(url + filters, payload);
    };

    const deleteRow = async (expense: Expense) => {
        const date = new Date(expense.date);
        const url = getUrl(date.getFullYear());
        const filters = createFilters(expense);
        await axios.delete(url + filters);
    };

    return {addRow, updateRow, deleteRow};
};