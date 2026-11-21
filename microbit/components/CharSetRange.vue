<template>
  <div class="charset-range">

    <div v-if="title" class="title">
      {{ title }}
    </div>

    <div class="grid">

      <div
        v-for="item in chars"
        :key="item.code"
        class="cell"
        :class="{
          selected: isSelected(item.code),
          endpoint: isEndpoint(item.code)
        }"
      >
        <div class="code">{{ item.code }}</div>
        <div class="char">{{ item.char }}</div>
      </div>

    </div>

    <div class="legend">

      <span class="legend-item">
        <span class="swatch selected-color"></span>
        Selected Range
      </span>

      <span class="legend-item">
        <span class="swatch endpoint-color"></span>
        Range Endpoints
      </span>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  start: {
    type: Number,
    required: true
  },

  end: {
    type: Number,
    required: true
  },

  highlightStart: {
    type: Number,
    required: true
  },

  highlightEnd: {
    type: Number,
    required: true
  },

  title: {
    type: String,
    default: ''
  }
})

const chars = computed(() => {
  const list = []

  for (let code = props.start; code <= props.end; code++) {
    list.push({
      code,
      char: String.fromCharCode(code)
    })
  }

  return list
})

function isSelected(code) {
  return (
    code >= props.highlightStart &&
    code <= props.highlightEnd
  )
}

function isEndpoint(code) {
  return (
    code === props.highlightStart ||
    code === props.highlightEnd
  )
}
</script>

<style scoped>

.charset-range {
  margin: 1.5rem 0;
}

.title {
  margin-bottom: 0.75rem;

  font-size: 0.9rem;
  font-weight: 600;
}

.grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(70px, 1fr));

  gap: 0.4rem;
}

.cell {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;

  padding: 0.4rem;

  text-align: center;

  background: var(--vp-c-bg-soft);

  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.cell:hover {
  transform: translateX(2px) translateY(-2px);
}

.code {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.char {
  margin-top: 0.2rem;

  font-family: Consolas, monospace;
  font-size: 1.4rem;
  font-weight: bold;
}

.selected {
  background: #dbeafe;
  border-color: #60a5fa;
}

.endpoint {
  background: #fef3c7;
  border-color: #f59e0b;
  border-width: 2px;
}

.legend {
  display: flex;
  gap: 1.5rem;

  margin-top: 0.75rem;

  font-size: 0.9rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.selected-color {
  background: #dbeafe;
}

.endpoint-color {
  background: #fef3c7;
}

</style>