<template>
    <Box>
        <router-link
            class="button"
            to="/projects"
        >
            <span class="icon is-small">
                <i class="fas fa-arrow-left"></i>
            </span>
            <span>Voltar</span>
        </router-link>
        <h2 class="title">Projeto</h2>
    </Box>
    <Box>
        <ProjectForm
            @on-save="save"
            v-bind:data="project"
            :initialMode="mode"
        />
    </Box>
</template>
  
<script setup lang="ts">
import type { Ref } from 'vue';
import { defineProps, ref, onMounted } from 'vue';
import { Router, useRouter } from 'vue-router';
import { AxiosResponse } from 'axios';
import { useStore } from '@/store';
import { FormMode } from '@/interfaces/Form/index';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';
import StoreActions from '@/store/StoreActions';
import config from '@/config';
import useNotifier from '@/hooks/notifier';
import StoreMutations from '@/store/StoreMutations';

const store = useStore();
const notifier = useNotifier();
const router: Router = useRouter();

const props = defineProps([
    'id'
]);

const mode: Ref<FormMode> = ref(FormMode.CONSULT);
const project: Ref<IProject> = ref({} as IProject);

const save = async (project: IProject) : Promise<void> => {
    const response: AxiosResponse = await store.dispatch(
        StoreActions.UPDATE_PROJECT,
        project
    ).catch(() => {
        const newNotification: INewNotification = {
            title: 'Erro na alteração',
            content: 'Ocorreu um erro ao tentar alterar o projeto.',
            type: NotificationType.ERROR,
        };

        notifier.notify(newNotification);
    });

    if (response.status === 200) {
        store.commit(
            StoreMutations.UPDATE_PROJECT,
            response.data
        );

        router.replace(`/${config.PROJECTS_API_ENDPOINT}/${project.id}/edit`);
    }
};

onMounted(() => {
    const foundProject = store.state.project.list.find((current) => (
        current.id === Number(props.id)
    ));

    if (foundProject === undefined) {
        const notification: INewNotification = {
            title: 'Erro',
            content: 'Projeto não encontrado',
            type: NotificationType.ERROR
        };

        notifier.notify(notification);

        router.replace(`/${config.PROJECTS_API_ENDPOINT}`);

        return;
    }
    
    project.value = foundProject;
});

</script>

<style scoped>
.container {
    padding: 1.25rem;
}
</style>