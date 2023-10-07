<template>
  <template v-for="route in routes.filter((item: any) => !item.meta.hidden)" :key="route.name">
    <el-sub-menu v-if="route.children && route.children.length > 1" :index="route.name">
      <template #title>
        <span>{{ route.meta.title }}</span>
      </template>
      <LayoutMenuItem v-if="route.children && route.children.length" :routes="route.children" />
    </el-sub-menu>
    <!-- <el-menu-item
      v-if="route.children && route.children.length === 1"
      :index="route.children[0].name"
      >{{ route.children[0].meta.title }}</el-menu-item
    > -->
    <el-menu-item v-else :index="route.name">{{ route.meta.title }}</el-menu-item>
  </template>
</template>

<script setup lang="ts">
defineOptions({ name: 'LayoutMenuItem.vue' })
defineProps<{
  routes: any[]
}>()
</script>

<style lang="scss" scoped></style>
