import {alertController, AlertOptions} from '@ionic/vue';

export const useIonAlert = () => {
    async function present(options: AlertOptions) {
        const alert = await alertController.create(options);
        await alert.present();
    }

    async function dismiss() {
        await alertController.dismiss();
    }

    return {present, dismiss};
};