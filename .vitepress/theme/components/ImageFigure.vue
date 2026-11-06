<template>
  <figure class="custom-figure" :style="{ maxWidth: width || '100%' }">
    <div class="image-container">
      <img :src="src" :alt="alt || caption" loading="lazy" />
    </div>
    <figcaption v-if="caption" class="figure-caption">
      <span class="caption-prefix">Figure:</span> {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  }
})
</script>

<style scoped>
.custom-figure {
  margin: 2rem auto;
  padding: 0.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.image-container img {
  max-height: 450px;
  object-fit: contain;
  width: auto;
}

.figure-caption {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.4;
}

.caption-prefix {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
