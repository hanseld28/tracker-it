import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest } from '@/api';
import type { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
import { useNotifier } from '@/hooks/notifier';
import ITask from '@/interfaces/Task/ITask';
import INewTask from '@/interfaces/Task/INewTask';
import ITaskId from '@/interfaces/Task/ITaskId';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';

export const useTaskStore = defineStore('task', () => {
    const notifier = useNotifier();

    const tasks: Ref<ITask[]> = ref([]);

    const fetchAll = async () => {
        return makeRequest()
            .add(config.TASKS_API_ENDPOINT)
            .build()
            .do(({ client, endpoint }) => {
                return client.get(endpoint);
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const payload: ITask[] = response.data || [];
                    tasks.value = payload;
                }
            });
    };

    const save = async (payload: INewTask) => {
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
                if (response.status === 201) {
                    tasks.value = [
                        ...tasks.value,
                        task,
                    ];

                    const newNotification: INewNotification = {
                        title: 'Tarefa concluída',
                        content: 'O tracking da sua tarefa foi finalizado e registrado.',
                        type: NotificationType.SUCCESS,
                    };
            
                    notifier.notify(newNotification);
                }
            })
            .catch((error: AxiosError | Error) => {
                const newNotification: INewNotification = {
                    title: 'Erro na finalização',
                    content: `Ocorreu um erro ao tentar finalizar a tarefa: ${error.message}`,
                    type: NotificationType.ERROR,
                };
        
                notifier.notify(newNotification);
            });
    };

    const update = async (payload: ITask) => {
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
    };

    const remove = async (payload: ITaskId) => {
        return makeRequest()
            .add(config.TASKS_API_ENDPOINT)
            .add(payload.id)
            .build()
            .do(({ client, endpoint }) => {
                return client.delete(endpoint);
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    tasks.value = tasks.value.filter((task: ITask) => (
                        task.id !== payload.id
                    ));
                }
            });
    };

    return {
        tasks,
        fetchAll,
        save,
        update,
        remove,
    };
});