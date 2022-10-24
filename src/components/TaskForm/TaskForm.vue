<template>
    <div class="box form">
        <div class="columns">
            <div
                class="column is-5"
                role="form"
                aria-label="Formulário para criação de uma nova tarefa"
            >
                <input
                    type="text"
                    class="input"
                    placeholder="Qual tarefa você deseja iniciar?"
                    v-model="fields.description.value"
                    :disabled="fields.description.disabled"
                />
            </div>
            <div class="column is-4">
                <div class="select">
                    <select
                        v-model="fields.projectId.value"
                        :disabled="fields.projectId.disabled"
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
            <div class="column is-3">
                <Timer
                    @on-stop="finishTask"
                    @on-start="handleTimerStart"
                    :disabled="incompleteFields"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { TimerStopPayload } from '@/interfaces/Timer/types';
import { defineEmits, ref, computed, onBeforeMount } from 'vue';
import INewTask from '@/interfaces/Task/INewTask';
import Timer from '@/components/Timer/Timer.vue';
import IProject from '@/interfaces/Project/IProject';
import { useProjectStore } from '@/stores/ProjectStore';
import { storeToRefs } from 'pinia';

const emit = defineEmits([
    'onSave',
    'onValidationError',
]);

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);

onBeforeMount(() => {
    projectStore.fetchAll();
})

const fields = ref({
    description: {
        value: '',
        disabled: false,
    },
    projectId: {
        value: null,
        disabled: false,
    },
});

const incompleteFields: ComputedRef<boolean> = computed(() => {
    return [
        fields.value.description.value,
    ].some((field) => (
        field.length === 0
    )) || !fields.value.projectId;
});

const handleTimerStart = () : void => {
    fields.value.description.disabled = true;
    fields.value.projectId.disabled = true;
};

const finishTask = (payload: TimerStopPayload) : void => {
    const selectedProject: IProject | undefined = projects.value
        .find((currentProject: IProject) => (
            currentProject?.id === fields.value.projectId.value
        ));

    if (selectedProject === undefined) {
        emit('onValidationError', {
            error: true,
            fields: {
                projectId: 'o projeto é obrigatório para uma tarefa',
            },
        })
        return;
    }

    const task: INewTask = {
        description: fields.value.description.value,
        timeInSeconds: payload.timeInSeconds,
        project: selectedProject, 
    };

    emit('onSave', task);

    fields.value.description.value = '';
    fields.value.description.disabled = false;
    fields.value.projectId.value = null,
    fields.value.projectId.disabled = false;
};

</script>

<style>
.form {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
</style>