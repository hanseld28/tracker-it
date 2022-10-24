import type { INewNotification } from '@/interfaces/Notifications';
import type { Notifier } from '@/interfaces/Notifier';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/NotificationStore';

export const useNotifier = () : Notifier => {
    const notificationStore = useNotificationStore();
    const { notifications } = storeToRefs(notificationStore);

    const notify = (payload: INewNotification) => {
        notificationStore.notify(payload);
    };

    return {
        notify,
        notifications,
    };
}