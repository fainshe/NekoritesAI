<script setup>
import { ref, onMounted } from 'vue';
import SunIcon from '../assets/icons/SunIcon.vue';
import MoonIcon from '../assets/icons/MoonIcon.vue';
import MenuIcon from '../assets/icons/MenuIcon.vue';
import { useConfig } from '../composables/useConfig.js';

const { aiName, shortAiName } = useConfig();

const props = defineProps({
  models: Array,
  activeModel: String,
  theme: String,
});

const emit = defineEmits(['toggleTheme', 'changeModel', 'toggleSidebar']);

const isTitleExpanded = ref(true);

onMounted(() => {
  setTimeout(() => {
    isTitleExpanded.value = false;
  }, 5000);
});
</script>

<template>
  <header class="header-container">
    <div class="header-left">
      <button class="hamburger-btn icon-button" @click="$emit('toggleSidebar')">
          <MenuIcon />
      </button>
      <h1 class="header-title" :class="{ 'is-shrunk': !isTitleExpanded }">
        <span v-if="isTitleExpanded">{{ aiName }}</span>
        <span v-else>{{ shortAiName }}</span>
      </h1>
    </div>

    <div class="header-right">
      <div class="model-switcher">
        <select
          :value="activeModel"
          @change="$emit('changeModel', $event.target.value)"
        >
          <option v-for="model in models" :key="model.id" :value="model.id">{{ model.name }}</option>
        </select>
      </div>
      <button class="icon-button" @click="$emit('toggleTheme')">
        <SunIcon v-if="theme === 'dark'" />
        <MoonIcon v-else />
      </button>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
  align-items: center;
  background-color: var(--chat-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hamburger-btn {
  display: none;
}
@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
  }
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: font-size 0.5s ease-in-out, width 0.5s ease-in-out;
  overflow: hidden;
  white-space: nowrap;
}

.header-title.is-shrunk {
    font-size: 1.25rem;
    width: 3.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.model-switcher select {
  background-color: var(--button-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
}
</style>