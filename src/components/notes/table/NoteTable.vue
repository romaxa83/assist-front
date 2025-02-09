<template>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col">

        <div class="sort-header">
          ID
          <div class="sort-buttons">
            <!-- Верхний треугольник для сортировки по возрастанию -->
            <div
                class="triangle-up active"
                title="Sort ascending"
            ></div>

            <!-- Нижний треугольник для сортировки по убыванию -->
            <div
                class="triangle-down"
                title="Sort descending"
            ></div>

          </div>
        </div>


      </th>
      <th scope="col">Title</th>
      <th scope="col">Status</th>
      <th scope="col" class="sort-column">
        <div class="sort-header">
          Weight
          <div class="sort-buttons">
            <!-- Верхний треугольник для сортировки по возрастанию -->
            <div
                class="triangle-up"
                title="Sort ascending"
            ></div>

            <!-- Нижний треугольник для сортировки по убыванию -->
            <div
                class="triangle-down"
                title="Sort descending"
            ></div>

          </div>

<!--          <button-->
<!--              class="sort-button"-->
<!--              :class="{ active: sortKey === 'id' && sortOrder === 'asc' }"-->
<!--              title="Sort ID Asc"-->
<!--              @click="sortNotes('id', 'asc')"-->
<!--          >-->
<!--            <i class="fa-solid fa-arrow-up"></i>-->
<!--          </button>-->
<!--          <button-->
<!--              class="sort-button"-->
<!--              :class="{ active: sortKey === 'id' && sortOrder === 'desc' }"-->
<!--              title="Sort ID Desc"-->
<!--              @click="sortNotes('id', 'desc')"-->
<!--          >-->
<!--            <i class="fa-solid fa-arrow-down"></i>-->
<!--          </button>-->

        </div>



      </th>
      <th scope="col">Created</th>
      <th scope="col" class="text-center actions-column">Action</th>
    </tr>
    </thead>
    <tbody>

    <tr
        v-for="note in notes"
        :key="note.id"
        :note="note"
        class="table-warning"
    >
      <th scope="row">{{ note.id }}</th>
      <td>{{ note.title }}</td>
      <td>{{ note.status }}</td>
      <td>{{ note.weight }}</td>
      <td>{{ note.created_at }}</td>
      <td class="d-flex justify-content-end">

        <!-- Кнопка редактирования -->

        <button
            class="btn btn-sm btn-warning me-2"
            title="Edit"
            @click="toNotePage(note)"
        >
          <i class="fa-solid fa-eye" style="color: #333;"></i>
        </button>

        <button
            class="btn btn-sm btn-warning me-2"
            title="Edit"
            @click="toUpdatePage(note)"
        >
          <i class="fa-solid fa-pen" style="color: #333;"></i>
        </button>

        <button
            class="btn btn-sm btn-warning"
            title="Delete"
            @click="$emit('remove', note)"
        >
          <i class="fa-solid fa-trash" style="color: #333;"></i>
        </button>

      </td>

    </tr>

    </tbody>
  </table>
</template>

<script>
import {useRouter} from "vue-router";
import {useNotes} from "@/hooks/notes/useNotes";
import axios from "@/services/axios";

export default {
  name: "NoteTable",
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const toUpdatePage = (note) => router.push(`/admin/notes/update/${note.id}`);
    const toNotePage = (note) => router.push(`/notes/${note.id}`);

    const removeNote = async (note) => {
      try {
        await axios.delete(`api/notes/${note.id}`,{
          withAuth: true,
        });

        router.push('/admin/notes');
      } catch (error) {
        console.error("Ошибка при remove:", error);
      }
    }

    return {
      toUpdatePage,
      toNotePage,
      removeNote
    }
  },
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
