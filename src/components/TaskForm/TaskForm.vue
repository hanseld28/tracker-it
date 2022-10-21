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

<script lang="ts">
import INewTask from '@/interfaces/Task/INewTask';
import { defineComponent, computed } from 'vue';
import Timer from '@/components/Timer/Timer.vue';
import type { TimerStopPayload } from '@/interfaces/Timer/types';
import { useStore } from '@/store';
import IProject from '@/interfaces/Project/IProject';
import StoreActions from '@/store/StoreActions';

export default defineComponent({
    name: 'TaskForm',
    emits: [
        'onSave',
        'onValidationError'
    ],
    components: {
        Timer,
    },
    data() {
        return {
            fields: {
                description: {
                    value: '',
                    disabled: false,
                },
                projectId: {
                    value: null,
                    disabled: false,
                },
            },
        };
    },
    computed: {
        incompleteFields() : boolean {
            return [
                this.fields.description.value,
            ].some((field) => (
                field.length === 0
            )) || !this.fields.projectId;
        },
    },
    methods: {
        handleTimerStart() : void {
            this.fields.description.disabled = true;
            this.fields.projectId.disabled = true;
        },
        finishTask(payload: TimerStopPayload) : void {
            const selectedProject: IProject | undefined = this.projects.find((currentProject) => (
                currentProject?.id === this.fields.projectId.value
            ));

            if (selectedProject === undefined) {
                this.$emit('onValidationError', {
                    error: true,
                    fields: {
                        projectId: 'o projeto é obrigatório para uma tarefa',
                    },
                })
                return;
            }

            const task: INewTask = {
                description: this.fields.description.value,
                timeInSeconds: payload.timeInSeconds,
                project: selectedProject, 
            };

            this.$emit('onSave', task);

            this.fields.description.value = '';
            this.fields.description.disabled = false;
            this.fields.projectId.value = null,
            this.fields.projectId.disabled = false;
        },
    },
    setup() {
        const store = useStore();

        store.dispatch(StoreActions.GET_PROJECTS);

        return {
            store,
            projects: computed(() => (
                store.state.project.list
            )),
        }
    }
});
</script>

<style>
.form {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
</style>