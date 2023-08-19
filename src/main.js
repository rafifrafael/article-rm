import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';

const app = createApp(App)

const token = localStorage.getItem('user-token');
if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

app.use(createPinia())
app.use(router)

app.mount('#app')
