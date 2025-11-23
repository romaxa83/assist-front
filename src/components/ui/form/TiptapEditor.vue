<template>
  <div class="form-group container-tiptap-editor" ref="editorContainer">
    <label :for="id" class="form-label">
      {{ label }}
    </label>

    <!-- Панель инструментов -->
    <div class="tiptap-toolbar" v-if="editor" ref="toolbarRef">
      <button
          type="button"
          @click="toggleBold"
          :class="{ active: editor.isActive('bold') }"
      ><i class="fa-solid fa-bold"></i></button>
      <button
          type="button"
          @click="toggleItalic"
          :class="{ active: editor.isActive('italic') }"
      ><i class="fa-solid fa-italic"></i></button>
      <button
          type="button"
          @click="toggleUnderline"
          :class="{ active: editor.isActive('underline') }"
      ><i class="fa-solid fa-underline"></i></button>
      <button
          type="button"
          @click="toggleStrike"
          :class="{ active: editor.isActive('strike') }"
      ><i class="fa-solid fa-strikethrough"></i></button>
      <button
          type="button"
          @click="toggleHeading(2)"
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
      >H2</button>
      <button
          type="button"
          @click="toggleHeading(3)"
          :class="{ active: editor.isActive('heading', { level: 3 }) }"
      >H3</button>
      <button
          type="button"
          @click="toggleHeading(4)"
          :class="{ active: editor.isActive('heading', { level: 4 }) }"
      >H4</button>
      <button
          type="button"
          @click="toggleHeading(5)"
          :class="{ active: editor.isActive('heading', { level: 5 }) }"
      >H5</button>
      <button
          type="button"
          @click="toggleHeading(6)"
          :class="{ active: editor.isActive('heading', { level: 6 }) }"
      >H6</button>
      <button
          type="button"
          @click="toggleBlockquote"
          :class="{ active: editor.isActive('blockquote') }"
       ><i class="fas fa-quote-left blockquote-icon"></i></button>
      <button
          type="button"
          @click="toggleCode"
          :class="{ active: editor.isActive('code') }"
      ><i class="fa-solid fa-code"></i></button>
      <button
          type="button"
          @click="toggleCodeBlock"
          :class="{ active: editor.isActive('codeBlock') }"
      ><i class="fa-solid fa-file-code"></i></button>
      <button
          type="button"
          @click="toggleOrderList"
          :class="{ active: editor.isActive('orderedList') }"
      ><i class="fa-solid fa-list-ol"></i></button>
      <button
          type="button"
          @click="toggleBulletList"
          :class="{ active: editor.isActive('bulletList') }"
      ><i class="fa-solid fa-list"></i></button>
      <button
          type="button"
          @click="setTextAlign('left')"
          :class="{ active: editor.isActive({ textAlign: 'left' })}"
      ><i class="fa-solid fa-align-left"></i></button>

      <button
          type="button"
          @click="setTextAlign('center')"
          :class="{ active: editor.isActive({ textAlign: 'center' })}"
      ><i class="fa-solid fa-align-center"></i></button>
      <button
          type="button"
          @click="setTextAlign('right')"
          :class="{ active: editor.isActive({ textAlign: 'right' })}"
      ><i class="fa-solid fa-align-right"></i></button>
      <button
          type="button"
          @click="setTextAlign('justify')"
          :class="{ active: editor.isActive({ textAlign: 'justify' })}"
      ><i class="fa-solid fa-align-justify"></i></button>

      <button
          type="button"
          @click="addLink"
          :class="{ active: editor.isActive('link') }"
      ><i class="fa-solid fa-link"></i></button>
      <button
          type="button"
          @click="removeLink"
      ><i class="fa-solid fa-unlink"></i></button>
    </div>

    <div class="toolbar-placeholder" ref="placeholderRef"></div>

    <!-- Контент редактора -->
    <div class="tiptap-editor" ref="editorRef">
      <editor-content :editor="editor" />
    </div>

  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, nextTick} from "vue";
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

export default {
  name: "TiptapEditor",
  components: {
    EditorContent,
  },
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
    const editor = ref(null);

    const placeholderRef = ref(null); // Ссылка на placeholder
    const toolbarRef = ref(null); // Toolbar (для sticky поведения)
    const editorContainer = ref(null); // Ссылка на контейнер редактора
    let observer = null; // Сохраняем экземпляр IntersectionObserver


    // Функция для обработки пересечения (sticky для тулбара)
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          // Если placeholder выходит из зоны видимости (фиксируем тулбар)
          if (toolbarRef.value && editorContainer.value) {
            const editorRect = editorContainer.value.getBoundingClientRect(); // Получаем размеры редактора

            toolbarRef.value.classList.add("sticky");
            toolbarRef.value.style.width = `${editorRect.width}px`; // Ограничиваем ширину тулбара
            toolbarRef.value.style.left = `${editorRect.left}px`; // Устанавливаем позицию относительно окна
          }
        } else {
          // Сбрасываем стили, если placeholder возвращается в зону видимости
          if (toolbarRef.value) {
            toolbarRef.value.classList.remove("sticky");
            toolbarRef.value.style.width = "";
            toolbarRef.value.style.left = "";
          }
        }
      });
    };

    // Инициализация редактора
    onMounted(() => {
      editor.value = new Editor({
        content: props.modelValue || "",
        extensions: [
          StarterKit,
          Underline,
          TextAlign.configure({
            types: ['heading', 'paragraph'], // Укажите, для каких типов узлов включить выравнивание
          }),
          Link.configure({
            openOnClick: true, // Открывать ссылки при клике
            HTMLAttributes: {
              rel: 'noopener',
            },
          }),
        ],
        onUpdate: ({ editor }) => {
          emit("update:modelValue", editor.getHTML());
        },
      });

      // Настраиваем IntersectionObserver
      const observer = new IntersectionObserver(handleIntersection, {
        root: null, // Отслеживаем относительно области просмотра (viewport)
        rootMargin: "0px", // Можно добавить отступ для более раннего срабатывания
        threshold: 0, // Срабатывает, когда элемент пересекает границу (0 - как только он касается области просмотра)
      });

      // Подключаем наблюдатель к placeholder
      if (placeholderRef.value) {
        observer.observe(placeholderRef.value);
      }
    });

    onBeforeUnmount(() => {
      // Уничтожение редактора при удалении компонента
      if (editor.value) {
        editor.value.destroy();
      }
      // Отключаем наблюдатель
      if (observer && placeholderRef.value) {
        observer.unobserve(placeholderRef.value);
      }
      if (observer) {
        observer.disconnect();
      }
    });

    // Обновление редактора при изменении modelValue снаружи
    watch(() => props.modelValue, (newValue) => {
          if (editor.value && editor.value.getHTML() !== newValue) {
            editor.value.commands.setContent(newValue || "");
          }
        }
    );


    const toggleBold = () => {
      editor.value?.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
      editor.value?.chain().focus().toggleItalic().run();
    };

    const toggleUnderline = () => {
      editor.value?.chain().focus().toggleUnderline().run();
    };

    const toggleCode = () => {
      editor.value?.chain().focus().toggleCode().run();
    };

    const toggleCodeBlock = () => {
      editor.value?.chain().focus().toggleCodeBlock().run();
    };

    const toggleStrike = () => {
      editor.value?.chain().focus().toggleStrike().run();
    };

    const toggleHeading = (level) => {
      editor.value?.chain().focus().toggleHeading({ level }).run();
    };
    const toggleBlockquote = () => {
      editor.value?.chain().focus().toggleBlockquote().run();
    };

    const toggleOrderList = () => {
      editor.value?.chain().focus().toggleOrderedList().run();
    };
    const toggleBulletList = () => {
      editor.value?.chain().focus().toggleBulletList().run();
    };

    const setTextAlign = (alignment) => {
      editor.value?.chain().focus().setTextAlign(alignment).run();
    };

    const addLink = () => {
      const url = prompt('Введите URL ссылки'); // Окно для ввода ссылки
      if (url) {
        editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    };

    const removeLink = () => {
      editor.value?.chain().focus().unsetLink().run();
    };

    return {
      editor,
      placeholderRef,
      toolbarRef,
      editorContainer,
      toggleBold,
      toggleItalic,
      toggleUnderline,
      toggleStrike,
      toggleHeading,
      toggleCode,
      toggleCodeBlock,
      toggleOrderList,
      toggleBulletList,
      toggleBlockquote,
      setTextAlign,
      addLink,
      removeLink,

    };
  }
};
</script>

<style>
/* Общие стили для компонента */
.container-tiptap-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
/* Toolbar */
.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #eae3e3;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, left 0.3s ease; /* Добавляем плавность изменений */
}

.tiptap-toolbar button {
  flex: 0 1 auto; /* Позволяет кнопкам занимать пространство и перестраиваться */
  min-width: 40px;
  padding: 6px 12px;
  font-size: 14px;
  color: var(--btn-action-color);
  background-color: var(--btn-action-background);
  border: 1px solid var(--btn-action-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tiptap-toolbar button:hover {
  background-color: var(--btn-action-hover-background);
  color: var(--btn-action-hover-color);
}

.tiptap-toolbar button.active {
  background-color: var(--btn-action-active-background);
  color: var(--btn-action-active-color);
  border-color: var(--btn-action-active-border-color);
}

.tiptap-toolbar.sticky {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: auto; /* Ширина задается через JS */
  left: auto; /* Позиция задаётся через JS */
  max-width: 100%; /* На случай мобильных экранов */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Контейнер редактора */
.tiptap-editor {
  display: flex; /* Используем Flexbox */
  flex-direction: column; /* Убедимся, что ProseMirror растягивается вниз */
  height: 100%; /* Или можно задать фиксированную высоту, например 300px */
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  padding: 0; /* Убираем внутренние отступы контейнера */
  box-sizing: border-box; /* Учитываем границы и паддинги */
}

.tiptap-editor .ProseMirror {
  flex-grow: 1; /* Растягиваем поле ввода на всю высоту контейнера */
  min-height: 300px; /* Сбрасываем минимальную высоту по умолчанию */
  padding: 10px; /* Внутренний отступ */
  box-sizing: border-box; /* Учитываем отступы в размерах */
  overflow-y: auto; /* Добавляем скролл при переполнении */
}

/* Сброс внешних отступов у всех параграфов и других блочных элементов */
.tiptap-editor .ProseMirror > * {
  margin: 0;
}

@media (max-width: 600px) {
  .tiptap-toolbar button {
    flex: 0 1 20%; /* Кнопки займут одинаковую ширину на маленьких экранах */
    font-size: 12px; /* Уменьшение текста на малых экранах */
  }
}

</style>




