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
import { FormMode } from '@/interfaces/Form/index';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';
import config from '@/config';
import { useNotifier } from '@/hooks/notifier';
import { useProjectStore } from '@/stores/ProjectStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const notifier = useNotifier();

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);

const props = defineProps([
    'id'
]);

const mode: Ref<FormMode> = ref(FormMode.CONSULT);
const project: Ref<IProject> = ref({} as IProject);

const save = async (project: IProject) : Promise<void> => {
    projectStore.update(project)
};

onMounted(() => {
    const foundProject = projects.value.find((current) => (
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