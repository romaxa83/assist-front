import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function useTags() {
    const tags = ref([]);

    const fetching = async () => {
        try {
            const res = await axios.get('/api/tags')
            if(res.status === 200){
                tags.value = res.data;
            }
        } catch (e) {
            alert('Error Fetch Tags', e)
        }
    }

    onMounted(fetching);

    return {
        tags
    }
}