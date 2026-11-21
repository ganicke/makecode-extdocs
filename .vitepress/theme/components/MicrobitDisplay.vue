<template>
  <svg
    class="microbit-display"
    viewBox="0 0 232 244"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="ledglow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    

    <!-- LEDs -->
    <template v-for="(row, rowIndex) in matrix" :key="rowIndex">
      <template v-for="(level, colIndex) in row" :key="`${rowIndex}-${colIndex}`">

        <!-- LED background -->
        <rect
          :x="17 + colIndex * 45"
          :y="18 + rowIndex * 45"
          width="16"
          height="26"
          rx="3"
          fill="#333"
        />

        <!-- LED -->
        <rect
          :x="16 + colIndex * 45"
          :y="16 + rowIndex * 45"
          width="18"
          height="30"
          rx="4"
          :fill="ledColor(level)"
          :opacity="ledOpacity(level)"
          :filter="level ? 'url(#ledglow)' : ''"
        />
      </template>
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  leds: {
    type: Array,
    default: null
  },

  pattern: {
    type: String,
    default: ''
  }
})

const matrix = computed(() => {
  if (props.leds) {
    return props.leds
  }

  if (props.pattern) {
    return props.pattern
      .trim()
      .split('\n')
      .map(row =>
        [...row.trim()].map(c => Number(c))
      )
  }

  return Array(5)
    .fill()
    .map(() => Array(5).fill(0))
})

function ledOpacity(value) {
  const v = Number(value) || 0

  if (v <= 0) return 0
  if (v > 9) return 1

  return v / 9
}

function ledColor(value) {
  return '#ff628c' //'#ff114d'
}
</script>

<style scoped>
.microbit-display {
  width: 150px;
  max-width: 100%;
  border: 1px solid #999;
  border-radius: 5px;
  background: #111;
}
</style>