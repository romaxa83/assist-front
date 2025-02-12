<template>
  <div class="form-group">
    <!-- Метка -->
    <label
        v-if="label"
        :for="id"
        class="form-label"
    >
      {{ label }}
    </label>

    <!-- Поле выбора диапазона -->
    <VueDatePicker
        v-model="selectedRange"
        :range="true"
        :date-format="inputFormat"
        :position="position"
        :first-day-of-week="firstDayOfWeek"
        :placeholder="placeholder"
        @focus="setTodayIfEmpty"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "DateRange",
  components: { VueDatePicker },
  props: {
    modelValue: {
      type: Array, // Диапазон дат передается как массив
      default: () => [null, null], // Начальное значение пустое
    },
    label: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      default: "Выберите диапазон дат",
    },
    firstDayOfWeek: {
      type: Number,
      default: 1, // Понедельник как первый день
    },
    inputFormat: {
      type: String,
      default: "YYYY-MM-DD",
    },
    position: {
      type: String,
      default: "bottom-start", // Расположение календаря
    },
  },
  setup(props, { emit }) {
    // Локальная копия диапазона
    const selectedRange = ref(props.modelValue);

    // Текущая дата в формате 'YYYY-MM-DD'
    const getToday = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Устанавливаем текущую дату, если поле пустое
    const setTodayIfEmpty = () => {
      if (
          !selectedRange.value ||
          (Array.isArray(selectedRange.value) &&
              (selectedRange.value[0] === null || selectedRange.value[1] === null))
      ) {
        const today = getToday();
        selectedRange.value = [today, today]; // Устанавливаем текущую дату
      }
    };

    // Отслеживание изменений и обновление родительского компонента через v-model
    watch(selectedRange, (newValue) => {
      emit("update:modelValue", newValue);
    });

    // Отслеживаем props и синхронизируем локальную копию
    watch(
        () => props.modelValue,
        (newValue) => {
          selectedRange.value = newValue;
        }
    );

    return {
      selectedRange,
      setTodayIfEmpty,
    };
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>