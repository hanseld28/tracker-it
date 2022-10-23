<template>
  <main
    class="columns is-gapless is-multiline"
    :class="{
      'dark-mode': isDarkModeActive
    }"
  >
    <div class="column is-one-quarter">
      <LateralBar
        :themeMode="activeMode"
        @on-theme-change="changeThemeMode"
      />
    </div>
    <div class="column is-three-quarter content">
      <Notifier />
      <RouterView />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import { ref, computed } from 'vue';
import { ThemeMode } from './interfaces/Theme/types';
import LateralBar from './components/LateralBar/LateralBar.vue';
import Notifier from './components/Notifier/Notifier.vue';

const activeMode: Ref<ThemeMode> = ref(ThemeMode.LIGHT);

const isDarkModeActive: ComputedRef<boolean> = computed(() => {
  return activeMode.value === ThemeMode.DARK;
});

const changeThemeMode = (changedMode: ThemeMode) => {
  activeMode.value = changedMode;
};

</script>

<style>
.list {
  padding: 1.25rem;
}
main {
  --bg-primary: #fff;
  --text-primary: #000;
  --primary-main: #00ffb3;
}
main.dark-mode {
  --bg-primary: #161616;
  --text-primary: #ddd;
  --primary-main: #2f2f2f;
}

.content {
  background-color: var(--bg-primary);
}
</style>
