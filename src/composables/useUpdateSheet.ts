import {Expense} from '@/types/types';
import axios from 'axios';

/*
 * https://docs.sheetdb.io/
 */
export const useUpdateSheet = () => {
  const baseURL = `https://sheetdb.io/api/v1/${import.meta.env.VITE_SHEET_ID}`;

  const createPayload = (expense: Expense) => {
    return {
      id: expense.id,
      M: new Date(expense.date).getMonth() + 1,
      D: new Date(expense.date).getDate(),
      Expense: expense.title,
      Amount: ((expense.amount as number) / 2),
      Primary: expense.type.value,
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
