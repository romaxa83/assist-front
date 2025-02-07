export default {
    namespaced: true,
    state: {
        // список для кол-ва выводимых записей
        optionsPerPage: [
            { value: 10, label: "10 records" },
            { value: 2, label: "2 records" },
            { value: 5, label: "5 records" },
            { value: 1, label: "1 records" },
        ],
    },
    getters: {
        getOptionsPerPage: (state) => state.optionsPerPage,
    },
};