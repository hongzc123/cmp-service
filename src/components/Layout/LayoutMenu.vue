<template>
  <el-menu
    class="tw-flex-[8] tw-h-full !tw-border-none"
    mode="horizontal"
    :default-active="route.name?.toString()"
    @select="handleSelect"
  >
    <LayoutMenuItem :routes="store.routes" />
  </el-menu>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import LayoutMenuItem from './LayoutMenuItem.vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'LayoutMenu.vue' })

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const handleSelect = (key: string) => {
  router.push({ name: key })
}
</script>

<style lang="scss" scoped></style>
