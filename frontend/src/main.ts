import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import LoginView from './views/LoginView.vue'
import router from './router'

const app = createApp(App)
const login = createApp(LoginView)

login.use(createPinia())
login.use(router)

login.mount('#app')
