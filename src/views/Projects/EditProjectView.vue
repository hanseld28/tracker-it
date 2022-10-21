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
  
<script lang="ts">
import { defineComponent } from 'vue';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';
import { useStore } from '@/store';
import { FormMode } from '@/interfaces/Form/index';
import StoreActions from '@/store/StoreActions';
import { AxiosResponse } from 'axios';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import useNotifier from '@/hooks/notifier';
import config from '@/config';
import StoreMutations from '@/store/StoreMutations';

export default defineComponent({
    name: 'EditProjectView',
    components: {
        Box,
        ProjectForm,
    },
    props: {
        id: {
            type: String,
        },
    },
    data() {
        return {
            mode: FormMode.CONSULT,
            project: {} as IProject,
        }
    },
    methods: {
        async save(project: IProject) {
            const response: AxiosResponse = await this.store.dispatch(
                StoreActions.UPDATE_PROJECT,
                project
            ).catch(() => {
                const newNotification: INewNotification = {
                    title: 'Erro na alteração',
                    content: 'Ocorreu um erro ao tentar alterar o projeto.',
                    type: NotificationType.ERROR,
                };
    
                this.notifier.notify(newNotification);
            });

            if (response.status === 200) {
                this.store.commit(
                    StoreMutations.UPDATE_PROJECT,
                    response.data
                );

                this.$router.replace(`/${config.PROJECTS_API_ENDPOINT}/${project.id}/edit`);
            }

        },
    },
    mounted() {
        const foundProject = this.store.state.project.list.find((current) => (
            current.id === Number(this.id)
        ));

        if (foundProject === undefined) {
            const notification: INewNotification = {
                title: 'Erro',
                content: 'Projeto não encontrado',
                type: NotificationType.ERROR
            };
    
            this.notifier.notify(notification);
    
            this.$router.replace(`/${config.PROJECTS_API_ENDPOINT}`);

            return;
        }
        
        this.project = foundProject;
    },
    setup() {
        const store = useStore();
        const notifier = useNotifier();

        return {
            store,
            notifier,
        };
    }
});
</script>

<style scoped>
.container {
    padding: 1.25rem;
}
</style>