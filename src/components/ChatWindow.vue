<script setup>
import { ref, watch, nextTick } from 'vue';
import SendIcon from '../assets/icons/SendIcon.vue';
import LikeIcon from '../assets/icons/LikeIcon.vue';
import CopyIcon from '../assets/icons/CopyIcon.vue';
import RetryIcon from '../assets/icons/RetryIcon.vue';
import { useConfig } from '../composables/useConfig.js';

const { aiName, alertAIText, getModelById } = useConfig();

const props = defineProps({
  session: Object,
});

const emit = defineEmits(['update-session-name']);

const userMessage = ref('');
const isTyping = ref(false);
const chatContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};
watch(() => props.session.messages, scrollToBottom, { deep: true, immediate: true });

const sendMessage = async () => {
  if (userMessage.value.trim() === '' || isTyping.value) return;

  const message = userMessage.value;
  userMessage.value = '';

  if (props.session.messages.length === 0) {
    const sessionName = message.length > 30 ? message.substring(0, 30) + '...' : message;
    emit('update-session-name', props.session.id, sessionName);
  }

  props.session.messages.push({
    sender: 'user',
    text: message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  await processAIResponse(message);
};

const processAIResponse = async (message) => {
  isTyping.value = true;
  scrollToBottom();

  const sessionId = props.session.id;
  const modelId = props.session.model;
  const activeModel = getModelById(modelId);

  if (!activeModel) {
    console.error(`Model with id "${modelId}" not found in configuration`);
    props.session.messages.push({
      sender: 'ai',
      text: 'Error: Model configuration not found.',
    });
    isTyping.value = false;
    return;
  }

  const apiUrl = `${activeModel.endpoint}?message=${encodeURIComponent(message)}&sessionId=${sessionId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const aiText = data.jawaban?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memproses respons.";
    
    props.session.messages.push({
      sender: 'ai',
      text: aiText,
    });

  } catch (error) {
    console.error("API Error:", error);
    props.session.messages.push({
      sender: 'ai',
      text: 'Maaf, aku lagi badmood. gamau bales. hmph. ntr aj y.',
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('Teks berhasil disalin!');
    }).catch(err => {
        console.error('Gagal menyalin teks:', err);
    });
};
</script>

<template>
  <main class="chat-window" :class="{ 'empty-chat': session.messages.length === 0 }">
    <div class="chat-messages" ref="chatContainer">
      <div v-if="session.messages.length === 0" class="welcome-message">
        <p>Kamu mendapatkan berkah dari Seeker of Happines untuk mencari kebahagiaan di chatbot ini~ Yuk, langsung chat aja!</p>
      </div>
      <div v-for="(msg, index) in session.messages" :key="index" class="message-item" :class="`message-${msg.sender}`">
        <div v-if="msg.sender === 'user'" class="user-bubble">
          <p class="message-text">{{ msg.text }}</p>
          <span class="message-time">{{ msg.time }}</span>
        </div>
        <div v-else class="ai-response-container">
          <p class="ai-response">{{ msg.text }}</p>
          <div class="ai-actions">
            <button class="icon-button" @click="copyToClipboard(msg.text)">
              <CopyIcon />
            </button>
            
            <button class="icon-button">
              <LikeIcon />
            </button>
          </div>
        </div>
      </div>
       <div v-if="isTyping" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="chat-input-area">
      <div class="input-wrapper">
        <textarea
          v-model="userMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="Type your message..."
          rows="1"
        ></textarea>
        <button @click="sendMessage" :disabled="isTyping || !userMessage.trim()" class="send-btn">
          <SendIcon />
        </button>
      </div>
      <p class="footer-text">{{ aiName }} bisa membuat kesalahan. {{ alertAIText }}</p>
    </div>
  </main>
</template>

<style scoped>
.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--chat-bg);
  position: relative;
}

.chat-window.empty-chat {
  background: var(--empty-chat-bg, #000);
}

.chat-window.empty-chat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--empty-chat-bg);
  pointer-events: none;
  z-index: 0;
}

.chat-window.empty-chat::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--stars-pattern);
  background-size: 100px 100px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 1;
  animation: twinkle 6s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0%, 100% { opacity: var(--stars-opacity-low, 0.2); }
  50% { opacity: var(--stars-opacity-high, 1); }
}

.welcome-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-primary);
  font-size: 1.2rem;
  max-width: 80%;
  z-index: 1;
}

@media (max-width: 768px) {
  .chat-window {
    height: calc(100vh - 56px); /* Adjust for header height */
  }
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.message-item {
  display: flex;
  max-width: 75%;
}
.message-user {
  align-self: flex-end;
}
.message-ai {
  align-self: flex-start;
}

.user-bubble {
  background-color: var(--user-bubble-bg);
  color: var(--user-bubble-text);
  padding: 0.75rem 1rem;
  border-radius: 1.25rem 1.25rem 0.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.message-text {
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.message-time {
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.8;
}

.ai-response-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
}
.ai-response {
  background-color: transparent;
  color: var(--text-primary);
  padding: 0;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.ai-actions {
    margin-top: 0.5rem;
    display: flex;
    gap: 8px;
    align-items: center;
}

.chat-input-area {
  padding: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--input-bg);
  padding: 4px;
}
.input-wrapper:focus-within {
  border-color: var(--user-bubble-bg);
}

textarea {
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-family: var(--font-family);
  font-size: 1rem;
  color: var(--text-primary);
  resize: none;
  max-height: 150px;
  overflow-y: auto;
}
textarea:focus {
  outline: none;
}
textarea::placeholder {
  color: var(--text-secondary);
}

.send-btn {
  background-color: var(--user-bubble-bg);
  color: var(--user-bubble-text);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}
.send-btn:hover {
  opacity: 0.9;
}
.send-btn:disabled {
  background-color: var(--button-bg);
  cursor: not-allowed;
  opacity: 0.6;
}

.footer-text {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 1rem;
}
</style>