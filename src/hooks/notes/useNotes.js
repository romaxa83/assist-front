import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function useNotes() {
    const notes = ref([]);

    const fetching = async () => {
        try {
            const res = await axios.get('/api/notes')
            if(res.status === 200){
                // console.log(res.data.data);
                notes.value = res.data.data;
            }
        } catch (e) {
            alert('Error Fetch Notes', e)
        }
    }

    onMounted(fetching);

    return {
        notes
    }
}