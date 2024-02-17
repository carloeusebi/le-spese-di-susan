import {loadingController} from '@ionic/vue';

export const useIonLoader = () => {
    async function present(message: string = '') {
        const loader = await loadingController.create({
            message,
        });
        await loader.present();
    }

    async function dismiss() {
        await loadingController.dismiss();
    }

    return {present, dismiss};
};