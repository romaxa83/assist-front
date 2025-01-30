import {onMounted ,ref} from "vue";
import axios from "axios";

export function useTags() {
    const tags = ref([]);

    const fetching = async () => {
        try {
            const res = await axios.get('http://192.168.193.1/api/tags')
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