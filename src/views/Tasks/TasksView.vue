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
        <Box v-if="isEmptyList" class="tasks-feedback"> 
            Nenhuma tarefa foi adicionada ainda. Você não está muito produtivo hoje 🙃
        </Box>
        <Box v-if="isNotFoundToSearch" class="tasks-feedback"> 
            Tarefa não encontrada. Experimente criar a tarefa "{{ search }}" para incluí-la na lista 😉
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
import { computed, ref, watch, onBeforeMount } from 'vue';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import TaskForm from '../../components/TaskForm/TaskForm.vue';
import Task from '../../components/Task/Task.vue';
import Box from '../../components/Box/Box.vue';
import INewTask from '@/interfaces/Task/INewTask';
import ITask from '@/interfaces/Task/ITask';
import ITaskId from '@/interfaces/Task/ITaskId';
import Modal from '@/components/Modal/Modal.vue';
import Stopwatch from '@/components/Stopwatch/Stopwatch.vue';
import { useNotifier } from '@/hooks/notifier';
import { useProjectStore } from '@/stores/ProjectStore';
import { useTaskStore } from '@/stores/TaskStore';
import { storeToRefs } from 'pinia';
import IProject from '@/interfaces/Project/IProject';

const notifier = useNotifier();

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);

onBeforeMount(() => {
    taskStore.fetchAll();
});

const search: Ref<string> = ref('');
    
const selectedTask: Ref<ITask> = ref({} as ITask);

const filteredTasks: ComputedRef<ITask[]> = computed(() => (
    tasks.value.filter((task: ITask) => (
        !search.value || task.description
            .toLowerCase()
            .includes(
                search.value.toLowerCase()
            )
    ))
));

const isEmptyList: ComputedRef<boolean> = computed(() => {
    return tasks.value.length === 0;
});

const isNotFoundToSearch: ComputedRef<boolean> = computed(() => {
    return !isEmptyList.value && filteredTasks.value.length === 0;
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
    return filteredTasks.value
        .slice(0)
        .reverse();
});

const save = (task: INewTask) : void => {
    taskStore.save(task);
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
    const project: IProject | undefined = projects.value.find((project) => (
        project.id === selectedTask.value?.project.id
    ));

    if (project === undefined) {
        const newNotification: INewNotification = {
            title: 'Erro na alteração',
            content: 'O projeto relacionado a tarefa não foi encontrado.',
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);

        return;
    }

    const updatedTask = {
        ...selectedTask.value,
        project,
    };

    try {

        const response = await taskStore.update(updatedTask);
        
        if (response.status === 200) {
            taskStore.$patch((state) => {
                state.tasks = state.tasks.map((task: ITask) => (
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                ));
            });
            
            const newNotification: INewNotification = {
                title: 'Tarefa alterada',
                content: 'As alterações foram salvas.',
                type: NotificationType.SUCCESS,
            };
            
            notifier.notify(newNotification);
            
            closeEditModal();
        }
    } catch (_) {
        const newNotification: INewNotification = {
            title: 'Erro na alteração',
            content: 'Ocorreu um erro ao tentar salvar as alterações da tarefa.',
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);
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

.tasks-feedback {
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