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
import { Router, useRouter } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '@/interfaces/Form';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import useNotifier from '@/hooks/notifier';
import StoreMutations from '@/store/StoreMutations';
import StoreActions from '@/store/StoreActions';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';

const store = useStore();
const notifier = useNotifier();
const router: Router = useRouter();

const mode: Ref<FormMode> = ref(FormMode.CREATE);

const save = async (project: IProject) : Promise<void> => {
    const response: AxiosResponse = await store.dispatch(
        StoreActions.SAVE_PROJECT,
        project
    ).catch((error: AxiosError | Error) => {
        const newNotification: INewNotification = {
            title: 'Erro na criação',
            content: `Ocorreu um erro ao tentar criar o projeto: ${error.message}`,
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);
    });

    if (response.status === 201) {
        store.commit(
            StoreMutations.SAVE_PROJECT,
            response.data
        );

        const newNotification: INewNotification = {
            title: 'Projeto criado',
            content: 'Seu novo projeto já está disponível.',
            type: NotificationType.SUCCESS,
        };

        notifier.notify(newNotification);

        router.replace('/projects');
    }
};

</script>

<style scoped>
.container {
    padding: 1.25rem;
}
</style>