<template>
  <div class="tw tw-absolute tw-z-[100] tw-top-[34px] tw-bg-white tw-w-full">
    <section
      class="tw-flex tw-items-center tw-justify-between tw-sticky tw-top-[44px] tw-bg-white tw-z-[110] tw-h-[50px] tw-px-3"
    >
      <CommonBreadcrumb class="!tw-pb-0" />
      <div>
        <el-button type="primary" plain @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="submit(0)">暂存</el-button>
        <el-button type="primary" @click="submit(1)">提交</el-button>
      </div>
    </section>
    <div class="tw-h-full">
      <el-card class="tw-mt-5 tw-mb-[60px]">
        <template #header>
          <h4 class="tw-flex tw-cursor-pointer">
            <div class="tw-flex tw-items-center" @click="handleClose">
              <el-icon size="20"><Back /></el-icon>
              <span class="tw-mx-3">返回</span>
            </div>
            <span class="tw-mr-5">{{ demandDetailInfo.intentionNo }}</span>
          </h4>
        </template>
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
          :isType="3"
        />
        <!-- 报价信息 -->
        <QuotationInfo ref="QuotationInfoRef" :disabled="false" />
        <!-- 报价历史 -->
        <QuotationHistory
          :quoteList="demandDetailInfo.quoteList"
          :showQuoteDetails="true"
          @quoteDetail="handleQuoteDetail"
        />
        <!-- 操作日志 -->
        <OperationLog :operationLog="demandDetailInfo.operationLog" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CommonBreadcrumb from '@/components/CommonBreadcrumb.vue'
import DemandInfo from '../components/DemandInfo.vue'
import QuotationHistory from '../components/QuotationHistory.vue'
import OperationLog from '../components/OperationLog.vue'
import QuotationInfo from '../components/QuotationInfo.vue'
import DemandStatusBar from '../components/DemandStatusBar.vue'
import { useQuotationDetail } from '../hook/quotationHook'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { quoteSubmit } from '@/api/quotation'
const { demandDetails, demandDetailInfo, QuotationInfoRef, QuoteDetailsRef } = useQuotationDetail()
import { ElMessage, ElLoading } from 'element-plus'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
defineOptions({ name: 'QuotationCreate.vue' })

const handleClose = () => {
  store.setPageBackState(true)
  router.go(-1)
}
const cancel = () => {
  store.setPageBackState(true)
  router.push({
    path: '/quotationManages/demandManageList'
  })
}
const submit = async (val: number) => {
  const form = QuotationInfoRef.value.form
  const quoteOrderItemList = QuotationInfoRef.value.quoteOrderItemList
  const quoteOrderParcelList = QuotationInfoRef.value.quoteOrderParcelList
  const quotationPreviewList = QuotationInfoRef.value.quotationPreviewList
  const sales = quotationPreviewList[2]
  const show = quotationPreviewList[3]
  console.log('开始报价-获取form', form)
  console.log('开始报价-获取销售价', sales)
  console.log('开始报价-获取展示价', show)
  // console.log(quoteOrderItemList)
  // console.log(quoteOrderParcelList)

  if (val === 1 && demandDetailInfo.type === 'A1') {
    if (quoteOrderItemList?.length <= 0) {
      ElMessage.info('请完善信息')
      return false
    }
  } else {
    if (val === 1 && (quoteOrderItemList?.length <= 0 || quoteOrderParcelList?.length <= 0)) {
      ElMessage.info('请完善信息')
      return false
    }
  }

  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)'
  })

  const params = {
    ...form,
    salesPurchaseFee: sales.purchaseFee,
    salesShippingFee: sales.shippingFee,
    salesServiceFee: sales.serviceFee,
    salesLastShippingFee: sales.lastShippingFee,
    salesTransferFeeOcean: sales.transferFeeOcean,
    salesInternationalShippingFeeOcean: sales.internationalShippingFeeOcean,
    salesLocalShippingFeeOcean: sales.localShippingFeeOcean,
    salesTaxFeeOcean: sales.taxFeeOcean,
    salesTransferFeeLand: sales.transferFeeLand,
    salesInternationalShippingFeeLand: sales.internationalShippingFeeLand,
    salesLocalShippingFeeLand: sales.localShippingFeeLand,
    salesTaxFeeLand: sales.taxFeeLand,
    salesTotalPriceOcean: sales.totalPriceOcean,
    salesTotalPriceLand: sales.totalPriceLand,

    showPurchaseFee: show.purchaseFee,
    showInternationalShippingFeeOcean: show.internationalShippingFeeOcean,
    showInternationalShippingFeeLand: show.internationalShippingFeeLand,
    showLastShippingFee: show.lastShippingFee,
    showTotalPriceOcean: show.totalPriceOcean,
    showTotalPriceLand: show.totalPriceLand,

    logisticsConfigThId: form.logisticsConfigThId,
    rate: demandDetailInfo.rate,
    site: demandDetailInfo.jsonData.site,
    taxRate: demandDetailInfo.baseNumberObj.taxRate,
    createUsername: demandDetailInfo.createUsername,
    currency: demandDetailInfo.currency,
    intentionNo: demandDetailInfo.intentionNo,
    internationalShippingType: form.checkList.join(','),
    lastShippingType: demandDetailInfo.lastShippingType,
    isPurchase: 1,
    isInternational: demandDetailInfo.type === 'A1' ? 0 : 1,
    isSubmit: val,
    grossRete: demandDetailInfo.baseNumberObj.defaultGrossRate,
    priceConfigId: demandDetailInfo.baseNumberObj.priceConfigId,
    quoteOrderItemList: quoteOrderItemList,
    quoteOrderParcelList: quoteOrderParcelList
  }
  console.log('开始报价-所有请求参数', params)
  try {
    const { data } = await quoteSubmit(params)
    if (data.resp_code === 0) {
      ElMessage.success(val === 0 ? '暂存成功' : '提交成功')
      store.setPageBackState(true)
      loading.close()
      router.push({
        path: '/quotationManages/demandManageList'
      })
    } else {
      loading.close()
    }
  } catch (error: any) {
    new Error(error)
    loading.close()
  }
}
const handleQuoteDetail = (row: any) => {
  QuoteDetailsRef.value.handleOpen(row)
}
onMounted(() => {
  demandDetails(route.query, true)
})
</script>
