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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Stopwatch',
    props: {
        timeInSeconds: {
            type: Number,
            default: 0
        }
    },
    computed: {
        elapsedTime () : string {
            const timeInMilliseconds = this.timeInSeconds * 1000;
            const timeInDate = new Date(timeInMilliseconds);
            const formattedTime = timeInDate
                .toISOString()
                .substring(11, 19);
            
            return formattedTime;
        },
    },
})
</script>

<style scoped>
.display {
    color: var(--text-primary);    
}
</style>