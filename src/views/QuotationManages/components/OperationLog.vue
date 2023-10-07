<template>
  <div>
    <div class="desc-header">操作日志</div>
    <el-table ref="multipleTableRef" :data="props.operationLog" :border="true">
      <el-table-column label="操作内容" header-align="left" align="left" property="type" />
      <el-table-column label="操作人" header-align="left" align="left" property="username">
      </el-table-column>
      <el-table-column label="操作时间" header-align="left" align="left" property="createTime">
        <template #default="scope">{{
          dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')
        }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

defineOptions({ name: 'OperationLog.vue' })
const props = defineProps<{
  operationLog: any[]
}>()
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
