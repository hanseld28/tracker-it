<template>
    <div
        :id="`task-${tabindex}`"
        :tabindex="tabindex"
        class="task-box-wrapper"
        @click="onClick"
        @dblclick="onEdit"
        @keyup="onKeyUp"    
    >
        <Box class="task-box">
            <div class="columns">
                <div class="column is-6">
                    {{ getTaskDescriptionLabel(task) }}
                </div>
                <div class="column is-4">
                    <span class="tag is-light">
                        {{ getTaskProjectNameLabel(task) }}
                    </span>
                </div>
                <div class="column">
                    <Stopwatch
                        :timeInSeconds="task.timeInSeconds"
                    />
                </div>
            </div>
        </Box>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { defineEmits, defineProps } from 'vue';
import ITask from '@/interfaces/Task/ITask';
import Box from '../Box/Box.vue';
import Stopwatch from '../Stopwatch/Stopwatch.vue';
import ITaskId from '@/interfaces/Task/ITaskId';

const emit = defineEmits([
    'onEdit',
]);

const props = defineProps({
    task: {
        type: Object as PropType<ITask>,
        required: true,
    },
    tabindex: {
        type: Number,
    },
});

const onEdit = () : void => {
    const payload: ITaskId = {
        id: props.task.id,
    };

    emit('onEdit', payload);
};

const onClick = () : void => {
    const taskElement = document.getElementById(`task-${props.tabindex}`);
    taskElement?.focus();
};

const onKeyUp = (e: KeyboardEvent) : void => {
    if (e.key === 'Enter') {
        const taskElement: HTMLElement | null = document.getElementById(
            `task-${props.tabindex}`
        );
        taskElement?.blur();

        onEdit();
        
        return;
    }
};

const getTaskDescriptionLabel = (task: ITask) : string => {
    return task.description || '(tarefa sem descrição)';
};

const getTaskProjectNameLabel = (task: ITask) : string => {
    return task.project?.name || '(N/D)';
};

</script>

<style scoped>
.task-box:hover {
    cursor: pointer;
}

.task-box-wrapper {
    position: relative;
    margin: 1rem;
    border-radius: 8px;
    padding-bottom: 6px;
    padding-right: 6px; 
    z-index: 1;
}
.task-box-wrapper::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding-bottom: 6px;
    padding-right: 6px; 
    background-image: linear-gradient(130deg, rgb(0, 0, 0) 0%, var(--primary-main) 65%, rgb(103, 255, 209) 100%);
    z-index: -1;
    transition: opacity 0.5s ease;
    opacity: 0;
}
.task-box-wrapper:hover::before {
    opacity: 1;
}

.task-box-wrapper:focus {
    outline: none;
    border-radius: 8px;
    padding-bottom: 6px;
    padding-right: 6px; 
    background: var(--primary-main);
}
</style>