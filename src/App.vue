<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import Cookies from 'js-cookie';
import Sidebar from './components/Sidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import Header from './components/Header.vue';
import { useConfig } from './composables/useConfig.js';

const { aiName, models, getFirstModelId } = useConfig();

const sessions = reactive({});
const activeSessionId = ref(null);
const theme = ref('dark'); 
const activeModel = ref(getFirstModelId());
const isSidebarOpen = ref(false); 

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const createNewChat = () => {
  const newId = generateSessionId();
  sessions[newId] = {
    id: newId,
    name: `New Chat ${Object.keys(sessions).length + 1}`,
    model: activeModel.value,
    messages: [],
    createdAt: new Date(),
  };
  activeSessionId.value = newId;
  isSidebarOpen.value = false;
};

const updateSessionName = (sessionId, newName) => {
  if (sessions[sessionId]) {
    sessions[sessionId].name = newName;
  }
};

const deleteSession = (sessionId) => {
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    if (activeSessionId.value === sessionId) {
      const remainingIds = Object.keys(sessions);
      activeSessionId.value = remainingIds.length > 0 ? remainingIds[0] : null;
      if (!activeSessionId.value) {
        createNewChat();
      }
    }
  }
};

const switchSession = (sessionId) => {
  if (sessions[sessionId]) {
    activeSessionId.value = sessionId;
    activeModel.value = sessions[sessionId].model;
    isSidebarOpen.value = false;
  }
};

const changeModel = (modelId) => {
  activeModel.value = modelId;
  if (activeSessionId.value && sessions[activeSessionId.value]) {
    sessions[activeSessionId.value].model = modelId;
  }
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.body.className = `${theme.value}-mode`;
  localStorage.setItem('chatbot-theme', theme.value);
  
  updateStarsTheme();
};

const updateStarsTheme = () => {
  const root = document.documentElement;
  
  if (theme.value === 'dark') {
    root.style.setProperty('--empty-chat-bg', '#000000');
    
    root.style.setProperty('--stars-pattern', `
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 45% 55%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 65% 25%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 35% 5%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 55% 45%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 75% 65%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 95% 15%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 5% 35%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 50% 20%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 20% 60%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 12% 50%, rgba(255,255,255,0.7), transparent)
    `);
    
    root.style.setProperty('--stars-opacity-low', '0.4');
    root.style.setProperty('--stars-opacity-high', '1');
  } else {
    root.style.setProperty('--empty-chat-bg', '#ffffff');
    
    root.style.setProperty('--stars-pattern', `
      radial-gradient(1px 1px at 10% 15%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 25% 35%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 45% 55%, rgba(0,0,0,0.5), transparent),
      radial-gradient(1px 1px at 65% 25%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 85% 75%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 15% 85%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 35% 5%, rgba(0,0,0,0.5), transparent),
      radial-gradient(1px 1px at 55% 45%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 75% 65%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 95% 15%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 5% 35%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 30% 80%, rgba(0,0,0,0.5), transparent),
      radial-gradient(1px 1px at 50% 20%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 70% 90%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 90% 40%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 20% 60%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 40% 10%, rgba(0,0,0,0.5), transparent),
      radial-gradient(1px 1px at 60% 70%, rgba(0,0,0,0.3), transparent),
      radial-gradient(1px 1px at 80% 30%, rgba(0,0,0,0.4), transparent),
      radial-gradient(1px 1px at 12% 50%, rgba(0,0,0,0.3), transparent)
    `);
    
    root.style.setProperty('--stars-opacity-low', '0.2');
    root.style.setProperty('--stars-opacity-high', '0.5');
  }
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  const savedTheme = localStorage.getItem('chatbot-theme');
  if (savedTheme) {
    theme.value = savedTheme;
  }
  document.body.className = `${theme.value}-mode`;
  
  updateStarsTheme();

  const savedSessions = Cookies.get('chat-sessions');
  if (savedSessions) {
    try {
      Object.assign(sessions, JSON.parse(savedSessions));
      const sessionIds = Object.keys(sessions);
      if (sessionIds.length > 0) {
        activeSessionId.value = sessionIds[0];
        activeModel.value = sessions[activeSessionId.value].model;
      } else {
        createNewChat();
      }
    } catch (e) {
      console.error("Failed to parse sessions from cookie:", e);
      Cookies.remove('chat-sessions'); 
      createNewChat();
    }
  } else {
    createNewChat();
  }
});

watch(sessions, (newSessions) => {
  Cookies.set('chat-sessions', JSON.stringify(newSessions), { expires: 365 });
}, { deep: true });
</script>

<template>
  <div id="app-layout">
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    <Sidebar
      :sessions="sessions"
      :activeSessionId="activeSessionId"
      :class="{ 'is-open': isSidebarOpen }"
      @new-chat="createNewChat"
      @switch-session="switchSession"
      @delete-session="deleteSession"
      @close-sidebar="toggleSidebar"
    />
    <div class="main-content">
      <Header
        :models="models"
        :activeModel="activeModel"
        :theme="theme"
        @toggle-theme="toggleTheme"
        @change-model="changeModel"
        @toggle-sidebar="toggleSidebar"
      />
      <ChatWindow
        v-if="activeSessionId && sessions[activeSessionId]"
        :key="activeSessionId"
        :session="sessions[activeSessionId]"
        @update-session-name="updateSessionName"
      />
      <div v-else class="no-chat-selected">
          <h1>Welcome to {{ aiName }}</h1>
          <p>Start a new conversation from the sidebar.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
  color: var(--text-primary);
  overflow: hidden;
}

.main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.no-chat-selected {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
}

.sidebar-overlay {
    display: none;
}

@media (max-width: 768px) {
    .sidebar-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 15;
    }
}
</style>