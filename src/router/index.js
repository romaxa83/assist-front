import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

import MainPage from "@/pages/MainPage.vue";
import NotePage from "@/pages/public/notes/NotePage.vue";
import PrivateTagsPage from "@/pages/private/tags/TagsPage.vue";
import PrivateNotesPage from "@/pages/private/notes/NotesPage.vue";
import PrivateNotePage from "@/pages/private/notes/NotePage.vue";
import PrivateNoteCreatePage from "@/pages/private/notes/NoteCreatePage.vue";
import PrivateNoteUpdatedPage from "@/pages/private/notes/NoteUpdatePage.vue";
import NotFoundPage from "@/pages/error/NotFoundPage.vue";



const routes = [
  {path: '/', name: 'main', component: MainPage},
  {path: '/notes', name: 'note', component: NotePage},
  {path: '/notes/:slug', name: 'note', component: NotePage},
  {
    path: '/admin/tags',
    name: 'admin-tags',
    component: PrivateTagsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes',
    name: 'admin-notes',
    component: PrivateNotesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes/create',
    name: 'admin-notes-create',
    component: PrivateNoteCreatePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes/update/:id',
    name: 'admin-notes-update',
    component: PrivateNoteUpdatedPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/notes/:id',
    name: 'admin-notes-show',
    component: PrivateNotePage,
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
