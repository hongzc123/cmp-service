<template>
  <el-dialog v-model="visible" title="驳回需求" width="50%" @close="handleClose">
    <el-select class="tw-mb-3" v-model="reason" placeholder="请选择驳回原因" clearable filterable>
      <el-option
        v-for="item in reasonList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input v-model="remark" clearable placeholder="请输入备注内容"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref, type Ref } from 'vue'
import { changePurchaseIntentionStatus, quoteRejectReasonList } from '@/api/quotation'

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const reason: Ref = ref('')
const remark: Ref = ref('')
const reasonList: Ref = ref([])
const currentQuoteNo: Ref = ref('')

const handleOpen = (intentionNo: string) => {
  currentQuoteNo.value = intentionNo
  visible.value = true
}
const handleClose = () => {
  reason.value = ''
  remark.value = ''
}

const handleSubmit = async () => {
  if (!reason.value) {
    ElMessage.error('请选择原因')
    return
  }
  const params = {
    intentionNo: currentQuoteNo.value,
    status: 4,
    rejectReason: reason.value,
    rejectRemark: remark.value
  }
  try {
    loading.value = true
    const { data } = await changePurchaseIntentionStatus(params)
    loading.value = false
    ElMessage.success(data.resp_msg)
    visible.value = false
    emits('refresh', currentQuoteNo.value)
  } catch (error) {
    loading.value = false
  }
}

const getReasonList = async () => {
  const { data } = await quoteRejectReasonList({ code: 'QUOTE_REJECT' })
  reasonList.value = data.datas
}

onMounted(() => {
  getReasonList()
})

defineExpose({
  handleOpen,
  handleClose
})

const emits = defineEmits(['refresh'])
</script>

<style lang="scss" scoped></style>
