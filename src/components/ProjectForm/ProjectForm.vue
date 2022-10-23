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

<script setup lang="ts">
import { FormMode } from '@/interfaces/Form';
import IProject from '@/interfaces/Project/IProject';
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { Ref } from 'vue';

const props = defineProps([
    'data',
    'initialMode',
]);

const emit = defineEmits([
    'onSave',
]);

const mode: Ref<FormMode> = ref(props.initialMode || FormMode.CREATE);

const fields: Ref<{ name: { initialValue: string, value: string } }> = ref({
    name: {
        initialValue: '',
        value: '',
    },
});


const isConsultMode: Ref<boolean> = computed(() => {
    return mode.value === FormMode.CONSULT;
});

const isCreateMode: Ref<boolean> = computed(() => {
    return mode.value === FormMode.CREATE;
});

const isUpdateMode: Ref<boolean> = computed(() => {
    return mode.value === FormMode.UPDATE;
});

const incompleteFields: Ref<boolean> = computed(() => {
    return [
        fields.value.name.value,
    ].some((field) => (
        field.length === 0
    ));
});

const pristineFields: Ref<boolean> = computed(() => {
    const nameField = fields.value.name;

    return incompleteFields.value || [
        nameField.value === nameField.initialValue,
    ].every((pristine) => pristine);
});

const changeToConsultMode = () : void => {
    mode.value = FormMode.CONSULT;
};

const changeToUpdateMode = () : void => {
    mode.value = FormMode.UPDATE;
};

const changeToPreviousMode = () : void => {
    if (mode.value === FormMode.UPDATE) {
        mode.value = FormMode.CONSULT;
        return;
    }
};

const getDataByCurrentMode = () : IProject => {
    const isEditContextMode = [
        FormMode.CONSULT,
        FormMode.UPDATE
    ].includes(mode.value);
    
    if (isEditContextMode) {
        return {
            id: props.data?.id,   
            name: fields.value.name.value,
        };
    }

    return {
        id: Date.now(),   
        name: fields.value.name.value,
    };
};

const resetFields = () : void => {
    if (mode.value === FormMode.CREATE) {
        fields.value.name.value = '';
        return;
    }

    if (mode.value === FormMode.UPDATE) {
        fields.value.name.initialValue = fields.value.name.value;
    }
};

const cancelEdit = () : void => {
    fields.value.name.value = fields.value.name.initialValue;
    changeToConsultMode();
};

const save = () : void => {
    const project: IProject = getDataByCurrentMode();
    emit('onSave', project);
    resetFields();
    changeToPreviousMode();
};

watch(
    () => props.data,
    (currentData) => {
        fields.value.name.initialValue = currentData?.name;
        fields.value.name.value = currentData?.name;
    }
);

</script>

<style>
.form {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
</style>