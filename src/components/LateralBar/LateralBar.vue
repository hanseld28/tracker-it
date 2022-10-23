<template>
    <header>
        <div class="header-part">
            <img
                src="../../assets/logo-tracker-it.png"
                alt="Logotipo Tracker.it"
            >
            <div class="change-theme-button">
                <div class="buttons has-addons is-centered">
                    <button
                        class="button is-small"
                        :class="isLightModeActive && 'is-selected selected-theme-mode'"
                        @click="changeThemeToLight"
                    >
                        <i class="fas fa-sun"></i>
                    </button>
                    <button
                        class="button is-small"    
                        :class="isSystemModeActive && 'is-selected selected-theme-mode'"
                        @click="changeThemeToSystem"
                    >
                        <i class="fas fa-circle-half-stroke"></i>
                    </button>
                    <button
                        class="button is-small"
                        :class="isDarkModeActive && 'is-selected selected-theme-mode'"
                        @click="changeThemeToDark"
                    >
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
            <nav class="mt-5">
                <ul>
                    <li>
                        <RouterLink to="/" class="link">
                            <i class="fas fa-tasks"></i>
                            Tarefas
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/projects" class="link">
                            <i class="fas fa-project-diagram"></i>
                            Projetos
                        </RouterLink>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import { defineEmits, ref, computed } from 'vue';
import { ThemeMode } from '../../interfaces/Theme/types';

const emit = defineEmits([
    'onThemeChange',
]);

const activeMode: Ref<ThemeMode> = ref(ThemeMode.LIGHT);

const isSystemModeActive: ComputedRef<boolean> = computed(() => {
    return activeMode.value === ThemeMode.SYSTEM;
});

const isLightModeActive: ComputedRef<boolean> = computed(() => {
    return activeMode.value === ThemeMode.LIGHT;
});

const isDarkModeActive: ComputedRef<boolean> = computed(() => {
    return activeMode.value === ThemeMode.DARK;
});

const changeThemeToLight = () : void => {
    activeMode.value = ThemeMode.LIGHT;
    emit('onThemeChange', activeMode.value);
};

const changeThemeToSystem = () : void => {
    activeMode.value = ThemeMode.SYSTEM;
    emit('onThemeChange', activeMode.value);
};

const changeThemeToDark = () : void => {
    activeMode.value = ThemeMode.DARK;
    emit('onThemeChange', activeMode.value);
};

</script>

<style scoped>
header {
    background: #000;
    border-right: var(--primary-main) solid 6px;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    padding: 1.5rem;
    display: flex;
    align-content: center;
    text-align: center;
    flex-direction: column;
}

@media only screen and (max-width: 768px) {
    header {
        padding: 2.5rem;
        height: auto;
    }   
}
.change-theme-button {
    margin-top: 8px;
}

nav {
    display: flex;
    justify-content: center;
}
nav li {
    display: flex;
    margin: 8px 0;
}
.link {
    color: #fff;
}
.link:hover {
    color: #00CC8F;
}
.link.router-link-active {
    color: #00CC8F;
}

.selected-theme-mode {
    background-color: #00ffb3;
    border-color: #00CC8F;
}
.selected-theme-mode:focus {
    box-shadow: 0px 0px 2px 0px rgba(0,255,179,1) !important;
}

</style>