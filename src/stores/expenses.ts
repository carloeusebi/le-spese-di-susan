import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {Expense, Month} from '@/types/types';
import {differenceInCalendarMonths} from 'date-fns';
import {useUpdateSheet} from '@/composables/useUpdateSheet';

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
        async saveExpense(expense: Expense) {
            const index = this.expenses.findIndex(({id}) => id == expense.id);
            if (index !== -1) await this._updateExpense(expense, index);
            else await this._createExpense(expense);
        },
        async deleteExpense(expense: Expense) {
            this.expenses = [...this.expenses.filter(({id}) => expense.id != id)];
            await useUpdateSheet().deleteRow(expense);
        },
        purgeExpenses() {
            const now = new Date();
            const lessThanTwoYears = (date: string) => differenceInCalendarMonths(now, new Date(date)) <= 24;
            this.expenses = [...this.expenses.filter(({date}) => lessThanTwoYears(date))];
        },
        async _createExpense(expense: Expense) {
            this.expenses.push(expense);
            ++this.nextId;
            if (expense.toSplit) {
                await useUpdateSheet().addRow(expense);
            }
        },
        async _updateExpense(newExpense: Expense, index: number) {
            const updateSheet = useUpdateSheet();
            const oldExpense = this.expenses[index];
            this.expenses[index] = {...newExpense};

            if (oldExpense.toSplit && newExpense.toSplit)
                await updateSheet.updateRow(newExpense, oldExpense);
            else if (oldExpense.toSplit && !newExpense.toSplit)
                await updateSheet.deleteRow(oldExpense);
            else if (!oldExpense.toSplit && newExpense.toSplit)
                await updateSheet.addRow(newExpense);
        },
    },
});