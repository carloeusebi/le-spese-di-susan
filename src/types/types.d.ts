import {ExpenseType} from '@/consts/expenseTypes';

export interface Month {
  label: string;
  month: number;
  year: number;
}

export interface Expense {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: ExpenseType;
  toSplit: boolean;
  description: string;
}

export interface ExpenseForm extends Expense {
  amount: number | undefined;
}
