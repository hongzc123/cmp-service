<template>
  <div>
    <div class="desc-header">报价历史</div>
    <el-table ref="multipleTableRef" :data="props.quoteList" :border="true">
      <el-table-column
        label="报价单号"
        header-align="left"
        align="left"
        property="contactInfo"
        width="250px"
      >
        <template #default="scope">
          <div class="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
            <span class="tw-text-[#409eff]" @click="handleQuoteDetail(scope.row)">{{
              scope.row.quoteNo
            }}</span>
            <el-icon :size="15" class="tw-mx-1" @click="handleCopy(scope.row.quoteNo)">
              <CopyDocument />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="报价人"
        header-align="left"
        align="left"
        property="createUsername"
        width="200px"
      />
      <el-table-column
        label="报价金额"
        header-align="left"
        align="left"
        property="contactInfo"
        width="200px"
      >
        <template #default="scope"
          >{{ scope.row.currency }} {{ scope.row.showTotalPrice }}</template
        >
      </el-table-column>
      <el-table-column
        label="报价时效"
        header-align="left"
        align="left"
        property="contactInfo"
        width="150px"
      >
        <template #default="scope">
          {{ calcEfficiency(scope.row.efficiency) }}
          {{ scope.row.efficiency !== null || scope.row.efficiency !== undefined ? '小时' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="报价时间"
        header-align="left"
        align="left"
        property="quoteTime"
        width="200px"
      >
        <template #default="scope">{{
          dayjs(scope.row.quoteTime).format('YYYY-MM-DD HH:mm:ss')
        }}</template>
      </el-table-column>
      <el-table-column
        label="失效时间"
        header-align="left"
        align="left"
        property="contactInfo"
        width="200px"
      >
        <template #default="scope">{{
          dayjs(scope.row.lapseTime).format('YYYY-MM-DD HH:mm:ss')
        }}</template>
      </el-table-column>
      <el-table-column label="状态" header-align="left" align="left" property="status">
        <template #default="scope">
          {{ valueToLabel(scope.row.status, quoteStatusListFn()) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 报价单详情 -->
    <QuoteDetails ref="QuoteDetailsRef" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import NP from 'number-precision'
import { quoteStatusListFn } from '@/utils/options'
import { valueToLabel } from 'cmpanda-util'
import { handleCopy } from '@/utils/util'
import QuoteDetails from '../drawer/QuoteDetails.vue'
import { useQuotationDetail } from '../hook/quotationHook'
const { QuoteDetailsRef } = useQuotationDetail()

const props = defineProps<{
  quoteList: any[]
  showQuoteDetails: boolean
}>()

const handleQuoteDetail = (row: any) => {
  if (props.showQuoteDetails) {
    QuoteDetailsRef.value.handleOpen(row)
  }
}

const calcEfficiency = (efficiency: number) => {
  if (efficiency && efficiency > 0) {
    return NP.round(NP.divide(efficiency, 3600), 2)
  } else {
    return 0
  }
}

defineOptions({ name: 'QuotationHistory.vue' })
const emit = defineEmits(['quoteDetail'])
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
