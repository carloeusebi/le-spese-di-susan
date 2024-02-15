import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {Expense, Month} from "@/types/types";

export const useExpensesStore = defineStore('expenses', {
    state: () => ({
        expenses: useLocalStorage<Expense[]>('expenses', []),
    }),

    actions: {
        saveExpense(expense: Expense) {
            this.expenses.push(expense);
        },
        thisMonthExpenses(month: Month) {
            return this.expenses;
        }
    }
})