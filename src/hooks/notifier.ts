import { INewNotification } from '@/interfaces/Notifications';
import { Notifier } from '@/interfaces/Notifier';
import { store } from '@/store';
import StoreMutations from '@/store/StoreMutations';

export default function useNotifier() : Notifier {
    const notify = (payload: INewNotification) => {
        store.commit(
            StoreMutations.NOTIFY,
            payload
        );
    }

    return {
        notify,
    };
}