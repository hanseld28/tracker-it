import { INewNotification } from '../Notifications';

export type Notifier = {
    notify: (payload: INewNotification) => void,
}