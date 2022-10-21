import { InjectionKey } from '@vue/runtime-core/dist/runtime-core';
import { createStore, Store, useStore as useVuexStore } from 'vuex';
import { IProjectState, project } from './modules/project';
import { ITaskState, task } from './modules/task';
import { INotificationState, notification } from './modules/notification';

export interface ITrackerItStore {
    project: IProjectState,
    task: ITaskState,
    notification: INotificationState,
}

export const TRACKER_IT_STORE_INJECTION_KEY: InjectionKey<Store<ITrackerItStore>> = Symbol(
    'TRACKER_ID_STORE_INJECTION_KEY'
);

export const store = createStore<ITrackerItStore>({
    strict: false,
    state: {
        project: {
            list: [],
        },
        task: {
            list: [],
        },
        notification: {
            list: [],
        },
    },
    modules: {
        project,
        task,
        notification,
    },
    
});

export function useStore(): Store<ITrackerItStore> {
    return useVuexStore(TRACKER_IT_STORE_INJECTION_KEY);
}