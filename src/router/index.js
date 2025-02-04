import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

import MainPage from "@/pages/MainPage.vue";
import NotePage from "@/pages/notes/NotePage.vue";
import AdminTagsPage from "@/pages/admin/tags/TagsPage.vue";
import AdminNotesPage from "@/pages/admin/notes/NotesPage.vue";
import AdminNoteCreatePage from "@/pages/admin/notes/NoteCreatePage.vue";
import AdminNoteUpdatedPage from "@/pages/admin/notes/NoteUpdatePage.vue";
import NotFoundPage from "@/pages/error/NotFoundPage.vue";



const routes = [
  {path: '/', name: 'main', component: MainPage},
  {path: '/notes', name: 'note', component: NotePage},
  {
    path: '/admin/tags',
    name: 'admin-tags',
    component: AdminTagsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes',
    name: 'admin-notes',
    component: AdminNotesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes/create',
    name: 'admin-notes-create',
    component: AdminNoteCreatePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes/update/:id',
    name: 'admin-notes-update',
    component: AdminNoteUpdatedPage,
    meta: { requiresAuth: true }
  },
  // Маршрут для страницы 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
})

// Добавляем глобальный навигационный гвард
router.beforeEach((to, from, next) => {
  // Проверяем, требует ли маршрут авторизации, используя vuex
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = store.state.auth.authToken;

    // console.log('isAuthenticated', store.state.auth.authToken);
    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на стр. 404
      return next({
        name: 'not-found',
        params: { pathMatch: to.path.substring(1).split('/') }
      });
    }
  }
  // Если всё ок, пропускаем
  next();
});


export default router
