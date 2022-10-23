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

<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import { defineEmits, defineProps, ref, computed } from 'vue';
import Stopwatch from '../Stopwatch/Stopwatch.vue';
import { TimerStatus } from '../../interfaces/Timer/types';
import type { TimerStopPayload } from '../../interfaces/Timer/types';
import IconButton from '../Button/IconButton.vue';

const emit = defineEmits([
    'onStart',
    'onStop',
]);

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const timeInSeconds: Ref<number> = ref(0);
const timerId: Ref<number> = ref(0);
const status: Ref<TimerStatus> = ref(TimerStatus.IDLE);

const isIdle: ComputedRef<boolean> = computed(() : boolean => {
    return status.value === TimerStatus.IDLE;
});

const isRunning: ComputedRef<boolean> = computed(() : boolean => {
    return status.value === TimerStatus.RUNNING;
});

const disabledPlay: ComputedRef<boolean> = computed(() : boolean => {
    return props.disabled || isRunning.value;
});

const disabledStop: ComputedRef<boolean> = computed(() : boolean => {
    return props.disabled || isIdle.value;
});

const play = () : void => {
    timerId.value = setInterval(() => {
        timeInSeconds.value += 1;
    }, 1000);

    status.value = TimerStatus.RUNNING;

    const payload = {
        status: status.value,
    };

    emit('onStart', payload);
};

const stop = () : void => {
    clearInterval(timerId.value);

    const payload: TimerStopPayload = {
        timeInSeconds: timeInSeconds.value,
    };
    
    emit('onStop', payload);

    timeInSeconds.value = 0;
    status.value = TimerStatus.IDLE;
};

</script>

<style>
</style>