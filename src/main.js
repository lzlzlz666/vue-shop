import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue3-emoji-picker/css';
import Vue3EmojiPicker from 'vue3-emoji-picker';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App)
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(Vue3EmojiPicker);

app.mount('#app')