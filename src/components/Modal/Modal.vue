<template>
    <div
        class="modal"
        :class="{ 'is-active': props.open }"
        @keyup="handleKeyUp"
    >
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    <slot name="title"></slot>
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="handleClose"
                ></button>
            </header>
            <section class="modal-card-body">
                <slot name="content"></slot>
            </section>
            <footer class="modal-card-foot">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits([
    'onClose',
]);

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

const handleClose = () : void => {
    emit('onClose');
};

const handleKeyUp = (e: KeyboardEvent) : void => {
    if (e.key === 'Escape') {
        handleClose();
        return;
    }
};

</script>

<style>
</style>