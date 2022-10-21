import { INewNotification } from '@/interfaces/Notifications';
import { store } from '@/store';
import StoreMutations from '@/store/StoreMutations';

export const notificationMixin = {
    methods: {
        notify(payload: INewNotification): void {
            store.commit(
                StoreMutations.NOTIFY,
                payload
            );
        }
    }
}