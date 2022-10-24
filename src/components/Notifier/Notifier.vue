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
import type { Ref } from 'vue';
import { ref } from 'vue';
import Alert from '../Alert/Alert.vue';
import { NotificationType } from '@/interfaces/Notifications';
import { useNotifier } from '@/hooks/notifier';

const { notifications } = useNotifier();

const context: Ref<{ SUCCESS: string; WARNING: string; ERROR: string; }> = ref({
    [NotificationType.SUCCESS]: 'is-success',
    [NotificationType.WARNING]: 'is-warning',
    [NotificationType.ERROR]: 'is-danger',
});

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