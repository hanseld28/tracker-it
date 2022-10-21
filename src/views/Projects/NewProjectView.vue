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
  
<script lang="ts">
import { defineComponent } from 'vue';
import ProjectForm from '../../components/ProjectForm/ProjectForm.vue';
import IProject from '../../interfaces/Project/IProject';
import Box from '../../components/Box/Box.vue';
import { useStore } from '@/store';
import { FormMode } from '@/interfaces/Form';
import { INewNotification, NotificationType } from '@/interfaces/Notifications';
import useNotifier from '@/hooks/notifier';
import StoreActions from '@/store/StoreActions';
import { AxiosResponse } from 'axios';
import StoreMutations from '@/store/StoreMutations';

export default defineComponent({
    name: 'NewProjectView',
    components: {
        Box,
        ProjectForm,
    },
    data() {
        return {
            mode: FormMode.CREATE,
        };
    },
    methods: {
        async save(project: IProject) {
            const response: AxiosResponse = await this.store.dispatch(
                StoreActions.SAVE_PROJECT,
                project
            ).catch((error) => {
                const newNotification: INewNotification = {
                    title: 'Erro na criação',
                    content: `Ocorreu um erro ao tentar criar o projeto: ${error}`,
                    type: NotificationType.ERROR,
                };
    
                this.notifier.notify(newNotification);
            });

            if (response.status === 201) {
                this.store.commit(
                    StoreMutations.SAVE_PROJECT,
                    response.data
                );

                const newNotification: INewNotification = {
                    title: 'Projeto criado',
                    content: 'Seu novo projeto já está disponível.',
                    type: NotificationType.SUCCESS,
                };
    
                this.notifier.notify(newNotification);
    
                this.$router.replace('/projects');
            }
        },
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