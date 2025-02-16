import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function useNotes(params) {
    const notes = ref([]);

    const fetching = async (params) => {
        try {
            const res = await axios.get(
                '/api/notes',
                {
                    params: params,
                    withAuth: true
                },
            )
            if(res.status === 200){
                notes.value = res.data.data;

                console.log(notes.value);
            }
        } catch (e) {
            console.error('Error Fetch Public Notes', e);
        }
    }

    onMounted(fetching);

    return {
        notes,
        fetching
    }
}