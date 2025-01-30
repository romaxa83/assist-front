import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import './assets/main.css';

const app = createApp(App);

// Восстанавливаем данные пользователя из localStorage
store.dispatch('auth/restoreSession');

app
    .provide('bootstrap', bootstrap)
    .use(store)
    .use(router)
    .mount('#app');
