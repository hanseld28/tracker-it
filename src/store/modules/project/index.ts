import { Module } from 'vuex';
import { makeRequest } from '@/api';
import { ITrackerItStore } from '@/store';
import config from '@/config';
import INewProject from '@/interfaces/Project/INewProject';
import IProject from '@/interfaces/Project/IProject';
import IProjectId from '@/interfaces/Project/IProjectId';
import StoreActions from '@/store/StoreActions';
import StoreMutations from '@/store/StoreMutations';

export interface IProjectState {
    list: IProject[]
}

export const project: Module<IProjectState, ITrackerItStore> = {
    namespaced: false,
    mutations: {
        [StoreMutations.LOAD_PROJECTS](state, payload: IProject[]) {
            state.list = payload;
        },
        [StoreMutations.SAVE_PROJECT](state, payload: INewProject) {
            const project: IProject = {
                id: Date.now(),
                name: payload.name,
            };

            state.list = [
                ...state.list,
                project,
            ]
        },
        [StoreMutations.UPDATE_PROJECT](state, payload: IProject) {
            state.list = state.list.map((project: IProject) => (
                project.id === payload.id
                    ? payload
                    : project
            ));
        },
        [StoreMutations.DELETE_PROJECT](state, payload: IProjectId) {
            state.list = state.list.filter((project: IProject) => (
                project.id !== payload.id
            ));
        },
    },
    actions: {
        [StoreActions.GET_PROJECTS]({ commit }) {
            makeRequest()
                .add(config.PROJECTS_API_ENDPOINT)
                .build()
                .do(({ client, endpoint }) => {
                    return client.get(endpoint);
                })
                .then((response) => {
                    const payload: IProject[] = response?.data || [];
                    commit(StoreMutations.LOAD_PROJECTS, payload);
                })
                .catch((err) => {
                    console.log('error', err)
                });
        },
        [StoreActions.SAVE_PROJECT](_, payload: INewProject) {
            const project: IProject = {
                id: Date.now(),
                name: payload.name,
            };

            return makeRequest()
                .add(config.PROJECTS_API_ENDPOINT)
                .build()
                .do(({ client, endpoint }) => {
                    return client.post(
                        endpoint,
                        project
                    );
                });
        },
        [StoreActions.UPDATE_PROJECT](_, payload: IProject) {
            return makeRequest()
                .add(config.PROJECTS_API_ENDPOINT)
                .add(payload.id)
                .build()
                .do(({ client, endpoint }) => {
                    return client.put(
                        endpoint,
                        payload
                    );
                });
        },
        [StoreActions.DELETE_PROJECT](_, payload: IProjectId) {
            return makeRequest()
                .add(config.PROJECTS_API_ENDPOINT)
                .add(payload.id)
                .build()
                .do(({ client, endpoint }) => {
                    return client.delete(endpoint);
                });
        },
    },
}