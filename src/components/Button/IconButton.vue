<template>
    <Button
        @click="click"
        :disabled="props.disabled"
    >
        <span class="icon">
            <i :class="props.icon"></i>
        </span>
        <span>       
            <slot></slot>
        </span>
    </Button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import Button from './Button.vue';

const emit = defineEmits([
    'click',
]);

const props = defineProps({
    icon: {
        type: String,
        default: "",
    },
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