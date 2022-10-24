import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest } from '@/api';
import type { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
import IProject from '@/interfaces/Project/IProject';
import INewProject from '@/interfaces/Project/INewProject';
import IProjectId from '@/interfaces/Project/IProjectId';
import { useNotifier } from '@/hooks/notifier';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import { useRouter } from 'vue-router';

export const useProjectStore = defineStore('project', () => {
    const router = useRouter();

    const notifier = useNotifier();

    const projects: Ref<IProject[]> = ref([]);

    const fetchAll = async () => {
        return makeRequest()
            .add(config.PROJECTS_API_ENDPOINT)
            .build()
            .do(({ client, endpoint }) => {
                return client.get(endpoint);
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const payload: IProject[] = response.data || [];
                    projects.value = payload;
                }
            });
    }

    const save = async (payload: INewProject) => {
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
            })
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    projects.value = [
                        ...projects.value,
                        project,
                    ];

                    const newNotification: INewNotification = {
                        title: 'Projeto criado',
                        content: 'Seu novo projeto já está disponível.',
                        type: NotificationType.SUCCESS,
                    };
            
                    notifier.notify(newNotification);
            
                    router.replace('/projects');
                }
            })
            .catch((error: AxiosError | Error) => {
                const newNotification: INewNotification = {
                    title: 'Erro na criação',
                    content: `Ocorreu um erro ao tentar criar o projeto: ${error.message}`,
                    type: NotificationType.ERROR,
                };
        
                notifier.notify(newNotification);
            });
    };

    const update = async (payload: IProject) => {
        return makeRequest()
            .add(config.PROJECTS_API_ENDPOINT)
            .add(payload.id)
            .build()
            .do(({ client, endpoint }) => {
                return client.put(
                    endpoint,
                    payload
                );
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    projects.value = projects.value.map((project: IProject) => (
                        project.id === payload.id
                            ? payload
                            : project
                    ));

                    const newNotification: INewNotification = {
                        title: 'Projeto alterado',
                        content: 'Suas alterações foram salvas.',
                        type: NotificationType.SUCCESS,
                    };
            
                    notifier.notify(newNotification);

                    router.replace(`/${config.PROJECTS_API_ENDPOINT}/${payload.id}/edit`);
                }
            })
            .catch(() => {
                const newNotification: INewNotification = {
                    title: 'Erro na alteração',
                    content: 'Ocorreu um erro ao tentar alterar o projeto.',
                    type: NotificationType.ERROR,
                };
    
                notifier.notify(newNotification);
            });
    };

    const remove = async (payload: IProjectId) => {
        return makeRequest()
            .add(config.PROJECTS_API_ENDPOINT)
            .add(payload.id)
            .build()
            .do(({ client, endpoint }) => {
                return client.delete(endpoint);
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    projects.value = projects.value.filter((project: IProject) => (
                        project.id !== payload.id
                    ));

                    const newNotification: INewNotification = {
                        title: 'Projeto removido',
                        content: 'Seu projeto foi removido.',
                        type: NotificationType.SUCCESS,
                    };
            
                    notifier.notify(newNotification);
                }
            })
            .catch((error) => {
                const newNotification: INewNotification = {
                    title: 'Erro na exclusão',
                    content: `Ocorreu um erro ao tentar excluir o projeto: ${error}`,
                    type: NotificationType.ERROR,
                };
    
                notifier.notify(newNotification);
            });
    };

    return {
        projects,
        fetchAll,
        save,
        update,
        remove,
    };
});