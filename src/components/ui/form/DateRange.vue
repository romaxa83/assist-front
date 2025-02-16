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


    <date-picker
        v-model:value="internalModelValue"
        :placeholder="placeholder"
        range>
    </date-picker>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';


export default {
  name: "DateRange",
  components: { DatePicker },
  props: {
    modelValue: {
      type: [Array, String, Number, Date], // Тип значения для диапазона или даты
      required: false,
      default: () => [null, null]
      ,
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
      default: "Change date",
    },

  },
  setup(props, { emit }) {
// Создаем реактивное хранилище для внутреннего значения
    const internalModelValue = ref(props.modelValue);

    // Watcher для синхронизации `modelValue` с внутренним значением
    watch(
        () => props.modelValue,
        (newVal) => {
          internalModelValue.value = newVal;
        }
    );

    // Watcher для обновления родительской модели
    watch(internalModelValue, (newVal) => {
      emit("update:modelValue", newVal);
    });

    return {
      internalModelValue, // Используем внутреннее реактивное значение
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