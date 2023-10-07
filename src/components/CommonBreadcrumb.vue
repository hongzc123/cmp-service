<template>
  <div class="tw-pb-5">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(path, index) in paths" :key="index" :to="path">{{ path.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'CommonBreadcrumb.vue' })

const router = useRouter()
const paths = router.currentRoute.value.matched.slice(1)

</script>

<style lang="scss" scoped></style>
