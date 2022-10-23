<template>
    <div class="notifications">
        <Alert
            v-for="notification in notifications"
            :key="notification.id"
            :title="notification.title"
            :severityClass="context[notification.type]"
        >
            {{ notification.content }}
        </Alert>
    </div>
</template>

<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import { ref, computed } from 'vue';
import Alert from '../Alert/Alert.vue';
import { useStore } from '@/store';
import { INotification, NotificationType } from '@/interfaces/Notifications';

const store = useStore();

const context: Ref<{ SUCCESS: string; WARNING: string; ERROR: string; }> = ref({
    [NotificationType.SUCCESS]: 'is-success',
    [NotificationType.WARNING]: 'is-warning',
    [NotificationType.ERROR]: 'is-danger',
});

const notifications: ComputedRef<INotification[]> = computed(() => (
    store.state.notification.list
));

</script>

<style scoped>
.notifications {
    position: absolute;
    right: 0;
    width: 300px;
    padding: 8px;
    z-index: 101;
}
</style>