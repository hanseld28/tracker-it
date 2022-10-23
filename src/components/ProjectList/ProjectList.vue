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
import { computed } from 'vue';
import Box from '../../components/Box/Box.vue';
import { useStore } from '@/store';
import StoreActions from '@/store/StoreActions';
import IProjectId from '@/interfaces/Project/IProjectId';
import { AxiosResponse } from 'axios';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import useNotifier from '@/hooks/notifier';
import StoreMutations from '@/store/StoreMutations';
import IProject from '@/interfaces/Project/IProject';

const store = useStore();
const notifier = useNotifier();

store.dispatch(StoreActions.GET_PROJECTS);

const projects: ComputedRef<IProject[]> = computed(() => (
    store.state.project.list
));

const isEmptyList: ComputedRef<boolean> = computed(() => {
    return store.state.project.list.length === 0;
});

const remove = async (id: number) : Promise<void> => {
    if (!confirm('Tem certeza que deseja remover esse projeto?')) {
        return;
    }

    const payload: IProjectId = { id };
    
    const response: AxiosResponse = await store.dispatch(
        StoreActions.DELETE_PROJECT,
        payload
    ).catch((error) => {
        const newNotification: INewNotification = {
            title: 'Erro na exclusão',
            content: `Ocorreu um erro ao tentar excluir o projeto: ${error}`,
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);
    });

    if (response.status === 200) {
        store.commit(
            StoreMutations.DELETE_PROJECT,
            payload
        );

        const newNotification: INewNotification = {
            title: 'Projeto removido',
            content: 'Seu projeto foi removido.',
            type: NotificationType.SUCCESS,
        };

        notifier.notify(newNotification);
    }
};

</script>

<style scoped>
.projects {
    padding: 1.25rem;
}
</style>