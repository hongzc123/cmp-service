<template>
  <div class="tw-mb-5">
    <el-alert :closable="false" type="warning">
      <template #title>
        <div class="tw-flex tw-items-center">
          <div class="tw-flex">
            <el-icon :size="20"><Warning /></el-icon>
          </div>
          <div class="tw-ml-2">
            <span class="tw-text-[16px]">{{ props.demandDetailInfo.onceMoreReason }}</span>
            <div class="tw-text-[#303133] tw-text-sm">
              {{ props.demandDetailInfo.onceMoreRemark }}
            </div>
          </div>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  demandDetailInfo: CreateNoEmptyRules
}>()
</script>

<style lang="scss" scoped></style>
