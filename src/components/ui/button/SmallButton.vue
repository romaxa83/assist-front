<template>
  <div class="small-button-wrapper" :class="{ 'has-tooltip': !!tooltip }">
    <button
        class="btn btn-sm small-action-btn"
        :type="type"
        :class="classCustom"
        :title="title"
        @click="handleClick"
        :aria-disabled="disabled ? 'true' : 'false'"

    >
      <slot></slot>
    </button>

    <!-- Отображение кастомного тултипа -->
    <span v-if="tooltip" class="custom-tooltip">{{ tooltip }}</span>
  </div>
</template>

<script>
export default {
  name: "SmallButton",
  props: {
    type: {
      type: String,
      default: "button"
    },
    title: {
      type: String,
      default: ""
    },
    tooltip: {
      type: String,
      default: "",
    },
    classCustom: {
      type: String,
      default: ""
    },
    disabled: { // Для управления состоянием кнопки
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      // Если кнопка отключена, предотвращаем событие клика
      if (this.disabled) {
        console.log("CLICK DISABLED")
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // Если не отключена, просто передаем событие вверх
      this.$emit("click", event);
    },
  },

}
</script>

<style scoped>

/* Контейнер для кнопки и тултипа */
.small-button-wrapper {
  position: relative;
  display: inline-block;
}


.small-action-btn {
  background-color: var(--btn-action-background);
  color: var(--btn-action-color);
}
.small-action-btn:hover {
  background-color: var(--btn-action-hover-background);
  color: var(--btn-action-hover-color);
}


/* Оформление для "задизейбленных" кнопок */
.small-action-btn[aria-disabled="true"] {
  background-color: var(--btn-action-disabled-background, grey);
  color: var(--btn-action-disabled-color, #fff);
  cursor: not-allowed;
}


/* Стили для тултипа */
.custom-tooltip {
  visibility: hidden;
  background-color: #000; /* Цвет тултипа */
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
  position: absolute;
  z-index: 10;
  white-space: nowrap;

  bottom: 130%; /* Расположение тултипа сверху */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

/* При наведении на контейнер для кнопки отображаем тултип */
.small-button-wrapper:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
}

</style>