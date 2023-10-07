<template>
  <div class="tw-h-full tw-relative tw-top-[18px]">
    <CommonBreadcrumb />
    <CommonSearch
      ref="SearchRef"
      :searchTypes="searchTypes"
      @change="handleSearch"
      @export="handleExport"
    />
    <el-table
      class="tw-my-5"
      :style="{ display: isTableListShow ? 'block' : 'none' }"
      ref="multipleTableRef"
      :data="tableData"
      :border="true"
      stripe
    >
      <el-table-column
        label="需求编号"
        header-align="center"
        align="center"
        property="intentionNo"
        width="250"
      >
        <template #default="scope">
          <div class="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
            <span class="tw-text-[#409eff]" @click="detail(scope.row)">{{
              scope.row.intentionNo
            }}</span>
            <el-icon :size="15" class="tw-mx-1" @click="handleCopy(scope.row.intentionNo)">
              <CopyDocument />
            </el-icon>
          </div>
          <div class="flex align-i-c justify-c-c">
            <!-- 需求状态：0=待补充 1=等待报价 2=报价中 3=已报价 4=驳回 -->
            <!-- 待补充 -->
            <el-tag v-if="scope.row.status === 0" type="warning">待补充</el-tag>
            <!-- 待确认 -->
            <el-tag v-if="scope.row.status === 1" type="success">待确认</el-tag>
            <!-- 报价中 -->
            <el-tag v-if="scope.row.status === 2">报价中</el-tag>
            <!-- 已驳回 -->
            <el-tag v-if="scope.row.status === 4" type="danger">已驳回</el-tag>
            <el-popover
              v-if="scope.row.status === 4"
              placement="top-start"
              width="auto"
              trigger="hover"
            >
              <template #reference>
                <el-icon color="#EA5622" :size="18" class="mar-l10"><Warning /></el-icon>
              </template>
              <template #default>
                <p>驳回原因：{{ scope.row.rejectReason }}</p>
                <p>备注：{{ scope.row.rejectRemark }}</p>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报价次数" header-align="center" align="center" property="quoteCount">
        <template #default="scope">
          <el-button v-if="scope.row.quoteCount" type="primary" link>
            <el-popover
              placement="right"
              width="auto"
              trigger="hover"
              @show="demandDetails(scope.row)"
            >
              <template #reference> {{ scope.row.quoteCount }} </template>
              <el-table ref="multipleTableRef" :data="demandDetailInfo.quoteList" :border="true">
                <el-table-column
                  label="报价单号"
                  header-align="left"
                  align="left"
                  property="contactInfo"
                  width="250px"
                >
                  <template #default="slotScope">
                    <div
                      class="tw-text-[#409eff] tw-cursor-pointer"
                      @click="handleQuoteDetail(slotScope.row)"
                    >
                      {{ slotScope.row.quoteNo }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="报价金额"
                  header-align="left"
                  align="left"
                  property="contactInfo"
                  width="200px"
                >
                  <template #default="slotScope"
                    >{{ slotScope.row.currency }} {{ slotScope.row.showTotalPrice }}</template
                  >
                </el-table-column>
                <el-table-column
                  label="失效时间"
                  header-align="left"
                  align="left"
                  property="contactInfo"
                  width="200px"
                >
                  <template #default="slotScope">{{
                    dayjs(slotScope.row.lapseTime).format('YYYY-MM-DD HH:mm:ss')
                  }}</template>
                </el-table-column>
              </el-table>
            </el-popover>
          </el-button>
          <div v-else>{{ scope.row.quoteCount }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="需求内容"
        header-align="center"
        align="center"
        property="clueTag"
        width="250px"
      >
        <template #default="scope">
          <div v-if="scope.row.jsonData && JSON.parse(scope.row.jsonData).itemList">
            <div class="tw-flex tw-justify-center">
              <el-image
                v-for="(item, index) in JSON.parse(scope.row.jsonData).itemList.slice(0, 3)"
                :key="index"
                v-show="item.imageUrl"
                class="tw-w-[50px] tw-h-[50px] tw-mr-[10px]"
                :src="item.imageUrl"
                :preview-src-list="[item.imageUrl]"
                :initial-index="index"
                fit="cover"
                :z-index="9999"
                preview-teleported
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="需求总额" header-align="center" align="center" property="totalPrice">
        <template #default="scope"> {{ scope.row.currency }} {{ scope.row.totalPrice }} </template>
      </el-table-column>
      <el-table-column
        label="需求类型"
        header-align="center"
        align="center"
        property="receiveUsername"
      >
        <template #default="scope">
          {{ serviceTypeFilter(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="提货方式" header-align="center" align="center" property="createTime">
        <template #default="scope">
          {{ valueToLabel(scope.row.lastShippingType, deliveryMethodFn()) }}
        </template>
      </el-table-column>
      <el-table-column label="需求方" header-align="center" align="center" property="username" />
      <el-table-column
        label="提交人"
        header-align="center"
        align="center"
        property="createUsername"
      />
      <el-table-column
        label="报价人"
        header-align="center"
        align="center"
        property="quoteUsername"
        width="200px"
      >
        <template #default="scope">
          <div>{{ scope.row.quoteUsername || '-' }}</div>
          <div>
            {{ scope.row.quoteTime && dayjs(scope.row.quoteTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="220px">
        <template #default="scope">
          <div class="tw-flex tw-justify-center tw-items-center">
            <el-button v-if="scope.row.status === 1" type="primary" @click="prepare(scope.row)"
              >准备报价</el-button
            >
            <el-button v-if="scope.row.status === 1" type="primary" plain @click="reject(scope.row)"
              >驳回需求</el-button
            >
            <el-button v-if="scope.row.status === 2" type="primary" @click="start(scope.row)"
              >开始报价</el-button
            >
            <el-button v-if="scope.row.status === 2" type="primary" plain @click="cancel(scope.row)"
              >取消准备</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination ref="PaginationRef" @change="handleSearch" />

    <!-- 报价单详情 -->
    <QuoteDetails ref="QuoteDetailsRef" />

    <!-- 需求详情 -->
    <DemandDetails ref="DemandDetailsRef" />

    <!-- 驳回需求 -->
    <RejectDemand ref="RejectDemandRef" @refresh="handleSearch" />

    <!-- 开始报价 -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import {
  queryIntentionList,
  changePurchaseIntentionStatus,
  exportIntentionList
} from '@/api/quotation'
import { fileCreate } from '@/api/other'
import CommonBreadcrumb from '@/components/CommonBreadcrumb.vue'
import CommonPagination from '@/components/CommonPagination.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import DemandDetails from '../drawer/DemandDetails.vue'
import QuoteDetails from '../drawer/QuoteDetails.vue'
import RejectDemand from '../dialog/RejectDemand.vue'
import { onMounted, ref, watch } from 'vue'
import { valueToLabel } from 'cmpanda-util'
import { handleCopy } from '@/utils/util'
import emitter from '@/utils/eventBus'
import { deliveryMethodFn, requirementTypeFn, serviceTypeFilter } from '@/utils/options'
import { useQuotationDetail } from '../hook/quotationHook'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const { DemandDetailsRef, QuoteDetailsRef, demandDetails, demandDetailInfo } = useQuotationDetail()
defineOptions({ name: 'DemandManageList.vue' })

const searchTypes: SearchTypes = {
  intentionNo: {
    type: 'string',
    label: '需求编号',
    placeholder: '输入编号'
  },
  username: {
    type: 'string',
    label: '需求方',
    placeholder: '输入需求方'
  },
  createUsername: {
    type: 'string',
    label: '提交人',
    placeholder: '输入提交人'
  },
  quoteUsername: {
    type: 'string',
    label: '报价人',
    placeholder: '输入报价人'
  },
  lastShippingType: {
    type: 'select',
    label: '提货方式',
    placeholder: '全部',
    options: deliveryMethodFn()
  },
  type: {
    type: 'select',
    label: '需求类型',
    placeholder: '全部',
    options: requirementTypeFn()
  },
  submitTime: {
    type: 'date',
    label: '提交时间'
  },
  quoteTime: {
    type: 'date',
    label: '准备报价时间'
  }
}
const SearchRef: any = ref(null)
const PaginationRef: any = ref(null)
const tableData = ref([])
const popoverVisible = ref<boolean>(false)
const isTableListShow = ref<boolean>(false)
const RejectDemandRef: any = ref(null)

const handleExport = async () => {
  const form = SearchRef.value.form
  const params = {
    ...form,
    submitTime: form.submitTime?.toString() || '',
    quoteTime: form.quoteTime?.toString() || ''
  }
  const { data } = await fileCreate({ fileName: '需求管理' })
  await exportIntentionList({ ...params, fileId: data.datas })
  emitter.emit('trigger')
  ElMessage.success('正在导出，请在右上角点击下载')
}

const handleSearch = async (isSearch?: boolean) => {
  const form = SearchRef.value.form
  if (isSearch) PaginationRef.value.reset()
  const params = {
    ...PaginationRef.value.page,
    ...form,
    submitTime: form.submitTime?.toString() || '',
    quoteTime: form.quoteTime?.toString() || ''
  }
  const { data } = await queryIntentionList(params)
  tableData.value = data.datas.records
  PaginationRef.value.updateTotal(data.datas.total)
}
// 需求详情
const detail = (row: any) => {
  DemandDetailsRef.value.handleOpen(row)
}
// 准备报价
const prepare = async ({ intentionNo }: any) => {
  ElMessageBox.confirm('准备开始报价？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { data } = await changePurchaseIntentionStatus({
        intentionNo,
        status: 2
      })
      popoverVisible.value = false
      if (data.resp_code === 0) handleSearch()
    })
    .catch(() => {})
}
// 驳回需求
const reject = async ({ intentionNo }: any) => {
  RejectDemandRef.value.handleOpen(intentionNo)
}
// 开始报价
const start = (row: any) => {
  router.push({
    path: '/quotationManages/demandManageList/quotationCreate',
    query: {
      intentionNo: row.intentionNo
    }
  })
  isTableListShow.value = false
}
// 取消准备
const cancel = async ({ intentionNo }: any) => {
  ElMessageBox.confirm('确定取消？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const { data } = await changePurchaseIntentionStatus({
        intentionNo,
        status: 1
      })
      popoverVisible.value = false
      if (data.resp_code === 0) handleSearch()
    })
    .catch(() => {})
}
// 报价单详情
const handleQuoteDetail = (row: any) => {
  QuoteDetailsRef.value.handleOpen(row)
}

watch(
  () => route.path,
  (path) => {
    if (path === '/quotationManages/demandManageList') {
      isTableListShow.value = true
      if (SearchRef.value?.form) {
        handleSearch()
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped></style>
