<template>
    <TaskForm @on-save="save" />
    <div class="list" tabindex="-1">
        <Box v-if="isEmptyList"> 
            Nenhuma tarefa foi adicionada ainda. Você não está muito produtivo hoje :(
        </Box>
        <TransitionGroup name="task-list">
            <Task
                v-for="(task, index) in orderedTasks"
                :key="task.id"
                :task="task"
                @on-edit="edit"
                :tabindex="index + 1"
            />
        </TransitionGroup>
    </div>
    <Modal
        :open="isSelectedTask"
        @on-close="closeEditModal"
        v-if="selectedTask"
    >
        <template v-slot:title>
            Editar Tarefa
        </template>
        <template v-slot:content>
            <div
                class="field"
            >
                <label class="label">Tarefa</label>
                <div class="control">
                    <input
                        type="text"
                        class="input"
                        placeholder="Nome da tarefa"
                        v-model="selectedTask.description"
                    />
                </div>
            </div>
            <div class="field">
                <label class="label">Projeto</label>
                <div class="select control">
                    <select
                        v-model="selectedTask.project.id"
                    >
                        <option :value="null">Selecione o projeto</option>
                        <option
                            v-for="project in projects"
                            :key="project.id"
                            :value="project.id"
                        >
                            {{ project.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="field">
                <label class="label">Tempo Gasto</label>
                <div class="control">
                    <Stopwatch
                        :timeInSeconds="selectedTask.timeInSeconds"
                    />
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button
                class="button"
                @click="closeEditModal"
            >
                Cancel
            </button>
            <button
                class="button is-success"
                @click="update"
                :disabled="isIncompleteValuesOfSelectedTask"
            >
                Salvar Alterações
            </button>
        </template>
    </Modal>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue';
import TaskForm from '../../components/TaskForm/TaskForm.vue';
import Task from '../../components/Task/Task.vue';
import Box from '../../components/Box/Box.vue';
import INewTask from '@/interfaces/Task/INewTask';
import { useStore } from '@/store';
import { notificationMixin } from '@/mixins/notify';
import StoreActions from '@/store/StoreActions';
import ITask from '@/interfaces/Task/ITask';
import ITaskId from '@/interfaces/Task/ITaskId';
import Modal from '@/components/Modal/Modal.vue';
import Stopwatch from '@/components/Stopwatch/Stopwatch.vue';
import { AxiosResponse } from 'axios';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import StoreMutations from '@/store/StoreMutations';
import useNotifier from '@/hooks/notifier';

export default defineComponent({
    name: 'TasksView',
    components: {
    TaskForm,
    Task,
    Box,
    Modal,
    Stopwatch,
},
    mixins: [
        notificationMixin,
    ],
    data() {
        return {
            selectedTask: null as ITask | null,
        };
    },
    computed: {
        isEmptyList() : boolean {
            return this.tasks.length === 0;
        },
        isSelectedTask() : boolean {
            return this.selectedTask != null;
        },
        isIncompleteValuesOfSelectedTask() : boolean {
            return this.selectedTask?.description.length === 0
                || this.selectedTask?.project.id === null;
        },
        orderedTasks() : ITask[] {
            return this.tasks
                .slice(0)
                .reverse();
        }
    },
    methods: {
        save(task: INewTask) {
            this.store.dispatch(
                StoreActions.SAVE_TASK,
                task
            );
        },
        edit(payload: ITaskId) {
            const found: ITask | undefined = this.tasks.find((task) => (
                task.id === payload.id
            ));

            this.selectedTask = {
                ...Object.assign({}, found),
                project: Object.assign({}, found?.project),
            };
        },
        async update() {
            const updatedTask = {
                ...this.selectedTask,
                project: this.projects.find((project) => (
                    project.id === this.selectedTask?.project.id
                )),
            };

            const response: AxiosResponse = await this.store.dispatch(
                StoreActions.UPDATE_TASK,
                updatedTask
            ).catch(() => {
                const newNotification: INewNotification = {
                    title: 'Erro na alteração',
                    content: 'Ocorreu um erro ao tentar salvar as alterações da tarefa.',
                    type: NotificationType.ERROR,
                };
    
                this.notifier.notify(newNotification);
            });

            if (response.status === 200) {
                this.store.commit(
                    StoreMutations.UPDATE_TASK,
                    response.data
                );
                
                const newNotification: INewNotification = {
                    title: 'Tarefa alterada',
                    content: 'As alterações foram salvas.',
                    type: NotificationType.SUCCESS,
                };
    
                this.notifier.notify(newNotification);

                this.closeEditModal();
            }
        },
        closeEditModal() {
            this.selectedTask = null;
        }
    },
    setup() {
        const store = useStore();
        const notifier = useNotifier();

        store.dispatch(StoreActions.GET_TASKS);

        return {
            store,
            notifier,
            tasks: computed(() => (
                store.state.task.list
            )),
            projects: computed(() => (
                store.state.project.list
            )),
        };
    }
});
</script>

<style>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(400px);
}
</style>