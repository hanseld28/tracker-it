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
                            tarefas
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/projects" class="link">
                            <i class="fas fa-project-diagram"></i>
                            projetos
                        </RouterLink>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ThemeMode } from '../../interfaces/Theme/types';

export default defineComponent({
    name: 'LateralBar',
    emits: [
        'onThemeChange',
    ],
    data() {
        return {
            activeMode: ThemeMode.LIGHT,
        };
    },
    computed: {
        isSystemModeActive() : boolean {
            return this.activeMode === ThemeMode.SYSTEM;
        },
        isLightModeActive() : boolean {
            return this.activeMode === ThemeMode.LIGHT;
        },
        isDarkModeActive() : boolean {
            return this.activeMode === ThemeMode.DARK;
        }, 
    },
    methods: {
        changeThemeToLight() {
            this.activeMode = ThemeMode.LIGHT;
            this.$emit('onThemeChange', this.activeMode);
        },
        changeThemeToSystem() {
            this.activeMode = ThemeMode.SYSTEM;
            this.$emit('onThemeChange', this.activeMode);
        },
        changeThemeToDark() {
            this.activeMode = ThemeMode.DARK;
            this.$emit('onThemeChange', this.activeMode);
        },
    },
})
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