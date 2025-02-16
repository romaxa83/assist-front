import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function useNoteSettings() {
    const statuses = ref([]);

    const fetching = async () => {
        try {
            const res = await axios.get('/api/private/settings/notes', {
                withAuth: true,
            });

            if(res.status === 200){
                statuses.value = res.data.statuses;
            }
        } catch (e) {
            console.log('Error Fetch Note settings', e)
        }
    }

    onMounted(fetching);

    return {
        statuses,
    }
}