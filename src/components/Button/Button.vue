<template>
    <button class="button" @click="click" :disabled="props.disabled">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits([
    'click'
]);

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const click = (...args: []) : void => {
    emit('click', ...args);
};

</script>

<style>
</style>