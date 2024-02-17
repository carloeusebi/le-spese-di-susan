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

const CSVToJSON = (data: string, delimiter: string = ',') => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
      .slice(data.indexOf('\n') + 1)
      .split('\n')
      .map(v => {
        const values = v.split(delimiter);
        return titles.reduce((obj: Record<string, string>, title, index) => {
          obj[title] = values[index];
          return obj;
        }, {});
      });
};

onMounted(async () => {
  purgeExpenses();
  // const {data: csv} = await axios
  //     .get(`https://docs.google.com/spreadsheets/d/17PE9PIsyICw7c1w0dmNDY96QD0gD2CA7YZGhZg_k_Uc/export?format=csv&gid=1604146628`);
  // const json = CSVToJSON(csv);
  // console.log(json);
  // const res = await axios.post('https://sheet.best/api/sheets/b051d01b-7335-4efc-922c-f39309d96e94/tabs/2024 Expenses', {Amount: 33});
  // console.log(res.data);
});
</script>
