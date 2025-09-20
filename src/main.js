import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { useConfig } from './composables/useConfig.js'

// Set dynamic document title and meta tags from config
const { aiName } = useConfig();
document.title = aiName.value;

// Update Open Graph title
const ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) {
  ogTitle.setAttribute('content', aiName.value);
}

createApp(App).mount('#app')