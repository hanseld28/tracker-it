<template>
    <button class="button" @click="click" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Button',
    emits: [
        'click',
    ],
    props: {
        icon: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        click(...args: []) : void {
            this.$emit('click', ...args);
        },
    },
});
</script>

<style>
</style>