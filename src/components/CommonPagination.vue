<template>
  <div class="tw-py-5 tw-flex tw-items-center tw-justify-end">
    <el-pagination
      background
      v-model:current-page="page.pageNo"
      :page-size="page.pageSize"
      layout="total, prev, pager, next, sizes"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineOptions({ name: 'CommonPagination.vue' })

const emit = defineEmits(['change'])
const page: PageInfo = reactive({
  pageNo: 1,
  pageSize: 20,
  total: 0
})

const handleSizeChange = (size: number) => {
  page.pageSize = size
  emit('change')
}
const handleCurrentChange = (pageNo: number) => {
  page.pageNo = pageNo
  emit('change')
}
const updateTotal = (total: number) => {
  page.total = total
}
const reset = () => {
  Object.assign(page, { pageNo: 1 })
}

defineExpose({ page, updateTotal, reset })
</script>

<style lang="scss" scoped></style>
