<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <!-- Кнопка предыдущей страницы -->
      <li
          :class="['page-item', isDisabled(previousPageUrl) ? 'disabled' : '']"
          @click="emitChange(previousPageUrl)"
      >
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- Список страниц (фильтруем только страницы без текстов Previous/Next) -->
      <li
          v-for="link in filteredLinks"
          :key="link.label"
          :class="['page-item', link.active ? 'active' : '', isDisabled(link.url) ? 'disabled' : '']"
          @click="emitChange(link.url)"
      >
        <a class="page-link" href="#" v-html="link.label"></a>
      </li>

      <!-- Кнопка следующей страницы -->
      <li
          :class="['page-item', isDisabled(nextPageUrl) ? 'disabled' : '']"
          @click="emitChange(nextPageUrl)"
      >
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: "Pagination",
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
  emits: ["change-page"],

  computed: {
    // Вычисляем URL для кнопок "Previous" и "Next"
    previousPageUrl() {
      return this.meta.links.find((link) =>
          link.label.includes("Previous")
      )?.url;
    },
    nextPageUrl() {
      return this.meta.links.find((link) => link.label.includes("Next"))?.url;
    },

    // Фильтруем только обычные страницы (исключаем Previous и Next)
    filteredLinks() {
      return this.meta.links.filter(
          (link) =>
              !link.label.includes("Previous") && !link.label.includes("Next")
      );
    },
  },
  methods: {
    // Проверяем, доступна ли ссылка
    isDisabled(url) {
      return !url;
    },
    // Эмитим событие изменения страницы
    emitChange(url) {
      if (!url) return; // Игнорируем клики, если URL недоступен
      this.$emit("change-page", url);
    },
  },

};
</script>

<style scoped>
/* Стили пагинации */
.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

/* Стили элементов */
.page-item .page-link {
  background-color: var(--pagination-item-background-color);
  color: var(--pagination-item-color);
  border: 1px solid var(--pagination-item-border-color); /* Светлая рамка */
  padding: 10px 15px; /* Внутренние отступы для кнопок */
  text-decoration: none; /* Убираем подчеркивание */
  font-weight: bold; /* Полужирный текст */
  transition: background-color 0.3s ease, color 0.3s ease; /* Плавный переход */
  outline: none;
  box-shadow: none;
}

/* Ховер-эффект для кнопок */
.page-item .page-link:hover {
  background-color: var(--pagination-item-hover-background-color); /*  фон при наведении */
  color: var(--pagination-item-hover-color); /* текст при наведении */
}

/* Активный элемент */
.page-item.active .page-link {
  background-color: var(--pagination-item-active-background-color); /*фон для активной кнопки */
  color: var(--pagination-item-active-color); /* текст для активной кнопки */
  border-color: var(--pagination-item-active-background-color); /*  рамка */
}

/* Отключенные элементы */
.page-item.disabled .page-link {
  background-color: var(--pagination-item-disabled-background-color) !important; /* фон */
  color: var(--pagination-item-disabled-color) !important; /* текст */
  pointer-events: none; /* Запрещаем клик */
}

/* Убираем обводку при фокусе */
.page-item .page-link:focus {
  outline: none; /* Полностью убираем контур при фокусе */
  box-shadow: none;
}
</style>
