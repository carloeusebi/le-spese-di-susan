<script lang="ts" setup>
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue';
import {computed, reactive, ref} from 'vue';
import {format} from 'date-fns';
import {Expense, ExpenseForm} from '@/types/types';
import {useExpensesStore} from '@/stores/expenses';
import {useRoute} from 'vue-router';
import {useIonToaster} from '@/composables/useIonToaster';
import {caretBack, trash} from 'ionicons/icons';
import {useIonLoader} from '@/composables/useIonLoader';
import {isAxiosError} from 'axios';
import {useIonAlert} from '@/composables/useIonAlert';
import {expenseTypes} from '@/consts/expenseTypes';

const store = useExpensesStore();
const router = useIonRouter();
const route = useRoute();
const toaster = useIonToaster();
const loader = useIonLoader();
const alert = useIonAlert();

const amountRef = ref<InstanceType<typeof IonInput>>();

const isTitleInvalid = ref(false);
const isDateInvalid = ref(false);
const isAmountInvalid = ref(false);
const isTypeInvalid = ref(false);

const isFormInvalid = computed(() => isTitleInvalid.value || isDateInvalid.value || isAmountInvalid.value || isTypeInvalid.value);

let form = reactive<ExpenseForm>({
  id: store.getNextId,
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: undefined,
  type: '',
  toSplit: false,
  description: '',
});

const validateTitle = () => {
  isTitleInvalid.value = !form.title.trim() || form.title.length > 20;
};

const validateDate = () => {
  const dateToValidate = new Date(form.date);
  const today = new Date();
  isDateInvalid.value = isNaN(dateToValidate.getMilliseconds()) || dateToValidate > today;
};

const validateAmount = () => {
  isAmountInvalid.value = !form.amount || isNaN(form.amount) || form.amount <= 0;
};

const validateType = () => {
  isTypeInvalid.value = !form.type;
};

const onSubmit = async () => {
  validateTitle();
  validateDate();
  validateAmount();
  validateType();
  if (isFormInvalid.value) {
    return;
  }
  try {
    await loader.present('Salvando...');
    await store.saveExpense({...form as Expense});
    await toaster.load('Spesa salvata con successo!', 'success');
  } catch (err) {
    if (isAxiosError(err)) {
      await toaster.load('Errore nel sincronizzare Google Sheet: ' + err.response?.data.error, 'danger');
    }
  } finally {
    await loader.dismiss();
    router.back();
  }
};

const deleteExpense = async () => {
  const id = Number(route.params.id);
  if (!id) return;
  try {
    await loader.present('Eliminando...');
    await alert.dismiss();
    await store.deleteExpense({...form as Expense});
    await toaster.load('Spesa cancellata con successo!', 'success');
  } catch (err) {
    if (isAxiosError(err)) {
      await toaster.load('Errore nel sincronizzare Google Sheet: ' + err.response?.data.error, 'danger');
    }
  } finally {
    await loader.dismiss();
    router.back();
  }
};

const handleDeleteButtonClick = async () => {
  await alert.present({
    header: 'Elimina spesa',
    message: 'Sicura di voler eliminare questa spesa?',
    buttons: [
      {text: 'Annulla', role: 'cancel'},
      {text: 'Elimina', role: 'confirm', handler: deleteExpense},
    ],
  });
};

onIonViewWillEnter(() => {
  if (!route.params.id) {
    form.id = store.getNextId;
    return;
  }
  const expense = store.getById(Number(route.params.id));
  if (expense)
    form = {...expense};
});

const focusAmountInput = () => {
  amountRef.value?.$el.setFocus();
};

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-row class="ion-padding-vertical ion-padding-horizontal ion-justify-content-between ion-align-items-center">
        <ion-col>
          <ion-button @click="router.back()">
            <ion-icon slot="icon-only" :icon="caretBack"/>
          </ion-button>
        </ion-col>
        <ion-col v-if="route.params.id" class="ion-justify-content-end" style="display: flex">
          <ion-button id="delete-alert" color="danger" @click="handleDeleteButtonClick">
            <ion-icon slot="icon-only" :icon="trash"/>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-header>
    <ion-content class="ion-padding-vertical ion-padding-horizontal">
      <form id="expenseForm" @submit.prevent="onSubmit">
        <ion-input
          v-model.trim="form.title"
          :class="{'ion-invalid ion-touched': isTitleInvalid}"
          :maxlength="20"
          error-text="Amore il nome!!"
          fill="solid"
          label="Nome della spesa"
          placeholder="Max 20 caratteri"
          @ionBlu="validateTitle"
          @ionInput="validateTitle"
        />
        <ion-input
          v-model="form.date"
          :class="{'ion-invalid ion-touched': isDateInvalid}"
          error-text="Amore ma che data hai messo?"
          fill="solid"
          label="Seleziona giorno"
          type="date"
          @ionBlur="validateDate"
          @ionChange="focusAmountInput"
          @ionInput="validateDate"
        />
        <ion-input
          ref="amountRef"
          v-model="form.amount"
          :class="{'ion-invalid ion-touched': isAmountInvalid}"
          error-text="Amore, sciocchina, ti sei scordata di mettere il prezzo :D"
          fill="solid"
          inputmode="decimal"
          label="Ammontare spesa €"
          min="0"
          placeholder="0"
          step="0.01"
          type="number"
          @ionBlur="validateAmount"
          @ionInput="validateAmount"
        />
        <ion-select
          v-model="form.type"
          :class="{'ion-invalid ion-touched': isTypeInvalid}"
          cancel-text="Annulla"
          fill="solid"
          label="Scegli la categoria"
          @ionChange="validateType"
          @ionDismiss="validateType"
        >
          <ion-select-option v-for="type in expenseTypes" :key="type.value" :value="type">
            {{ type.label }}
          </ion-select-option>
        </ion-select>
        <div v-if="isTypeInvalid" class="input-bottom sc-ion-input-md">
          <div class="sc-ion sc-ion-input-md" style="color: var(--ion-color-danger)">
            Amore, non hai scelto la categoria!
          </div>
        </div>
        <ion-checkbox v-model="form.toSplit" class="ion-padding-vertical" label-placement="end">Da dividere con &lt;3
        </ion-checkbox>
        <ion-textarea
          v-model.trim="form.description"
          :rows="5"
          fill="solid"
          label="Note"
          placeholder="Campo facoltativo"
        />
      </form>
    </ion-content>
    <ion-footer class="ion-padding-vertical ion-padding-horizontal">
      <ion-button
        :disabled="isFormInvalid"
        expand="block"
        form="expenseForm"
        size="large"
        type="submit"
      >
        Salva
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
ion-select {
  margin-bottom: 5px;
}
</style>
