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
  
<script setup lang="ts">
import ProjectList from '../../components/ProjectList/ProjectList.vue';

</script>

<style scoped>
</style>