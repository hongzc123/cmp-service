<template>
  <div class="tw-flex tw-h-full tw-items-center tw-justify-center tw-flex-col tw-bg-no-repeat tw-bg-center tw-bg-cover"
    :style="`background-image: url(${getRemoteImage('index-bg.png')})`">
    <h1 class="tw-text-4xl">欢迎使用CMpanda服务平台</h1>
    <h2 class="tw-text-xl tw-mt-3">Welcome to the CMPanda service platform</h2>
  </div>
</template>

<script setup lang="ts">
import { getRemoteImage } from '@/utils/util';


</script>

<style lang="scss" scoped></style>
