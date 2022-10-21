<template>
  <main class="columns is-gapless is-multiline" :class="{ 'dark-mode': isDarkModeActive }">
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

<script lang="ts">
import { defineComponent } from 'vue';
import { ThemeMode } from './interfaces/Theme/types';
import LateralBar from './components/LateralBar/LateralBar.vue';
import Notifier from './components/Notifier/Notifier.vue';

export default defineComponent({
  name: 'App',
  components: {
    LateralBar,
    Notifier,
  },
  data() {
    return {
      activeMode: ThemeMode.LIGHT,
    };
  },
  computed: {
    isDarkModeActive() : boolean {
      return this.activeMode === ThemeMode.DARK;
    },
  },
  methods: {
    changeThemeMode(changedMode: ThemeMode) {
      this.activeMode = changedMode;
    },
  },
});
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
