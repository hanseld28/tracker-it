<template>
    <ProjectList>
        <router-link
            class="button is-primary"
            to="/projects/new"
        >
            <span class="icon is-small">
                <i class="fas fa-plus"></i>
            </span>
            <span>Novo Projeto</span>
        </router-link>
    </ProjectList>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ProjectList from '../../components/ProjectList/ProjectList.vue';

export default defineComponent({
    name: 'ListProjectsView',
    components: {
        ProjectList,
    },
});
</script>

<style scoped>
</style>