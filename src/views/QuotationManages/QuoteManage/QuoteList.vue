<template>
  <div class="tw-h-full tw-relative tw-top-[18px]">
    <CommonBreadcrumb />
    <CommonSearch
      ref="SearchRef"
      :searchTypes="searchTypes"
      @change="handleSearch"
      @export="handleExport"
    />
    <el-table class="tw-my-5" ref="multipleTableRef" :data="tableData" :border="true" stripe>
      <el-table-column label="报价单号" header-align="center" align="center" property="quoteNo">
        <template #default="scope">
          <div class="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
            <span class="tw-text-[#409eff]" @click="handleQuoteDetail(scope.row)">{{
              scope.row.quoteNo
            }}</span>
            <el-icon :size="15" class="tw-mx-1" @click="handleCopy(scope.row.quoteNo)">
              <CopyDocument />
            </el-icon>
          </div>
          <div class="flex align-i-c justify-c-c">
            <!-- 生效中 -->
            <el-tag v-if="scope.row.status === 1">生效中</el-tag>
            <!-- 已失效 -->
            <el-tag v-if="scope.row.status === 2" type="info">已失效</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报价商品" header-align="center" align="center" property="imageUrls">
        <template #default="scope">
          <div v-if="scope.row.imageUrls">
            <div class="tw-flex tw-justify-center tw-flex-wrap">
              <el-image
                v-for="(url, index) in scope.row.imageUrls.split(',').slice(0, 3)"
                :key="index"
                v-show="url"
                class="tw-w-[50px] tw-h-[50px] tw-m-2"
                :src="url"
                :preview-src-list="[url]"
                :initial-index="index"
                fit="cover"
                :z-index="9999"
                preview-teleported
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="需求编号" header-align="center" align="center" property="intentionNo">
        <template #default="scope">
          <div class="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
            <span class="tw-text-[#409eff]" @click="handleDemandDetail(scope.row)">{{
              scope.row.intentionNo
            }}</span>
            <el-icon :size="15" class="tw-mx-1" @click="handleCopy(scope.row.intentionNo)">
              <CopyDocument />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="报价总额"
        header-align="center"
        align="center"
        property="showTotalPrice"
      >
        <template #default="scope">
          {{ scope.row.currency }} {{ scope.row.showTotalPrice }}
        </template>
      </el-table-column>
      <el-table-column label="提货方式" header-align="center" align="center" property="createTime">
        <template #default="scope">
          {{ valueToLabel(scope.row.lastShippingType, deliveryMethodFn()) }}
        </template>
      </el-table-column>
      <el-table-column
        label="报价人"
        header-align="center"
        align="center"
        property="createUsername"
      />
      <el-table-column label="失效时间" header-align="center" align="center" property="lapseTime">
        <template #default="scope">
          {{ dayjs(scope.row.lapseTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination ref="PaginationRef" @change="handleSearch" />

    <!-- 报价单详情 -->
    <QuoteDetails ref="QuoteDetailsRef" />

    <!-- 需求详情 -->
    <DemandDetails ref="DemandDetailsRef" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { quoteOrderList, exportQuoteOrderList } from '@/api/quotation'
import { fileCreate } from '@/api/other'
import CommonBreadcrumb from '@/components/CommonBreadcrumb.vue'
import CommonPagination from '@/components/CommonPagination.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import QuoteDetails from '../drawer/QuoteDetails.vue'
import DemandDetails from '../drawer/DemandDetails.vue'
import { onMounted, ref } from 'vue'
import { valueToLabel } from 'cmpanda-util'
import { handleCopy } from '@/utils/util'
import { deliveryMethodFn, quoteStatusListFn } from '@/utils/options'
import { useQuotationDetail } from '../hook/quotationHook'
import { useRoute } from 'vue-router'
import emitter from '@/utils/eventBus'
const { QuoteDetailsRef, DemandDetailsRef } = useQuotationDetail()

defineOptions({ name: 'QuoteList.vue' })

const searchTypes: SearchTypes = {
  quoteNo: {
    type: 'string',
    label: '报价单号',
    placeholder: '输入报价单号'
  },
  intentionNo: {
    type: 'string',
    label: '需求编号',
    placeholder: '输入编号'
  },
  lastShippingType: {
    type: 'select',
    label: '提货方式',
    placeholder: '全部',
    options: deliveryMethodFn()
  },
  username: {
    type: 'string',
    label: '需求方',
    placeholder: '输入需求方'
  },
  createUsername: {
    type: 'string',
    label: '报价人',
    placeholder: '输入报价人'
  },
  status: {
    type: 'select',
    label: '报价状态',
    placeholder: '全部',
    options: quoteStatusListFn()
  },
  quoteTime: {
    type: 'date',
    label: '报价时间'
  },
  lapseTime: {
    type: 'date',
    label: '失效时间'
  }
}
const SearchRef: any = ref(null)
const PaginationRef: any = ref(null)
const tableData = ref([])

const handleExport = async () => {
  const form = SearchRef.value.form
  const params = {
    ...form,
    quoteTime: form.quoteTime?.toString() || '',
    lapseTime: form.lapseTime?.toString() || ''
  }
  const { data } = await fileCreate({ fileName: '报价单管理' })
  await exportQuoteOrderList({ ...params, fileId: data.datas })
  emitter.emit('trigger')
  ElMessage.success('正在导出，请在右上角点击下载')
}

const handleSearch = async (isSearch?: boolean) => {
  const form = SearchRef.value.form
  if (isSearch) PaginationRef.value.reset()
  const params = {
    ...PaginationRef.value.page,
    ...form,
    quoteTime: form.quoteTime?.toString() || '',
    lapseTime: form.lapseTime?.toString() || ''
  }
  const { data } = await quoteOrderList(params)
  tableData.value = data.datas.records
  PaginationRef.value.updateTotal(data.datas.total)
}

// 报价单详情
const handleQuoteDetail = (row: any) => {
  QuoteDetailsRef.value.handleOpen(row)
}

// 需求详情
const handleDemandDetail = (row: any) => {
  DemandDetailsRef.value.handleOpen(row)
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped></style>
