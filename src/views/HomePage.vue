<script lang="ts" setup>
import {
  IonButton,
  IonContent,
  IonFooter,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import {useMonths} from "@/composables/useMonths";
import {ref} from "vue";
import {Month} from "@/types/types";
import {useExpensesStore} from "@/stores/expenses";

const STARTING_YEAR = 2024;
const STARTING_MONTH = 0 // January

const months = useMonths(STARTING_MONTH, STARTING_YEAR).reverse();
const selectedMonth = ref<Month>(months.at(0) as Month);

const compareWith = (m1: Month, m2: Month) => {
  return m1.label === m2.label
}

const store = useExpensesStore();
const expenses = store.thisMonthExpenses(selectedMonth.value);
</script>

<template>
  <ion-page>
    <ion-content fullscreen>
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
      <ion-list>
        <ion-item v-for="(expense,i) in expenses" :key="i">
          {{ expense.amount }}
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-padding-vertical ion-justify-content-center">
        <router-link to="/create">
          <ion-button>Aggiungi una spesa</ion-button>
        </router-link>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>
