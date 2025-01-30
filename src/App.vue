<template>
  <navbar></navbar>

  <main class="app">
    <router-view></router-view>
  </main>

  <bottom></bottom>
</template>

<script>
import Navbar from "@/components/navbar/Navbar.vue";
import Bottom from "@/components/footer/Bottom.vue";

export default {
  components: {
    Navbar,
    Bottom
  }
}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
html {
  height: 100%; /* Убедимся, что высота body и html занимают всю высоту окна */
}

#app {
  display: flex;
  flex-direction: column; /* Flexbox на корневом элементе */
  min-height: 100vh; /* Высота в 100% от высоты экрана */
}

.app {
  padding: 20px;
  flex: 1; /* Основной контент занимает оставшееся пространство */
}

.footer {
  margin-top: auto; /* Сдвигает футер вниз */
  background-color: #f8f9fa;
}

</style>