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
import "highlight.js/styles/default.css";

import Quill from "quill";



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

    // Функция очистки лишних элементов (например, <select> в блоках кода)
    function cleanCodeBlocks(html) {
      const container = document.createElement("div");
      container.innerHTML = html;

      // Удаляем <select> из блоков кода
      container.querySelectorAll(".ql-code-block-container select").forEach((select) => {
        select.remove();
      });

      // Возвращаем очищенный HTML
      return container.innerHTML;
    }

    // Подсветка кода через Highlight.js
    function highlightCodeBlocks(root) {
      const codeBlocks = root.querySelectorAll("pre.ql-syntax");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block); // Применяем подсветку
      });
    }




    // Инициализация Quill
    onMounted(() => {
      quillInstance = new Quill(quillContainer.value, {
        theme: "snow", // или "bubble" для другой темы
        placeholder: "Введите текст...",
        modules: {
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },

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

      // Изначальная установка значения modelValue
      if (props.modelValue) {
        quillInstance.root.innerHTML = props.modelValue;
        highlightCodeBlocks(quillInstance.root); // Применение подсветки
      }


      // Слушаем изменения текста и обновляем данные родителя
      quillInstance.on("text-change", () => {
        emit("update:modelValue", quillInstance.root.innerHTML);
        highlightCodeBlocks(quillInstance.root); // Применяем подсветку к новым текстам

      });
    });

    // Слежение за изменениями modelValue
    watch(
        () => props.modelValue,
        (newValue) => {
          if (quillInstance && newValue !== quillInstance.root.innerHTML) {
            quillInstance.root.innerHTML = newValue || ""; // Обновляем содержимое редактора
            highlightCodeBlocks(quillInstance.root); // Применяем подсветку

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