import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import TasksView from '@/views/Tasks/TasksView.vue';
import ProjectsView from '@/views/Projects/ProjectsView.vue';
import ListProjectsView from '@/views/Projects/ListProjectsView.vue';
import NewProjectView from '@/views/Projects/NewProjectView.vue';
import EditProjectView from '@/views/Projects/EditProjectView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Tarefas',
        component: TasksView,
    },
    {
        path: '/projects',
        name: 'Projetos',
        component: ProjectsView,
        children: [
            {
                path: '',
                name: 'Projetos',
                component: ListProjectsView,
            },
            {
                path: 'new',
                name: 'Novo Projeto',
                component: NewProjectView,
            },
            {
                path: ':id/edit',
                name: 'Editar Projeto',
                component: EditProjectView,
                props: true,
            }
        ],
    },    
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;