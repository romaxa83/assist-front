export default {
    namespaced: true,
    state: {
        // список для кол-ва выводимых записей
        optionsPerPage: [
            { value: 10, label: "10 records" },
            { value: 20, label: "20 records" },
            { value: 50, label: "50 records" },
        ],
    },
    getters: {
        getOptionsPerPage: (state) => state.optionsPerPage,
    },
};