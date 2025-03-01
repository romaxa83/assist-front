<template>
  <div class="p-4">
    <h4 class="fst-italic">Tags</h4>

    <tag-item
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        :is-active="selectedTags.includes(tag)"
        @click="clickToTag(tag)"
    />
  </div>
</template>

<script>
import TagItem from '@/components/tags/TagItem.vue';
import { useTags } from "@/hooks/tags/public/useTags";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "TagsRow",
  components: {
    TagItem,
  },
  props: {
    modelValue: { // Поддержка v-model (аналог двусторонней привязки)
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:selected-tags"], // Событие для оповещения родителя об изменении
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();

    const { tags } = useTags();
    const selectedTags = ref([]);

    // Функция обработки клика по тегу
    const clickToTag = (tag) => {
      if (selectedTags.value.includes(tag)) {
        // Убираем тег из выбранных
        selectedTags.value = selectedTags.value.filter(
            (selectedTag) => selectedTag !== tag
        );
      } else {
        // Добавляем тег в выбранные
        selectedTags.value = [...selectedTags.value, tag];
      }

      // Передаем изменения в родительский компонент
      emit("update:selected-tags", selectedTags.value);
    };

    // Инициализация selectedTags из URL
    const initializeFromUrl = () => {
      const { tags: tagsFromUrl } = route.query; // Берем параметр `tags` из URL
      if (tagsFromUrl && tags.value.length > 0) {
        const slugs = tagsFromUrl.split(","); // Преобразуем URL string -> массив
        selectedTags.value = slugs
            .map((slug) => tags.value.find((tag) => tag.slug === slug))
            .filter(Boolean); // Исключаем отсутствующие или невалидные теги
      }
    };

    // Синхронизация selectedTags с URL при каждом изменении
    watch(
        selectedTags,
        (newSelectedTags) => {
          const slugs = newSelectedTags.map((tag) => tag.slug); // Преобразуем выбранные теги в список slug'ов
          router.push({
            query: {
              ...route.query, // Сохраняем существующие параметры URL
              tags: slugs.length ? slugs.join(",") : undefined, // Устанавливаем или убираем параметр `tags`
            },
          });
        },
        { deep: true } // Глубокое отслеживание изменений массива
    );

    // Отслеживаем обновление/загрузку тегов и повторяем инициализацию из URL
    watch(
        tags,
        () => {
          initializeFromUrl(); // Синхронизировать с URL при изменении доступных тегов
        },
        { immediate: true } // Синхронизация выполняется сразу при инициализации компонента
    );

    // При монтировании компонента
    onMounted(() => {
      initializeFromUrl(); // Синхронизируемся с URL сразу после загрузки
    });

    return {
      tags,
      selectedTags,
      clickToTag,
    };
  },
};
</script>

<style scoped>

</style>
