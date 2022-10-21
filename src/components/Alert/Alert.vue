<template>
    <article
        class="message"
        :class="severityClass"
    >
        <div class="message-header">
            {{ title }}            
        </div>
        <div class="message-body">
            <slot></slot>
        </div>
    </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Alert',
    props: {
        severityClass: {
            type: String
        },
        title: {
            type: String,
        }
    },
});
</script>

<style scoped>
</style>