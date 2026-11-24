<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  align?: 'left' | 'center'
  gap?: string | number
  borderless?: boolean
}>(), {
  align: 'left',
  gap: '16px',
  borderless: false
})

const formattedGap = computed(() =>
  typeof props.gap === 'number' ? `${props.gap}px` : props.gap
)
</script>

<template>
  <div
    class="vp-side-by-side"
    :class="[`align-${align}`, { 'is-borderless': borderless }]"
    :style="{ '--side-by-side-gap': formattedGap }"
  >
    <slot />
  </div>
</template>

<style scoped>
.vp-side-by-side {
  display: flex;
  flex-wrap: wrap;
  gap: var(--side-by-side-gap);
  align-items: center;
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.vp-side-by-side.is-borderless {
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background-color: transparent;
}

.vp-side-by-side :deep(img),
.vp-side-by-side :deep(svg) {
  max-width: 100%;
  height: auto;
  margin: 0;
}

.vp-side-by-side :deep(p) {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--side-by-side-gap);
  align-items: center;
}

.align-left,
.align-left :deep(p) {
  justify-content: flex-start;
}

.align-center,
.align-center :deep(p) {
  justify-content: center;
}
</style>
