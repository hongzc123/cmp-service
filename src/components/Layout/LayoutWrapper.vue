<template>
  <article class="tw-h-full tw-flex tw-flex-col">
    <LayoutHeader />
    <section class="tw-flex-1 tw-h-full tw-flex tw-flex-row">
      <main class="tw-flex-1 tw-p-5 tw-overflow-auto">
        <RouterView />
      </main>
    </section>
  </article>
</template>

<script setup lang="ts">
import LayoutHeader from './LayoutHeader.vue';

defineOptions({ name: 'LayoutWrapper.vue' })

</script>

<style lang="scss" scoped></style>
