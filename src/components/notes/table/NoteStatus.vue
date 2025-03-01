<template>
  <span :class="['note-status', statusClass]">
    {{ status }}
  </span>
</template>

<script>
export default {
  name: "NoteStatus",
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    statusClass() {
      // Возвращает стиль в зависимости от конкретного статуса
      switch (this.status.toLowerCase()) {
        case "draft":
          return "note-status-draft";
        case "moderation":
          return "note-status-moderation";
        case "public":
          return "note-status-public";
        case "private":
          return "note-status-private";
        default:
          return "note-status-default";
      }
    },
  },
}
</script>

<style scoped>
/* Общий стиль для статуса заметки */
.note-status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 0.7rem; /* Делает края закруглёнными */
  font-size: 0.8rem;
  //font-weight: bold;
  text-transform: capitalize; /* "Активно" вместо "активно" */
}

/* Стили для каждого статуса */
.note-status-draft {
  background-color: var(--status-draft-background-color);
  color: var(--status-draft-color);
  border: 1px solid var(--status-draft-border-color);
}

.note-status-moderation {
  background-color: var(--status-moderation-background-color);
  color: var(--status-moderation-color);
  border: 1px solid var(--status-moderation-border-color);
}

.note-status-public {
  background-color: var(--status-public-background-color);
  color: var(--status-public-color);
  border: 1px solid var(--status-public-border-color);
}

.note-status-private {
  background-color: var(--status-private-background-color);
  color: var(--status-private-color);
  border: 1px solid var(--status-private-border-color);
}

.note-status-default {
  background-color: var(--status-default-background-color);
  color: var(--status-default-color);
  border: 1px solid var(--status-default-border-color);
}

</style>