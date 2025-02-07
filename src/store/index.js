import { createStore } from 'vuex'
import authModule from "@/store/authModule";
import settingsModule from "@/store/settingsModule";

export default createStore({
  modules: {
    auth: authModule,
    settings: settingsModule,
  }
})
