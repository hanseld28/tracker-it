<template>
    <Box>
        <h2 class="title">Meus Projetos</h2>
        <slot></slot>
    </Box>
    <Box v-if="isEmptyList"> 
        Nenhum projeto foi adicionado ainda
    </Box>
    <Box v-else>
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in projects" :key="project.id">
                <td>{{ project.id }}</td>
                <td>{{ project.name }}</td>
                <td>
                    <router-link
                        class="button is-small"
                        :to="`/projects/${project.id}/edit/`"
                    >
                        <span class="icon">
                            <i class="fas fa-pencil-alt"></i>
                        </span>
                    </router-link>
                    <button
                        class="button ml-2 is-small is-danger"
                        @click="remove(project.id)"
                    >
                        <span class="icon">
                            <i class="fas fa-trash"></i>
                        </span>
                    </button>
                </td>
            </tr>
        </tbody>
        </table>
    </Box>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type IProjectId from '@/interfaces/Project/IProjectId';
import { computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/ProjectStore';
import Box from '../../components/Box/Box.vue';

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);

onBeforeMount(() => {
    projectStore.fetchAll();
});

const isEmptyList: ComputedRef<boolean> = computed(() => {
    return projects.value.length === 0;
});

const remove = async (id: number) : Promise<void> => {
    if (!confirm('Tem certeza que deseja remover esse projeto?')) {
        return;
    }

    const payload: IProjectId = { id };
    
    projectStore.remove(payload);
};

</script>

<style scoped>
.projects {
    padding: 1.25rem;
}
</style>