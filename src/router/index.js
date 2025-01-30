import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/pages/MainPage.vue";
import NotePage from "@/pages/notes/NotePage.vue";

const routes = [
  {path: '/', name: 'main', component: MainPage},
  {path: '/notes', name: 'note', component: NotePage},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
