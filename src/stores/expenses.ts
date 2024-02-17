import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {Expense, Month} from '@/types/types';
import {differenceInCalendarMonths} from 'date-fns';

export const useExpensesStore = defineStore('expenses', {
    state: () => ({
        nextId: useLocalStorage<number>('nextID', 1),
        expenses: useLocalStorage<Expense[]>('expenses', []),
    }),

    getters: {
        getNextId: (state) => state.nextId,
    },

    actions: {
        getById(id: number) {
            return this.expenses.find(expense => expense.id == id);
        },
        thisMonthExpenses(target: Month) {
            return this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === target.month && expenseDate.getFullYear() === target.year;
            }).sort((e1, e2) => new Date(e1.date) < new Date(e2.date) ? 1 : -1);
        },
        saveExpense(expense: Expense) {
            const index = this.expenses.findIndex(({id}) => id == expense.id);
            if (index !== -1) this._updateExpense(expense, index);
            else this._createExpense(expense);
        },
        deleteExpense(id: number) {
            this.expenses = [...this.expenses.filter(expense => expense.id != id)];
        },
        purgeExpenses() {
            const now = new Date();
            const lessThanTwoYears = (date: string) => differenceInCalendarMonths(now, new Date(date)) <= 24;
            this.expenses = [...this.expenses.filter(({date}) => lessThanTwoYears(date))];
        },
        _createExpense(expense: Expense) {
            this.expenses.push(expense);
            ++this.nextId;
        },
        _updateExpense(expense: Expense, index: number) {
            this.expenses[index] = {...expense};
        },
    },
});