<template>
  <div class="sort-header">
    <!-- Название колонки -->
    <slot></slot>
    <div class="sort-buttons">
      <!-- Верхний треугольник для сортировки по возрастанию -->
      <div
          class="triangle-up"
          :class="{ active: isActive && direction === 'asc' }"
          title="Sort ascending"
          @click="handleSort('asc')"
      ></div>

      <!-- Нижний треугольник для сортировки по убыванию -->
      <div
          class="triangle-down"
          :class="{ active: isActive && direction === 'desc' }"
          title="Sort descending"
          @click="handleSort('desc')"

      ></div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      required: true,
    },
    activeSort: {
      type: Object,
      required: true,
      default: () => ({ field: null, direction: null }) // Текущая активная сортировка
    }
  },
  name: "SortColumn",
  computed: {
    isActive() {
      return this.activeSort.field === this.field; // Колонка активна, если переданное поле совпадает с текущим
    },
    direction() {
      return this.activeSort.direction; // Направление сортировки
    }
  },
  methods: {
    handleSort(direction) {
      if (this.isActive && this.direction === direction) {
        // Если уже нажата та же кнопка, возвращаем, чтобы избежать лишнего действия
        return;
      }
      // Передаём родителю данное поле и направление сортировки
      this.$emit('sort', { field: this.field, direction });
    }
  }
}
</script>

<style scoped>
/* Заголовок с кнопками (в одном ряду) */
.sort-header {
  display: flex;
  align-items: center; /* Вертикальное выравнивание текста и треугольников */
  gap: 5px; /* Расстояние (отступ) между заголовком и кнопками */
  white-space: nowrap; /* Запрещаем перенос текста и кнопок на новую строку */
}

/* Контейнер для кнопок сортировки (треугольников) */
.sort-buttons {
  display: flex;
  flex-direction: column; /* Располагаем треугольники вертикально */
  justify-content: center; /* Центрируем кнопки вертикально */
  align-items: center; /* Горизонтальное выравнивание внутри контейнера */
  gap: 5px; /* Отступ между верхним и нижним треугольником */
  height: auto; /* Автовысота контейнера */
  width: 18px; /* Ширина для вертикального стека кнопок */
}

/* Верхний треугольник (стрелка вверх) */
.sort-buttons .triangle-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent; /* Прозрачная левая сторона границы */
  border-right: 8px solid transparent; /* Прозрачная правая сторона границы */
  border-bottom: 8px solid var(--btn-sort-border-color); /* Нижняя граница треугольника */
  cursor: pointer; /* Указатель "рука" при наведении */
  transition: transform 0.2s, border-bottom-color 0.3s; /* Анимация */
}

/* Нижний треугольник (стрелка вниз) */
.sort-buttons .triangle-down {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--btn-sort-border-color); /* Верхняя граница треугольника */
  cursor: pointer;
  transition: transform 0.2s, border-top-color 0.3s;
}

/* При наведении на треугольник вверх */
.sort-buttons .triangle-up:hover {
  transform: scale(1.2); /* Увеличиваем треугольник при наведении */
  border-bottom-color: var(--btn-sort-hover-border-color); /* Меняем цвет нижней границы на чёрный */
}

/* При наведении на треугольник вниз */
.sort-buttons .triangle-down:hover {
  transform: scale(1.2); /* Увеличиваем треугольник при наведении */
  border-top-color: var(--btn-sort-hover-border-color); /* Меняем цвет верхней границы на чёрный */
}

/* Активный треугольник (выбран для сортировки) */
.sort-buttons .triangle-up.active {
  border-bottom-color: var(--btn-sort-hover-border-color); /* цвет для активного треугольника вверх */
}

.sort-buttons .triangle-down.active {
  border-top-color: var(--btn-sort-hover-border-color); /* цвет для активного треугольника вниз */
}

/* Текст заголовка (необязательно, просто для выравнивания стиля) */
.sort-header span {
  font-weight: bold;
  font-size: 14px;
}
</style>