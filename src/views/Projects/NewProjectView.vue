<template>
    <Box>
        <RouterLink
            class="button"
            to="/projects"
        >
            <span class="icon is-small">
                <i class="fas fa-arrow-left"></i>
            </span>
            <span>Voltar</span>
        </RouterLink>
        <h2 class="title">Novo Projeto</h2>
        <slot></slot>
    </Box>
    <Box>
        <ProjectForm
            @on-save="save"
            :initialMode="mode"
        />
    </Box>
</template>
  
<script setup lang="ts">
import type { Ref } from 'vue';
import { ref } from 'vue';
import { FormMode } from '@/interfaces/Form';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';
import { useProjectStore } from '@/stores/ProjectStore';

const projectStore = useProjectStore();

const mode: Ref<FormMode> = ref(FormMode.CREATE);

const save = async (project: IProject) : Promise<void> => {
    projectStore.save(project);
};

</script>

<style scoped>
.container {
    padding: 1.25rem;
}
</style>