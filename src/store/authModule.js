import axios from "@/services/axios";
import router from '@/router'; // Импорт глобального маршрутизатора


const state = {
    state: {
        authToken: localStorage.getItem('authToken') || null, // Извлекаем токен из localStorage
        user: JSON.parse(localStorage.getItem('user')) || null, // Извлекаем данные пользователя
    },

};

const mutations = {
    SET_AUTH_TOKEN(state, token) {
        state.authToken = token;
        if (token) {
            localStorage.setItem('authToken', token); // Сохраняем токен в localStorage
        } else {
            localStorage.removeItem('authToken'); // Убираем токен при выходе
        }
    },
    SET_USER(state, user) {
        state.user = user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Сохраняем пользователя в localStorage
        } else {
            localStorage.removeItem('user'); // Убираем данные пользователя при выходе
        }
    },

};

const actions = {
    async getProfile({ commit }, payload) {
        // Сохранение токена
        commit('SET_AUTH_TOKEN', payload.token);

        // Получение профиля пользователя
        try {
            const response = await axios.get('/api/private/profile', {
                headers: {Authorization: `Bearer ${payload.token}`,},
            });

            // Сохранение пользователя в store
            commit('SET_USER', response.data);
        } catch (error) {
            console.error('Ошибка при получении профиля пользователя:', error);
            // Логика обработки ошибки (опционально)
        }
    },

    async logout({ commit, state }) {
        try {
            await axios.post('/api/private/logout',
            null,
                {headers: {Authorization: `Bearer ${state.authToken}`,},
            });

        } catch (error) {
            console.error('Ошибка при Logout:', error);
        } finally {
            // очищаем хранилище
            commit("SET_AUTH_TOKEN", null);
            commit("SET_USER", null);

            // Редирект на главную страницу
            router.push('/');
        }
    },
    
    restoreSession({ commit }) {
        // Восстанавливаем токен и данные пользователя, если они есть в localStorage
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        if (token) {
            commit('SET_AUTH_TOKEN', token);
        }
        if (user) {
            commit('SET_USER', JSON.parse(user));
        }
    },

};


export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
