<script lang="ts" setup>
import {IonButton, IonContent, IonHeader, IonPage, IonRow} from "@ionic/vue";
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
    <ion-content>
    </ion-content>
  </ion-page>
</template>