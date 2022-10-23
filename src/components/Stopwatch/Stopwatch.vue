<template>
    <section>
        <span class="icon">
            <i class="fas fa-clock"></i>
        </span>
        <strong class="display">
            {{ elapsedTime }}
        </strong>
    </section>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
    timeInSeconds: {
        type: Number,
        default: 0,
    },
});

const elapsedTime: ComputedRef<string> = computed(() => {
    const timeInMilliseconds = props.timeInSeconds * 1000;
    const timeInDate = new Date(timeInMilliseconds);
    const formattedTime = timeInDate
        .toISOString()
        .substring(11, 19);
    
    return formattedTime;
});

</script>

<style scoped>
.display {
    color: var(--text-primary);    
}
</style>