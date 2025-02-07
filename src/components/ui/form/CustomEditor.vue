<template>
  <div class="form-group">
    <label :for="id" class="form-label">
      {{ label }}
    </label>
    <!-- QuillEditor -->
    <div ref="quillContainer" class="quill-editor"></div>

  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import hljs from "highlight.js";
// import "highlight.js/styles/atom-one-dark.css";

import Quill from "quill";

// Делаем Highlight.js доступным для Quill
// if (typeof window !== "undefined") {
//   window.hljs = hljs;
// }


export default {
  name: "CustomEditor",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const quillContainer = ref(null);
    let quillInstance = null;

    // Инициализация Quill
    onMounted(() => {
      quillInstance = new Quill(quillContainer.value, {
        theme: "snow", // или "bubble" для другой темы
        placeholder: "Введите текст...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // Инструменты форматирования
            ["blockquote", "code-block"],
            [{ header: [2, 3, 4, 5, 6, false] }],
            ["link", "image", "video"],
            [{ indent: "-1" }, { indent: "+1" }],   // Отступы
            [{ list: "ordered" }, { list: "bullet" }],  // Списки
            [{ align: [] }], // Выравнивание текста
            ["clean"] // Очистка форматирования
          ],
        }
      });

      // Устанавливаем начальное значение (если передано из родителя)
      if (props.modelValue) {
        quillInstance.root.innerHTML = props.modelValue;
      }

      // Слушаем изменения текста и обновляем данные родителя
      quillInstance.on("text-change", () => {
        emit("update:modelValue", quillInstance.root.innerHTML);
      });
    });

    // Слежение за изменениями modelValue
    watch(
        () => props.modelValue,
        (newValue) => {
          if (quillInstance && newValue !== quillInstance.root.innerHTML) {
            quillInstance.root.innerHTML = newValue || ""; // Обновляем содержимое редактора
          }
        }
    );

    return {
      quillContainer
    };
  }
};
</script>

<style scoped>
.quill-editor {
  height: 500px;
  max-height: 600px;
  overflow-y: auto; /* Активирует прокрутку, если текст слишком большой */
  border: 1px solid #ccc; /* Рамка вокруг редактора (опционально) */
  padding: 15px; /* Внутренние отступы редактора */
  box-sizing: border-box; /* Корректный учет размеров */

}
</style>