<template>
    <Button
        @click="click"
        :disabled="disabled"
    >
    <span class="icon">
        <i :class="icon"></i>
    </span>
    <span>       
        <slot></slot>
    </span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue';

export default defineComponent({
    name: "IconButton",
    emits: [
        "click",
    ],
    props: {
        icon: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        click(...args: []) : void {
            this.$emit("click", ...args);
        },
    },
    components: {
        Button,
    }
});
</script>

<style>
</style>