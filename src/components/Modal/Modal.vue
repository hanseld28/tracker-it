<template>
    <div
        class="modal"
        :class="{ 'is-active': open }"
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Modal',
    emits: ['onClose'],
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleClose() : void {
            this.$emit('onClose');
        },
    },
})
</script>

<style>
</style>