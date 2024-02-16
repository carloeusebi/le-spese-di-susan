import {toastController} from '@ionic/vue';

type Color = 'success' | 'info' | 'danger' | 'warning';

export const useIonToaster = () => {
    async function load(message: string, color: Color = 'info', duration: number = 3000) {
        const toast = await toastController.create({
            message,
            duration,
            color,
            swipeGesture: 'vertical',
        });
        await toast.present();
        return toast;
    }

    async function dismiss() {
        await toastController.dismiss();
    }

    return {
        load,
        dismiss,
    };
};