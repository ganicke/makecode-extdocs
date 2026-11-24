<template>
  <div class="mcb">

    <!-- Tabs -->

    <div class="tabs">

      <button
        type="button"
        class="tab"
        :class="{ active: activeTab === 'blocks' }"
        :disabled="imageMissing"
        @click="activeTab = 'blocks'"
      >
        Blocks

        <span
          v-if="imageMissing"
          class="tab-warning"
          title="Block image missing"
        >
          ⚠
        </span>
      </button>

      <button
        type="button"
        class="tab"
        :class="{ active: activeTab === 'typescript' }"
        @click="activeTab = 'typescript'"
      >
        TypeScript
      </button>

    </div>

    <!-- Content -->

    <div
      class="tab-content"
      :style="{
        maxHeight: `${maxHeight}px`
      }"
    >

      <!-- Blocks -->

      <div
        v-show="activeTab === 'blocks'"
        class="blocks-pane"
      >

        <img
          v-if="!imageMissing"
          :src="assetPath"
          :alt="`${target} blocks`"
          class="blocks-image"
          :style="{
            width: `${scale * 100}%`
          }"
          @error="handleImageError"
        >

        <div
          v-else
          class="missing-message"
        >

          <div class="missing-title">
            ⚠ Block Image Missing
          </div>

          <div>
            Expected asset:
          </div>

          <code>{{ assetPath }}</code>

          <div class="missing-help">
            The TypeScript source is available in the adjacent tab.
          </div>

        </div>

      </div>

      <!-- TypeScript -->

      <div
        v-show="activeTab === 'typescript'"
        class="code-pane"
      >
        <slot />
      </div>

    </div>

    <!-- Result Section -->

    <div
      v-if="result || hasResultSlot"
      class="result-panel"
    >

      <div class="result-title">
        Result
      </div>

      <div class="result-content">

        <slot name="result">
          {{ result }}
        </slot>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  computed,
  ref,
  useSlots
} from 'vue'

const props = defineProps({

  hash: {
    type: String,
    required: true
  },

  target: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: 'png'
  },

  scale: {
    type: Number,
    default: 1.0
  },

  maxHeight: {
    type: Number,
    default: 400
  },

  assetFolder: {
    type: String,
    default: '/blockassets'
  },

  result: {
    type: String,
    default: ''
  }

})

const slots = useSlots()

const activeTab = ref('blocks')

const imageMissing = ref(false)

const hasResultSlot = computed(() =>
  !!slots.result
)

const assetPath = computed(() =>
 `${import.meta.env.BASE_URL}blockassets/${props.hash}.${props.type}`)

function handleImageError() {
  imageMissing.value = true
  activeTab.value = 'typescript'
}
</script>

<style scoped>

.mcb {
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

/* Tabs */

.tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.tab {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
}

.tab:hover:not(:disabled) {
  background: var(--vp-c-bg);
}

.tab.active {
  background: var(--vp-c-bg);
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.tab:disabled {
  opacity: 0.6;
  cursor: default;
}

.tab-warning {
  margin-left: 0.5rem;
  color: #d97706;
  font-size: 0.9rem;
}

/* Content Area */

.tab-content {
  overflow: auto;
}

/* Blocks */

.blocks-pane {
  padding: 1rem;
  overflow: auto;
}

.blocks-image {
  display: block;
  max-width: none;
  height: auto;
}

/* TypeScript */

.code-pane {
  padding: 1rem;
  overflow: auto;
}

.code-pane :deep(pre) {
  margin: 0;
}

.code-pane :deep(pre code) {
  white-space: pre;
}

/* Missing */

.missing-message {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.missing-title {
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.missing-help {
  margin-top: 0.75rem;
}

/* Result */

.result-panel {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1rem;
}

.result-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.result-content {
  color: var(--vp-c-text-1);
}

.result-content :deep(pre),
.result-content :deep(table) {
  overflow-x: auto;
}

</style>