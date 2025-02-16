import {onMounted ,ref, computed} from "vue";
import axios from "@/services/axios";

export function useTags() {
    const tags = ref([]);

    const fetching = async () => {
        try {
            const res = await axios.get('/api/private/tags', {withAuth: true})
            if(res.status === 200){
                tags.value = res.data;
            }
        } catch (e) {
            alert('Error Fetch Tags', e)
        }
    }

    // Обработанные теги для селекта
    const tagsFormatForSelect = computed(() =>
        tags.value.map((tag) => ({
            label: tag.name,
            value: tag.id,
        }))
    );


    onMounted(fetching);

    return {
        tags,
        tagsFormatForSelect
    }
}