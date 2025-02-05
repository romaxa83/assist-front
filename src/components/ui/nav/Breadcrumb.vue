<template>

  <div class="container">
    <div class="row g-5">
      <div class="breadcrumb-panel col-md-10">
        <nav
            v-if="breadcrumbs.length"
            aria-label="breadcrumb"
        >
          <ol class="breadcrumb">
            <li
                v-for="(item, index) in breadcrumbs"
                :key="index"
                :class="['breadcrumb-item', { active: index === breadcrumbs.length - 1 }]"
                :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
            >
              <!-- Если не последний элемент, делаем ссылку -->
              <a
                  v-if="index !== breadcrumbs.length - 1"
                  :href="item.href"
              >
                {{ item.label }}
              </a>
              <!-- Если это последний элемент, выводим текст -->
              <span v-else>
          {{ item.label }}
        </span>
            </li>
          </ol>
        </nav>

      </div>
    </div>
  </div>

</template>
<script>
import NoteTable from "@/components/notes/table/NoteTable.vue";

export default {
  name: "Breadcrumb",
  components: {NoteTable},
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

}
</script>

<style scoped>
nav {
  padding: 0; /* Убирает внутренние отступы у nav */
  margin: 0; /* Убирает внешние отступы у nav */
}
nav * {
  padding: 0; /* Убирает внутренние отступы у всех дочерних элементов внутри nav */
  margin: 0; /* Убирает внешние отступы у всех дочерних элементов внутри nav */
}

.breadcrumb-panel {
  background-color: #f6f4cd; /* Цвет фона */
  display: flex; /* Используем flexbox для управления выравниванием */
  align-items: center; /* Выравниваем элементы по вертикали */
  justify-content: center; /* Выравниваем текст по горизонтали (по центру) */
  padding: 10px; /* Отступ для удобного просмотра */
  border-radius: 5px; /* Добавляем чуть закруглённые углы для красоты */
}
</style>
