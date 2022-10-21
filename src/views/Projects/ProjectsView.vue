<template>
    <section class="container">
        <router-view></router-view>
    </section>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProjectsView',
});
</script>

<style scoped>
.container {
    padding: 1.25rem;
}
</style>