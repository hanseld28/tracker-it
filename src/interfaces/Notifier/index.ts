import type { Ref } from 'vue';
import type { INewNotification, INotification } from '../Notifications';

export type Notifier = {
    notify: (payload: INewNotification) => void,
    notifications: Ref<INotification[]>,
}