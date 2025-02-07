import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function useNotes(params) {
    const notes = ref([]);
    const meta = ref([]);

    const fetching = async (params) => {
        try {
            const res = await axios.get('/api/notes', {params})
            if(res.status === 200){
                notes.value = res.data.data;
                meta.value = res.data.meta;
            }
        } catch (e) {
            alert('Error Fetch Notes', e)
        }
    }

    // onMounted(fetching);

    return {
        notes,
        meta,
        fetching
    }
}