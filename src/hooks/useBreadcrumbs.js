import { inject, watch } from 'vue';

/**
 * Хук для настройки breadcrumbs.
 * @param {Array|Ref} initialBreadcrumbs - Массив или реактивный ref для управления breadcrumbs.
 */
export function useBreadcrumbs(initialBreadcrumbs = []) {
    const breadcrumbs = inject("breadcrumbs"); // Получаем глобальные breadcrumbs

    if (!breadcrumbs) {
        console.error("Breadcrumbs не найден, убедитесь, что они предоставлены через provide().");
        return;
    }

    // Возможность передавать массив или ref
    const isReactive = typeof initialBreadcrumbs.value !== "undefined";

    if (isReactive) {
        // Отслеживаем изменения в ref
        watch(initialBreadcrumbs, (newBreadcrumbs) => {
            // Полностью заменяем массив breadcrumbs
            breadcrumbs.splice(0, breadcrumbs.length, ...newBreadcrumbs);
        }, { immediate: true }); // Применяем сразу, чтобы инициализировать
    } else {
        // Если передан обычный массив, заменяем его один раз
        breadcrumbs.splice(0, breadcrumbs.length, ...initialBreadcrumbs);
    }

}