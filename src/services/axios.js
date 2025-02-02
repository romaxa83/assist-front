import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

// Установки токена
axiosInstance.interceptors.request.use(
    (config) => {

        // Проверяем наличие флага withAuth
        if (config.withAuth) {
            const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

            if (token) {
                config.headers.Authorization = `Bearer ${token}`; // Добавляем Authorization заголовок
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error); // Обработка ошибок
    }
);


export default axiosInstance;
