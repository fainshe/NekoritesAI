<script setup>
import PlusIcon from '../assets/icons/PlusIcon.vue';
import TrashIcon from '../assets/icons/TrashIcon.vue';
import CloseIcon from '../assets/icons/CloseIcon.vue';

const props = defineProps({
  sessions: Object,
  activeSessionId: String,
});

const emit = defineEmits(['newChat', 'switchSession', 'deleteSession', 'closeSidebar']);

const sortedSessions = () => {
  return Object.values(props.sessions).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
</script>

<template>
  <aside class="sidebar-container">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="$emit('newChat')">
        <PlusIcon />
      </button>
      <button class="close-btn icon-button" @click="$emit('closeSidebar')">
        <CloseIcon />
      </button>
    </div>

    <nav class="session-list">
      <a
        v-for="session in sortedSessions()"
        :key="session.id"
        href="#"
        class="session-item"
        :class="{ active: session.id === activeSessionId }"
        @click.prevent="$emit('switchSession', session.id)"
      >
        <span class="session-name">{{ session.name }}</span>
        <button class="icon-button delete-btn" @click.stop="$emit('deleteSession', session.id)">
            <TrashIcon />
        </button>
      </a>
    </nav>

    <footer class="sidebar-footer">
      <p>Copyright 2025 Fainshe.</p>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar-container {
  width: 260px;
  flex-shrink: 0;
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar-container {
    width: 250px;
    left: -250px;
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-chat-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-chat-btn:hover {
  background-color: var(--button-hover-bg);
}

.close-btn {
  display: none;
}

@media (max-width: 768px) {
  .close-btn {
    display: block;
  }
}

.session-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  margin-bottom: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.session-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-item:hover {
  background-color: var(--button-hover-bg);
  color: var(--text-primary);
}

.session-item.active {
  background-color: var(--user-bubble-bg);
  color: var(--user-bubble-text);
  font-weight: 500;
}

.delete-btn {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
}
.session-item:hover .delete-btn {
    visibility: visible;
    opacity: 1;
    color: var(--text-secondary);
}
.session-item.active .delete-btn {
    color: var(--user-bubble-text);
}
.session-item.active:hover .delete-btn:hover,
.session-item:hover .delete-btn:hover {
    background-color: rgba(0,0,0,0.1);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.sidebar-footer p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}
</style>