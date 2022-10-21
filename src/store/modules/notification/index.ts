import { Module } from 'vuex';
import { ITrackerItStore } from '@/store';
import StoreMutations from '@/store/StoreMutations';
import { INewNotification, INotification } from '@/interfaces/Notifications';

export interface INotificationState {
    list: INotification[]
}

export const notification: Module<INotificationState, ITrackerItStore> = {
    namespaced: false,
    state: {
        list: [],
    },
    mutations: {
        [StoreMutations.NOTIFY](state, payload: INewNotification) {
            const notification: INotification = {
                id: Date.now(),
                ...payload,
            };

            state.list = [
                ...state.list,
                notification,
            ]

            setTimeout(() => {
                state.list = state.list.filter(
                    ({ id }) => (
                        id !== notification.id
                    )
                );
            }, 3000);
        },
    },
};
