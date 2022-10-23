<template>
    <article
        class="message"
        :class="props.severityClass"
    >
        <div class="message-header">
            {{ props.title }}            
        </div>
        <div class="message-body">
            <slot></slot>
        </div>
    </article>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    severityClass: {
        type: String
    },
    title: {
        type: String,
    },
});

</script>

<style scoped>
</style>