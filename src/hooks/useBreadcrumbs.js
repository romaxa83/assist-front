import { inject, onMounted } from 'vue';

/**
 * Хук для настройки breadcrumbs.
 * @param {Array} initialBreadcrumbs - Массив для инициализации breadcrumbs.
 */
export function useBreadcrumbs(initialBreadcrumbs = []) {
    const breadcrumbs = inject('breadcrumbs');

    onMounted(() => {
        // Полная замена массива breadcrumbs
        breadcrumbs.splice(0, breadcrumbs.length, ...initialBreadcrumbs);
    });
}