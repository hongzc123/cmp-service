<template>
  <el-drawer
    class="demand-details-drawer"
    v-model="drawer"
    size="80%"
    @close="handleClose"
    @open="handleOpen"
    :show-close="false"
  >
    <template #header>
      <h4 class="tw-flex tw-cursor-pointer">
        <div class="tw-flex tw-items-center" @click="handleClose">
          <el-icon size="20"><Back /></el-icon>
          <span class="tw-mx-3">返回</span>
        </div>
        <span class="tw-mr-5">{{ demandDetailInfo.intentionNo }}</span>
      </h4>
    </template>
    <div class="tw-mb-[60px]">
      <!-- 需求状态 -->
      <DemandStatusBar
        v-if="demandDetailInfo.onceMoreReason"
        :demandDetailInfo="demandDetailInfo"
      />

      <!-- 需求信息 -->
      <DemandInfo
        :internationalShippingType="demandDetailInfo.internationalShippingType"
        :demandDetailInfo="demandDetailInfo"
        :addressInfo="demandDetailInfo.addressInfo"
        :itemList="demandDetailInfo.itemList"
        :isType="1"
      />
      <!-- 报价历史 -->
      <QuotationHistory :quoteList="demandDetailInfo.quoteList" :showQuoteDetails="true" />
      <!-- 操作日志 -->
      <OperationLog :operationLog="demandDetailInfo.operationLog" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemandInfo from '../components/DemandInfo.vue'
import QuotationHistory from '../components/QuotationHistory.vue'
import OperationLog from '../components/OperationLog.vue'
import DemandStatusBar from '../components/DemandStatusBar.vue'
import { useQuotationDetail } from '../hook/quotationHook'
const { demandDetails, demandDetailInfo } = useQuotationDetail()

defineOptions({ name: 'DemandDetails.vue' })
const drawer = ref(false)

const handleClose = () => {
  drawer.value = false
}
const handleOpen = async (row: any) => {
  if (row?.id) {
    drawer.value = true
    demandDetails(row)
  }
}

const emits = defineEmits(['refresh'])
defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
