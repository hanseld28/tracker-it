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

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Alert from '../Alert/Alert.vue';
import { useStore } from '@/store';
import { NotificationType } from '@/interfaces/Notifications';

export default defineComponent({
    name: 'Notifier',
    components: {
        Alert,
    },
    data() {
        return {
            context: {
                [NotificationType.SUCCESS]: 'is-success',
                [NotificationType.WARNING]: 'is-warning',
                [NotificationType.ERROR]: 'is-danger',
            },
        };
    },
    setup() {
        const store = useStore();

        return {
            notifications: computed(() => (
                store.state.notification.list
            )),
        };
    },
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