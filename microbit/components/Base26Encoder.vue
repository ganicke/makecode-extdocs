<template>
  <div class="encoder">

    <div class="display-row">

      <!-- ACCUMULATOR -->

      <div class="accumulator-panel">

        <div class="panel-title">
          Accumulator
        </div>

        <div
          class="accumulator-value"
          :class="{ pulse: accumulatorPulse }"
        >
          {{ accumulator }}
        </div>

        <div class="base26-value">
          {{ processedLetters || "-" }}
        </div>

      </div>

      <!-- WORD -->

      <div class="word-panel">

        <div class="panel-title">
          Remaining Input
        </div>

        <div class="word-grid">

          <div
            v-for="(letter, idx) in remainingLetters"
            :key="`${idx}-${letter}`"
            class="letter-cell"
            :class="{ active: idx === 0 && running }"
          >
            {{ letter }}
          </div>

        </div>

      </div>

    </div>

    <!-- DETAILS -->

    <div class="details">

      <template v-if="running && currentLetter">

        <div>
          Current Letter:
          <strong>{{ currentLetter }}</strong>
        </div>

        <div>
          Character Value:
          <strong>{{ currentCharValue }}</strong>
        </div>

        <div class="formula">
          {{ previousAccumulator }}
          × 26 + {{ currentCharValue }}
          =
          {{ accumulator }}
        </div>

      </template>

      <template v-else-if="finished">

        <div class="complete">
          Encoding Complete
        </div>

        <div>
          Final Value:
          <strong>{{ accumulator }}</strong>
        </div>

        <div>
          Base‑26 Digits:
          <strong>{{ processedLetters }}</strong>
        </div>

      </template>

      <template v-else>

        <div>
          Press Start to encode
          <strong>{{ word }}</strong>
          into a Base‑26 integer.
        </div>

      </template>

    </div>

    <!-- CONTROLS -->

    <div class="controls">

      <button
        class="start-btn"
        :disabled="running"
        @click="startAnimation"
      >
        {{ running ? 'Encoding...' : 'Start' }}
      </button>

    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  word: {
    type: String,
    required: true
  },

  interval: {
    type: Number,
    default: 1000
  },

  resetDelay: {
    type: Number,
    default: 3000
  }
})

const running = ref(false)
const finished = ref(false)

const accumulator = ref(0)

const currentIndex = ref(0)

const currentLetter = ref('')
const currentCharValue = ref(null)

const previousAccumulator = ref(0)

const accumulatorPulse = ref(false)

let timer = null

const letters = computed(() =>
  props.word.toUpperCase().split('')
)

const processedLetters = computed(() =>
  letters.value.slice(0, currentIndex.value).join('')
)

const remainingLetters = computed(() =>
  letters.value.slice(currentIndex.value)
)

function pulseAccumulator() {
  accumulatorPulse.value = false

  requestAnimationFrame(() => {
    accumulatorPulse.value = true

    setTimeout(() => {
      accumulatorPulse.value = false
    }, 500)
  })
}

function reset() {
  running.value = false
  finished.value = false

  accumulator.value = 0

  currentIndex.value = 0

  currentLetter.value = ''
  currentCharValue.value = null

  previousAccumulator.value = 0
}

function processNext() {

  if (currentIndex.value >= letters.value.length) {

    clearInterval(timer)

    running.value = false
    finished.value = true

    currentLetter.value = ''
    currentCharValue.value = null

    setTimeout(() => {
      reset()
    }, props.resetDelay)

    return
  }

  const letter = letters.value[currentIndex.value]

  const charCode =
    letter.charCodeAt(0) - 65

  currentLetter.value = letter
  currentCharValue.value = charCode

  previousAccumulator.value =
    accumulator.value

  accumulator.value =
    accumulator.value * 26 + charCode

  pulseAccumulator()

  setTimeout(() => {
    currentIndex.value++
  }, props.interval * 0.5)
}

function startAnimation() {

  if (running.value) return

  reset()

  running.value = true

  processNext()

  timer = setInterval(
    processNext,
    props.interval
  )
}
</script>

<style scoped>
.encoder {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: var(--vp-c-bg-soft);
}

.display-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.accumulator-panel,
.word-panel {
  display: flex;
  flex-direction: column;
}

.accumulator-panel {
  min-width: 220px;
}

.panel-title {
  height: 1.5rem;
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.7;
}

.accumulator-value {
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  font-weight: bold;

  padding: 0.75rem;

  border-radius: 8px;

  background: white;
  border: 1px solid var(--vp-c-divider);

  text-align: center;
}

.base26-value {
  margin-top: 0.5rem;

  text-align: center;

  font-family: monospace;
  font-size: 1.25rem;
}

.word-grid {
  display: flex;
  gap: 0.4rem;
}

.letter-cell {
  width: 3rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #888;
  border-radius: 6px;

  background: white;

  font-size: 1.35rem;
  font-weight: bold;

  transition:
    transform 0.4s ease,
    background 0.3s ease;
}

.active {
  background: #ffd54f;
  transform: scale(1.12);
}

.details {
  margin-top: 1.5rem;
  min-height: 6rem;
}

.formula {
  margin-top: 0.75rem;

  padding: 0.75rem;

  font-family: Consolas, monospace;

  border-radius: 6px;

  background: #111;
  color: #0f0;
}

.complete {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.controls {
  margin-top: 1rem;
}

.start-btn {
  padding: 0.65rem 1.3rem;

  border: none;

  border-radius: 6px;

  cursor: pointer;

  font-weight: 600;

  background: var(--vp-c-brand-1);
  color: white;
}

.start-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.pulse {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
    background: #ffe082;
  }

  100% {
    transform: scale(1);
  }
}
</style>
