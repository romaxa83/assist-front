import {onMounted ,ref} from "vue";
import axios from "@/services/axios";

export function loadNote(id) {
    const note = ref();

    const load = async () => {
        try {
            const res = await axios.get(`/api/private/notes/${id}`, {withAuth: true})
            console.log(res);
            if(res.status === 200){
                console.log(res.data);
                notes.value = res.data.data;
            }
        } catch (e) {
            alert('Error Fetch Notes', e)
        }
    }

    onMounted(load);

    return {
        note
    }
}