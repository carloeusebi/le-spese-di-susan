<script lang="ts" setup>
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  onIonViewDidLeave,
} from "@ionic/vue";
import {reactive, ref} from "vue";
import {format} from "date-fns";
import {Expense} from "@/types/types";
import {useExpensesStore} from "@/stores/expenses";
import {useRouter} from "vue-router";

const store = useExpensesStore();
const router = useRouter();
const types = ['Casa', 'Salute', 'Spesa', 'Trasporto', 'Animali', 'Fuori', 'Piacere', 'Vacanza', 'Regali', 'Altro'];

const isDateInvalid = ref(false);
const isAmountInvalid = ref(false);
const isTypeInvalid = ref(false);

const form = reactive<Expense>({
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: 0,
  type: '',
  description: '',
});

const resetErrors = () => {
  isDateInvalid.value = false;
  isAmountInvalid.value = false;
  isTypeInvalid.value = false;
}

const resetForm = () => {
  form.date = format(new Date(), 'yyyy-MM-dd');
  form.amount = 0;
  form.type = '';
  form.description = '';
};

const validateDate = () => {
  const dateToValidate = new Date(form.date);
  const today = new Date();
  isDateInvalid.value = isNaN(dateToValidate.getMilliseconds()) || dateToValidate > today;
}

const validateAmount = () => {
  isAmountInvalid.value = !form.amount || isNaN(form.amount) || form.amount <= 0;
}

const validateType = () => {
  isTypeInvalid.value = !form.type;
}

const onSubmit = () => {
  resetErrors();
  validateDate();
  validateAmount();
  validateType();
  if (isDateInvalid.value || isAmountInvalid.value || isTypeInvalid.value) {
    return;
  }
  form.dateObject = new Date(form.date);
  store.saveExpense({...form});
  router.push('/home');
}

onIonViewDidLeave(() => {
  resetErrors();
  resetForm();
})

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-row class="ion-padding-vertical ion-padding-horizontal">
        <router-link to="/home">
          <ion-button size="small">
            Indietro
          </ion-button>
        </router-link>
      </ion-row>
    </ion-header>
    <ion-content class="ion-padding-vertical ion-padding-horizontal">
      <form id="form" @submit.prevent="onSubmit">
        <ion-input
            v-model="form.date"
            :class="{'ion-invalid ion-touched': isDateInvalid}"
            error-text="Amore ma che data hai messo?"
            label="Seleziona giorno"
            type="date"
            @ionBlur="validateDate"
            @ionInput="validateDate"
        />
        <ion-input
            v-model="form.amount"
            :class="{'ion-invalid ion-touched': isAmountInvalid}"
            error-text="Amore, sciocchina, ti sei scordata di mettere il prezzo :D"
            inputmode="decimal"
            label="Ammontare spesa €"
            min="0"
            step=".5"
            type="number"
            @ionBlur="validateAmount"
            @ionInput="validateAmount"
        />
        <ion-select
            v-model="form.type"
            :class="{'ion-invalid ion-touched': isTypeInvalid}"
            cancel-text="Annulla"
            interface="popover"
            label="Scegli la categoria"
            @ionChange="validateType"
            @ionDismiss="validateType"
        >
          <ion-select-option v-for="type in types" :key="type">{{ type }}</ion-select-option>
        </ion-select>
        <div v-if="isTypeInvalid" class="input-bottom sc-ion-input-md">
          <div class="sc-ion sc-ion-input-md" style="color: var(--ion-color-danger)">Amore, non hai scelto la
            categoria!
          </div>
        </div>
        <ion-textarea v-model="form.description" label="Note" placeholder="Campo falcotativo"></ion-textarea>
      </form>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-padding-horizontal ion-padding-vertical ion-justify-content-center">
        <ion-button class="grow" form="form" type="submit">Salva</ion-button>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>