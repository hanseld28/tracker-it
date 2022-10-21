<template>
    <form
        @submit.prevent="save"
        role="form"
        aria-label="Formulário para criação de um novo projeto"
    >
        <div class="field">
            <label
                for="name"
                class="label"
            >
                Nome
            </label>
            <input
                id="projectName"
                type="text"
                class="input"
                placeholder="Nome do projeto"
                v-model="fields.name.value"
                :disabled="isConsultMode"
            />
        </div>
        <div 
            v-if="isCreateMode"        
            class="field"
        >     
            <button
                class="button is-primary"
                type="submit"
                :disabled="incompleteFields"
            >
                Criar
            </button>
        </div>
        <div 
            v-if="isConsultMode"        
            class="field"
        >     
            <button
                class="button"
                @click="changeToUpdateMode"
            >
                Editar
            </button>
        </div>
        <div 
            v-if="isUpdateMode"        
            class="field"
        >         
            <button
                class="button mr-3"
                @click="cancelEdit"
            >
                Cancelar
            </button>
            <button
                class="button is-primary"
                type="submit"
                :disabled="pristineFields"
            >
                Salvar
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import { FormMode } from '@/interfaces/Form';
import IProject from '@/interfaces/Project/IProject';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProjectForm',
    emits: [
        'onSave',
    ],
    props: ['data', 'initialMode'],
    data() {
        return {
            mode: this.initialMode || FormMode.CREATE,
            fields: {
                name: {
                    initialValue: '',
                    value: '',
                },
            },
        };
    },
    computed: {
        isConsultMode(): boolean {
            return this.mode === FormMode.CONSULT;
        },
        isCreateMode(): boolean {
            return this.mode === FormMode.CREATE;
        },
        isUpdateMode(): boolean {
            return this.mode === FormMode.UPDATE;
        },
        incompleteFields() : boolean {
            return [
                this.fields.name.value,
            ].some((field) => (
                field.length === 0
            ));
        },
        pristineFields() : boolean {
            const nameField = this.fields.name;

            return this.incompleteFields || [
                nameField.value === nameField.initialValue,
            ].every((pristine) => pristine);
        },
    },
    watch: {
        data: function() {
            this.fields.name.initialValue = this.data?.name;
            this.fields.name.value = this.data?.name;
        },
    },
    methods: {
        getDataByCurrentMode(): IProject {
            const isEditContextMode = [
                FormMode.CONSULT,
                FormMode.UPDATE
            ].includes(this.mode);
            
            if (isEditContextMode) {
                return {
                    id: this.data?.id,   
                    name: this.fields.name.value,
                };
            }

            return {
                id: Date.now(),   
                name: this.fields.name.value,
            };
        },
        resetFields() {
            if (this.mode === FormMode.CREATE) {
                this.fields.name.value = '';
                return;
            }

            if (this.mode === FormMode.UPDATE) {
                this.fields.name.initialValue = this.fields.name.value;
            }
        },
        cancelEdit() {
            this.fields.name.value = this.fields.name.initialValue;
            this.changeToConsultMode();
        },
        changeToConsultMode() {
            this.mode = FormMode.CONSULT;
        },
        changeToUpdateMode() {
            this.mode = FormMode.UPDATE;
        },
        changeToPreviousMode() {
            if (this.mode === FormMode.UPDATE) {
                this.mode = FormMode.CONSULT;
                return;
            }
        },
        save() : void {
            const project: IProject = this.getDataByCurrentMode();
            this.$emit('onSave', project);
            this.resetFields();
            this.changeToPreviousMode();
        },
    },
});
</script>

<style>
.form {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
</style>