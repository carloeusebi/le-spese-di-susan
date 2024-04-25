<script lang="ts" setup>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/vue';
import {useMonths} from '@/composables/useMonths';
import {computed, ref} from 'vue';
import {Expense, Month} from '@/types/types';
import {useExpensesStore} from '@/stores/expenses';
import {format} from 'date-fns';
import {it} from 'date-fns/locale';

const STARTING_MONTH = import.meta.env.VITE_STARTING_MONTH;
const STARTING_YEAR = import.meta.env.VITE_STARTING_YEAR;

const months = useMonths().populateArray(STARTING_MONTH, STARTING_YEAR);
const selectedMonth = ref<Month>(months.at(0) as Month);

const compareWith = (m1: Month, m2: Month) => {
  return m1.label === m2.label;
};

const store = useExpensesStore();
const expenses = computed(() => store.thisMonthExpenses(selectedMonth.value));
// noinspection JSUnusedAssignment
const calculateTotal = (expenses: Expense[]) => expenses.reduce((total, expense) => total += Number(expense.amount), 0);
const monthTotalExpenditure = computed(() => calculateTotal(expenses.value));
const monthToSplitTotal = computed(() => calculateTotal(expenses.value.filter(expense => expense.toSplit)));
const monthToSplitHalved = computed(() => monthToSplitTotal.value / 2);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-item>
        <ion-select
          v-model="selectedMonth"
          :compare-with="compareWith"
          label="Scegli un mese"
          placeholder="Scegli il mese"
        >
          <ion-select-option v-for="month in months" :key="month" :value="month">{{ month.label }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-text class="ion-padding-vertical ion-padding-horizontal ion-text-center w-full">
            <div>Totale mese:</div>
            <div>{{ monthTotalExpenditure.toFixed(2) }}€</div>
          </ion-text>
        </ion-col>
        <ion-col>
          <ion-text class="ion-padding-vertical ion-padding-horizontal ion-text-center w-full">
            <div>Da dividere:</div>
            <div>
              {{ monthToSplitTotal.toFixed(2) }}€
              ({{ monthToSplitHalved.toFixed(2) }}€)
            </div>
          </ion-text>
        </ion-col>
      </ion-row>
    </ion-header>
    <ion-content>
      <ion-row>
        <ion-list v-if="expenses.length" class="w-full">
          <template v-for="expense in expenses" :key="expense.id">
            <router-link :to="`/expense/${expense.id}`">
              <ion-card class="expense-card">
                <ion-card-header>
                  <ion-card-title>{{ expense.title }}</ion-card-title>
                  <ion-card-subtitle>{{ format((expense as Expense).date, 'd LLLL', {locale: it}) }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <div class="expense-amount">{{ Number(expense.amount).toFixed(2) }} €</div>
                  <div class="ion-text-end">{{ expense.type }}</div>
                </ion-card-content>
              </ion-card>
            </router-link>
          </template>
        </ion-list>
        <ion-text v-else class="no-data ion-padding-vertical">
          Nessuna spesa registrata per questo mese
        </ion-text>
      </ion-row>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-padding-vertical ion-justify-content-center">
        <ion-button router-direction="forward" router-link="/create" size="large">Aggiungi una spesa</ion-button>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
.w-full {
  width: 100%;
}

.expense-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-card .expense-amount {
  font-size: 1.3rem;
}

.no-data {
  flex-grow: 1;
  text-align: center;
  font-size: .8rem;
}
</style>
