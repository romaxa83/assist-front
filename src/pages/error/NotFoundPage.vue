<template>
  <div class="not-found">
    <h1>404 - Страница не найдена</h1>
    <p>Вы пытались перейти по адресу: <strong>{{ path }}</strong></p>
    <router-link to="/">Вернуться на главную страницу</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  computed: {
    // Получаем путь, который пользователь ввёл
    path() {
      return this.$route.params.pathMatch
          ? '/' + this.$route.params.pathMatch.join('/')
          : '/';
    },
  },
};
</script>

<style>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>