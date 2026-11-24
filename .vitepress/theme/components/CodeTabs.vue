<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  syncKey?: string
}>(), {
  syncKey: 'makecode-lang'
})

const activeTab = ref<'blocks' | 'ts'>('blocks')

// Sync tab selection across all blocks on the page
onMounted(() => {
  if (!props.syncKey) return
  const saved = localStorage.getItem(`vp-tab-${props.syncKey}`)
  if (saved === 'blocks' || saved === 'ts') {
    activeTab.value = saved
  }
  window.addEventListener('vp-tab-sync', (e: any) => {
    if (e.detail?.key === props.syncKey) {
      activeTab.value = e.detail.tab
    }
  })
})

function selectTab(tab: 'blocks' | 'ts') {
  activeTab.value = tab
  if (props.syncKey) {
    localStorage.setItem(`vp-tab-${props.syncKey}`, tab)
    window.dispatchEvent(new CustomEvent('vp-tab-sync', {
      detail: { key: props.syncKey, tab }
    }))
  }
}
</script>

<template>
  <div class="vp-makecode-tabs">
    <div class="tabs-header" role="tablist">
      <button
        role="tab"
        :aria-selected="activeTab === 'blocks'"
        :class="{ active: activeTab === 'blocks' }"
        @click="selectTab('blocks')"
      >
        Blocks
      </button>
      <button
        role="tab"
        :aria-selected="activeTab === 'ts'"
        :class="{ active: activeTab === 'ts' }"
        @click="selectTab('ts')"
      >
        TypeScript
      </button>
    </div>

    <div class="tabs-body">
      <div v-show="activeTab === 'blocks'" class="tab-panel blocks-panel">
        <slot name="blocks" />
      </div>
      <div v-show="activeTab === 'ts'" class="tab-panel ts-panel">
        <slot name="ts" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-makecode-tabs {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-code-block-bg);
}

.tabs-header {
  display: flex;
  background-color: var(--vp-code-tab-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 12px;
}

.tabs-header button {
  position: relative;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.tabs-header button:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.tabs-header button.active {
  color: var(--vp-code-tab-active-text-color);
}

.tabs-header button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  height: 2px;
  background-color: var(--vp-code-tab-active-bar-color);
}

.blocks-panel {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--vp-c-bg-soft);
}

/* Remove extra margin/border from nested VitePress code blocks */
.ts-panel :deep(div[class*='language-']) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
