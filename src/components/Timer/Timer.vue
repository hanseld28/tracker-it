<template>
    <div class="is-flex is-align-items-center is-justify-content-space-between">
        <Stopwatch :timeInSeconds="timeInSeconds" />
        <IconButton
            icon="fas fa-play"
            @click="play"
            v-if="isIdle"
            :disabled="disabledPlay"
        >
            play
        </IconButton>
        <IconButton
            icon="fas fa-stop"
            @click="stop"
            v-if="isRunning"
            :disabled="disabledStop"
        >
            stop
        </IconButton>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Stopwatch from '../Stopwatch/Stopwatch.vue';
import { TimerStatus } from '../../interfaces/Timer/types';
import type { TimerStopPayload } from '../../interfaces/Timer/types';
import IconButton from '../Button/IconButton.vue';

export default defineComponent({
    name: 'Timer',
    emits: [
        'onStart',
        'onStop',
    ],
    components: {
        Stopwatch,
        IconButton,
    },
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            timeInSeconds: 0,
            timerId: 0,
            status: TimerStatus.IDLE,
        };
    },
    computed: {
      isIdle() : boolean {
        return this.status === TimerStatus.IDLE;
      },  
      isRunning() : boolean {
        return this.status === TimerStatus.RUNNING;
      },
      disabledPlay() : boolean {
        return this.disabled || this.isRunning;
      },
      disabledStop() : boolean {
        return this.disabled || this.isIdle;
      },
    },
    methods: {
        play() {
            this.timerId = setInterval(() => {
                this.timeInSeconds += 1;
            }, 1000);
            this.status = TimerStatus.RUNNING;

            const payload = {
                status: this.status,
            };

            this.$emit('onStart', payload);
        },
        stop() {
            clearInterval(this.timerId);

            const payload: TimerStopPayload = {
                timeInSeconds: this.timeInSeconds,
            };
            
            this.$emit('onStop', payload);

            this.timeInSeconds = 0;
            this.status = TimerStatus.IDLE;
        }
    },
});

</script>

<style>
</style>