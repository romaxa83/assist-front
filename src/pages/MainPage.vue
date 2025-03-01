<template>
    <div class="container">
      <div class="row g-5">
        <div class="col-md-8">
          <div>
            <notes-row
                :notes="notes"
            />
          </div>
        </div>
        <div class="col-md-4">
          <div class="position-sticky">
            <tags-row
                @update:selected-tags="updateSelectedTags"
            />
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import Sidebar from "@/components/navbar/Sidebar.vue";
import TagsRow from "@/components/tags/TagsRow.vue";
import NotesRow from "@/components/notes/NotesRow.vue";
import {onMounted, ref} from "vue";
import {useNotes} from "@/hooks/notes/public/useNotes";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "MainPage",
  components: {
    TagsRow,
    NotesRow,
    Sidebar
  },
  setup(){
    const router = useRouter();
    const route = useRoute();

    const {notes, fetching} = useNotes();

    // Метод обновления заметок при изменении тегов
    const updateSelectedTags = async (selectedTags) => {
      try {
        // Обновляем параметры URL на основе выбранных тегов
        router.push({
          query: {
            ...route.query,
            tags: selectedTags.map(tag => tag.slug).join(',') || undefined,
          }
        });

        // Загружаем заметки из API с новыми тегами
        await fetching({
          tags: selectedTags.map(tag => tag.slug),
        });

      } catch (error) {
        console.error("Ошибка при обновлении заметок:", error);
      }
    };


    onMounted(async () => {
      // Считываем параметры из URL
      const {
        tags: selectedTags,
      } = route.query;

      // Выполняем запрос с параметрами
      await fetching({
        tags: selectedTags ? selectedTags.split(',') : [],
      });
    });

    return {
      notes,
      updateSelectedTags

    }
  }
}
</script>

<style scoped>

</style>