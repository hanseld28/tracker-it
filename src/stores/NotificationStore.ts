import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { INewNotification, INotification } from '@/interfaces/Notifications';

export const useNotificationStore = defineStore('notification', () => {
    const notifications: Ref<INotification[]> = ref([]);

    const scheduleRemoveById = (id: number) : void => {
        setTimeout(() => {
            notifications.value = notifications.value.filter(
                (notification: INotification) => (
                    notification.id !== id
                )
            );
        }, 3000);
    };

    const notify = (payload: INewNotification) : void => {
        const notification: INotification = {
            id: Date.now(),
            ...payload,
        };

        notifications.value = [
            ...notifications.value,
            notification,
        ]

        scheduleRemoveById(notification.id);
    };

    return {
        notifications,
        notify,
    };
});