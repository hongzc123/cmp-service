<template>
  <div>
    <el-popover placement="bottom" title="下载列表" width="410" trigger="click">
      <!-- 按钮 -->
      <template #reference>
        <div class="index-layout-message">
          <el-badge :value="form.total" class="index-layout-message-item">
            <el-icon :size="18"><Bell /></el-icon>
          </el-badge>
        </div>
      </template>
      <!-- 面板 -->
      <el-table
        ref="tableRef"
        class="download-file-table"
        :data="form.fileList"
        height="200px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column prop="fileName" />
        <el-table-column width="90px">
          <template #default="scope">
            <span v-if="scope.row.status === 0">等待下载</span>
            <span v-if="scope.row.status === 1">加载中</span>
            <el-button
              v-if="scope.row.status === 2"
              type="primary"
              @click="handleDownload(scope.row)"
              >下载</el-button
            >
            <span v-if="scope.row.status === 3" class="text-red">加载失败</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="mar-t10">
        <el-button @click="handleTableSelectAll">全选</el-button>
        <el-button type="danger" @click="handleTableSelectDel">删除</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref, watch, onBeforeMount } from 'vue'
import { fileStatus, fileDel } from '@/api/other'
import { downloadByUrl } from 'cmpanda-util'
import { useAppStore } from '@/stores/app'
import emitter from '@/utils/eventBus'
import { ElMessage } from 'element-plus'
const store = useAppStore()
const { data: userInfo } = store.getUserInfo()
const name = userInfo.datas.subUserName

interface Form {
  fileTimer: any
  fileList: any[]
  fileSelected: any[]
  total: number
}
const form: Form = reactive({
  fileTimer: null, // 轮询定时器
  fileList: [],
  fileSelected: [],
  total: 0
})
const tableRef: Ref = ref(null)

const fileStatusCheck = async () => {
  // 轮询服务端下载列表状态
  clearInterval(form.fileTimer)
  form.fileTimer = setInterval(fileStatusCheckFn, 3000)
  await fileStatusCheckFn()
}
const fileStatusCheckFn = async () => {
  try {
    const { data: res } = await fileStatus({
      userId: userInfo.datas.id,
      pageNo: 1,
      pageSize: 1000
    })
    form.fileList = res.datas.records
    form.total = res.datas.total
    const hasFileLoading = form.fileList.some((item: any) => item.status === 0 || item.status === 1)
    if (!hasFileLoading) {
      clearInterval(form.fileTimer)
      form.fileTimer = null
    }
  } catch (error) {
    clearInterval(form.fileTimer)
    form.fileTimer = null
  }
}
const handleDownload = ({ fileUrl }: any) => {
  downloadByUrl(fileUrl)
}
const handleTableSelectAll = () => {
  tableRef.value.toggleAllSelection()
}
const handleSelectionChange = (v: any) => {
  form.fileSelected = v.map((i: any) => i.id)
}
const handleTableSelectDel = async () => {
  await fileDel({ ids: form.fileSelected.toString() })
  ElMessage.success('删除成功')
  fileStatusCheck()
}

watch(
  () => name,
  () => {
    fileStatusCheck()
  },
  { immediate: true }
)

onBeforeMount(() => {
  emitter.on('trigger', () => {
    fileStatusCheck()
  })
})
</script>

<style lang="scss" scoped></style>
