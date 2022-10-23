import { Module } from 'vuex';
import { makeRequest } from '@/api';
import { ITrackerItStore } from '@/store';
import config from '@/config';
import INewTask from '@/interfaces/Task/INewTask';
import ITask from '@/interfaces/Task/ITask';
import ITaskId from '@/interfaces/Task/ITaskId';
import StoreActions from '@/store/StoreActions';
import StoreMutations from '@/store/StoreMutations';
import { AxiosResponse } from 'axios';

export interface ITaskState {
    list: ITask[]
}

export const task: Module<ITaskState, ITrackerItStore> = {
    namespaced: false,
    state: {
        list: [],
    },
    mutations: {
        [StoreMutations.LOAD_TASKS](state, payload: ITask[]) {
            state.list = payload;
        },
        [StoreMutations.SAVE_TASK](state, payload: ITask) {
            state.list = [
                ...state.list,
                payload,
            ]
        },
        [StoreMutations.UPDATE_TASK](state, payload: ITask) {
            state.list = state.list.map((task: ITask) => (
                task.id === payload.id
                    ? payload
                    : task
            ));
        },
        [StoreMutations.DELETE_TASK](state, payload: ITaskId) {
            state.list = state.list.filter((task: ITask) => (
                task.id !== payload.id
            ));
        },
    },
    actions: {
        [StoreActions.GET_TASKS]({ commit }) {
            makeRequest()
                .add(config.TASKS_API_ENDPOINT)
                .build()
                .do(({ client, endpoint }) => {
                    return client.get(endpoint);
                })
                .then((response) => {
                    const payload: ITask[] = response?.data || [];
                    commit(StoreMutations.LOAD_TASKS, payload);
                })
                .catch((err) => {
                    console.log('error', err)
                });
        },
        [StoreActions.SAVE_TASK]({ commit }, payload: INewTask) {
            const task: ITask = {
                id: Date.now(),
                ...payload,
            };

            return makeRequest()
                .add(config.TASKS_API_ENDPOINT)
                .build()
                .do(({ client, endpoint }) => {
                    return client.post(
                        endpoint,
                        task
                    );
                })
                .then((response: AxiosResponse) => {
                    const payload: ITask = response?.data;
                    commit(StoreMutations.SAVE_TASK, payload);
                });
        },
        [StoreActions.UPDATE_TASK](_, payload: ITask) {
            return makeRequest()
                .add(config.TASKS_API_ENDPOINT)
                .add(payload.id)
                .build()
                .do(({ client, endpoint }) => {
                    return client.put(
                        endpoint,
                        payload
                    );
                });
        },
        [StoreActions.DELETE_TASK](_, payload: ITaskId) {
            return makeRequest()
                .add(config.TASKS_API_ENDPOINT)
                .add(payload.id)
                .build()
                .do(({ client, endpoint }) => {
                    return client.delete(endpoint);
                });
        },
    },
}