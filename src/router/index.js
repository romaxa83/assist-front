import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/pages/MainPage.vue";
import NotePage from "@/pages/notes/NotePage.vue";
import AdminTagsPage from "@/pages/admin/tags/TagsPage.vue";

const routes = [
  {path: '/', name: 'main', component: MainPage},
  {path: '/notes', name: 'note', component: NotePage},
  {path: '/admin/tags', name: 'admin-tags', component: AdminTagsPage},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
})

export default router
