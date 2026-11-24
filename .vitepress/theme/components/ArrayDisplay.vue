<template>
  <div class="array-display" ref="container">

    <div
      v-if="showIndices"
      class="array-row index-row"
    >
      <div
        v-for="(_, index) in items"
        :key="`idx-${index}`"
        class="array-index"
      >
        {{ index }}
      </div>
    </div>

    <div class="array-row">

      <div
        v-for="(item, index) in items"
        :key="index"
        class="array-cell"
      >
        {{ item }}
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },

  showIndices: {
    type: Boolean,
    default: false
  },

  cellWidth: {
    type: String,
    default: '3rem'
  },

  scrollToEnd: {
    type: Boolean,
    default: false
  }
})

const container = ref(null)

onMounted(() => {
  if (
    props.scrollToEnd &&
    container.value
  ) {
    container.value.scrollLeft =
      container.value.scrollWidth
  }
})
</script>

<style scoped>

.array-display {
  margin: 1rem 0;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.array-row {
  display: flex;
  gap: 0.4rem;
}

.index-row {
  margin-bottom: 0.4rem;
}

.array-index {

  width: 3rem;
  min-width: 3rem;

  text-align: center;

  font-size: 0.9rem;
  font-weight: 600;

  color: var(--vp-c-text-2);

  flex: 0 0 auto;
}

.array-cell {
  width: 3rem;
  min-width: 3rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;

  background: var(--vp-c-bg);

  font-family: Consolas, Monaco, monospace;
  font-size: 1.5rem;
  font-weight: 700;

  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12);

  flex: 0 0 auto;
}

.array-cell:first-child {
  border-left: 1px solid var(--vp-c-divider);

  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.array-cell:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

</style>