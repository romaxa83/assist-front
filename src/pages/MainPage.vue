<template>
    <div class="container">
      <div class="row g-5">
        <div class="col-md-8">
          <div class="search_note">
            <input-simple
                v-model="search"
                :placeholder="'Search note'"
            />
          </div>
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
import TagsRow from "@/components/tags/TagsRow.vue";
import NotesRow from "@/components/notes/NotesRow.vue";
import {onMounted, ref, watch} from "vue";
import {useNotes} from "@/hooks/notes/public/useNotes";
import {useRoute, useRouter} from "vue-router";
import InputSimple from "@/components/ui/form/InputSimple.vue";

export default {
  name: "MainPage",
  components: {
    InputSimple,
    TagsRow,
    NotesRow,
  },
  setup(){
    const router = useRouter();
    const route = useRoute();

    const search = ref("");

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

    // Следим за изменением строки поиска
    watch(search, async (newValue) => {
      const { tags: selectedTags } = route.query;

      if (newValue.length > 3) { // Если строка поиска длиннее 3 символов
        await fetching({
          search: newValue,
          tags: selectedTags ? selectedTags.split(',') : []
        });
      } else if (newValue.length === 0) {
        await fetching({
          tags: selectedTags ? selectedTags.split(',') : []
        });
      }
    });

    return {
      notes,
      updateSelectedTags,
      search
    }
  }
}
</script>

<style scoped>
.search_note{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>