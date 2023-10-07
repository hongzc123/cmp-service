<template>
  <el-drawer
    class="details-drawer"
    v-model="drawer"
    size="80%"
    @close="handleClose"
    :show-close="false"
  >
    <template #header>
      <h4 class="tw-flex tw-cursor-pointer tw-justify-between tw-items-center">
        <div class="tw-flex">
          <div class="tw-flex tw-items-center" @click="handleClose">
            <el-icon size="20"><Back /></el-icon>
            <span class="tw-mx-3">返回</span>
          </div>
          <span class="tw-mr-5">{{ quoteDetailsInfo.quoteNo }}</span>
        </div>
        <div>
          <el-tag v-if="quoteDetailsInfo.status === 1">生效中</el-tag>
          <el-tag v-if="quoteDetailsInfo.status === 2" type="info">已失效</el-tag>
        </div>
      </h4>
    </template>
    <div class="tw-mb-[60px]">
      <!-- 报价信息 -->
      <QuotationInfo ref="QuotationInfoRef" :disabled="disabled" />

      <!-- 需求信息 -->
      <DemandInfo
        :internationalShippingType="quoteDetailsInfo.internationalShippingType"
        :demandDetailInfo="quoteDetailsInfo"
        :addressInfo="quoteDetailsInfo.addressInfo"
        :itemList="quoteDetailsInfo.itemList"
        :isType="2"
      />

      <!-- 报价历史 -->
      <QuotationHistory :quoteList="quoteDetailsInfo.quoteList" :showQuoteDetails="false" />

      <!-- 底部操作 商品详情可提交 -->
      <section
        class="footer tw-flex tw-justify-end tw-p-3"
        v-if="quoteDetailsInfo.isChangeGrossRate === 1"
      >
        <el-button type="primary" @click="submit">提交</el-button>
      </section>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import DemandInfo from '../components/DemandInfo.vue'
import QuotationHistory from '../components/QuotationHistory.vue'
import QuotationInfo from '../components/QuotationInfo.vue'
import { useQuotationDetail } from '../hook/quotationHook'
const { quoteDetails, quoteDetailsInfo, QuotationInfoRef } = useQuotationDetail()

const drawer: Ref = ref(false)
const disabled: Ref = ref(false)

const handleClose = () => {
  drawer.value = false
  disabled.value = false
}
const handleOpen = async (data: any) => {
  drawer.value = true
  disabled.value = true
  await quoteDetails(data, true)
}
const submit = () => {
  QuotationInfoRef.value.handleSubmitSalesMoney()
}

defineExpose({
  handleOpen
})
defineOptions({ name: 'QuoteDetails.vue' })
</script>

<style lang="scss">
@import '../css/css.scss';
</style>
