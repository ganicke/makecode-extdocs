<template>
  <details class="more-info">
    <summary class="header">
      <span class="chevron">{{ isOpen ? "🔽" : "▶️" }}</span>
      <span>{{ title }}</span>
    </summary>

    <div class="content">
      <slot />
    </div>
  </details>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'More'
  }
})

const isOpen = ref(false)

onMounted(() => {
  document.querySelectorAll('.more-info').forEach((details) => {
    const updateState = () => {
      isOpen.value = details.open
    }

    updateState()
    details.addEventListener('toggle', updateState)
  })
})
</script>

<style scoped>
.more-info {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.25rem 0;
}

.header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  padding: 0.85rem 1rem;
  font-weight: 600;
  list-style: none;
}

.header::-webkit-details-marker {
  display: none;
}

.chevron {
  font-size: 0.85rem;
  width: 1rem;
}

.content {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}

.more-info[open] .header {
  background: var(--vp-c-brand-soft);
}
</style>