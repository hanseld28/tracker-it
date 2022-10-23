<template>
    <TaskForm @on-save="save" />
    <div class="search-box">
        <div class="control has-icons-right">
            <input
                class="input"
                type="search"
                placeholder="Pesquisar tarefas..."
                v-model="search"
            />
            <span class="icon is-small is-right">
                <i class="fas fa-search"></i>
            </span>
        </div>
    </div>
    <div class="list" tabindex="-1">
        <Box v-if="isEmptyList" class="no-tasks"> 
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
        key="task-edit-modal"
        id="task-edit-modal"
        :open="isSelectedTask"
        @on-close="closeEditModal"
        v-if="isSelectedTask"
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
                        id="task-name-input"
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
  
<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import { computed, ref, watch } from 'vue';
import { useStore } from '@/store';
import { AxiosResponse } from 'axios';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import TaskForm from '../../components/TaskForm/TaskForm.vue';
import Task from '../../components/Task/Task.vue';
import Box from '../../components/Box/Box.vue';
import INewTask from '@/interfaces/Task/INewTask';
import StoreActions from '@/store/StoreActions';
import ITask from '@/interfaces/Task/ITask';
import ITaskId from '@/interfaces/Task/ITaskId';
import Modal from '@/components/Modal/Modal.vue';
import Stopwatch from '@/components/Stopwatch/Stopwatch.vue';
import StoreMutations from '@/store/StoreMutations';
import useNotifier from '@/hooks/notifier';
import IProject from '@/interfaces/Project/IProject';

const store = useStore();
const notifier = useNotifier();

store.dispatch(StoreActions.GET_TASKS);

const search: Ref<string> = ref('');
    
const selectedTask: Ref<ITask> = ref({} as ITask);

const tasks: ComputedRef<ITask[]> = computed(() => (
    store.state.task.list.filter((task: ITask) => (
        !search.value || task.description
            .toLowerCase()
            .includes(
                search.value.toLowerCase()
            )
    ))
));

const projects: ComputedRef<IProject[]> = computed(() => (
    store.state.project.list
));

const isEmptyList: ComputedRef<boolean> = computed(() => {
    return tasks.value.length === 0;
});

const isSelectedTask: ComputedRef<boolean> = computed(() => {
    return selectedTask.value?.id !== null && selectedTask.value?.id !== undefined;
});

const isIncompleteValuesOfSelectedTask: ComputedRef<boolean> = computed(() => {
    return selectedTask.value?.description.length === 0
        || selectedTask.value?.project.id === null
        || selectedTask.value?.project.id === undefined;
});

const orderedTasks: ComputedRef<ITask[]> = computed(() => {
    return tasks.value
        .slice(0)
        .reverse();
});

const save = (task: INewTask) : void => {
    store.dispatch(
        StoreActions.SAVE_TASK,
        task
    );
};

const edit = (payload: ITaskId) : void => {
    const found: ITask | undefined = tasks.value.find((task) => (
        task.id === payload.id
    ));

    selectedTask.value = {
        ...Object.assign({}, found),
        project: Object.assign({}, found?.project),
    };    
};

const update = async () : Promise<void> => {
    const updatedTask = {
        ...selectedTask.value,
        project: projects.value.find((project) => (
            project.id === selectedTask.value?.project.id
        )),
    };

    const response: AxiosResponse = await store.dispatch(
        StoreActions.UPDATE_TASK,
        updatedTask
    ).catch(() => {
        const newNotification: INewNotification = {
            title: 'Erro na alteração',
            content: 'Ocorreu um erro ao tentar salvar as alterações da tarefa.',
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);
    });

    if (response.status === 200) {
        store.commit(
            StoreMutations.UPDATE_TASK,
            response.data
        );
        
        const newNotification: INewNotification = {
            title: 'Tarefa alterada',
            content: 'As alterações foram salvas.',
            type: NotificationType.SUCCESS,
        };

        notifier.notify(newNotification);

        closeEditModal();
    }
};

const closeEditModal = () : void => {
    selectedTask.value = {} as ITask;
};

watch(
    isSelectedTask,
    () => {
        setTimeout(() => {
            const taskNameInputElement: HTMLElement | null = document.getElementById(
                'task-name-input'
            );
    
            if (taskNameInputElement !== null) {
                taskNameInputElement.focus();
            }
        }, 100);
    }
);

</script>

<style>
.search-box {
    padding-left: 36px;
    padding-right: 40px;
}

.no-tasks {
    margin-left: 1rem;
    margin-right: 1.2rem;
}

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