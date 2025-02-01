import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import './assets/main.css';
import directives from "@/directives";
import components from '@/components/ui';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


const app = createApp(App);

// Восстанавливаем данные пользователя из localStorage
store.dispatch('auth/restoreSession');

// Глобально регистрируем компоненты
components.forEach(component => {
    app.component(component.name, component);
});

// регистрируем собственные директивы
directives.forEach(directive => {
    app.directive(directive.name, directive);
});

app
    .provide('bootstrap', bootstrap)
    .use(store)
    .use(router)
    .mount('#app');
