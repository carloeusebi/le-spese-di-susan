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

    const addRow = async (expense: Expense) => {
        const date = new Date(expense.date);
        const tab = `${date.getFullYear()} Expenses`;
        const url = `${sheetBestUrl}/tabs/${tab}`;

        if (!expense.toSplit || !expense.amount) {
            return;
        }

        const payload = {
            M: date.getMonth() + 1,
            D: date.getDate(),
            Expense: expense.title,
            Amount: (expense.amount / 2),
            Primary: mapType(expense.type),
            Notes: expense.description,
        };

        await axios.post(url, payload);
    };

    const updateRow = async (expense: Expense) => {

    };

    return {addRow, updateRow};
};