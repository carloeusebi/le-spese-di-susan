<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script lang="ts" setup>
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {onMounted} from 'vue';
import {useExpensesStore} from '@/stores/expenses';

const {purgeExpenses} = useExpensesStore();

onMounted(() => {
  purgeExpenses();
});
</script>
