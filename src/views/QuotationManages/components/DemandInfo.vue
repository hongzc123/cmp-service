<template>
  <div>
    <el-descriptions title="需求信息" class="tw-mt-5">
      <el-descriptions-item label="需求编号：" v-if="isType === 2">
        {{ demandDetailInfo.intentionNo }}
      </el-descriptions-item>
      <el-descriptions-item label="报价次数："
        >{{ demandDetailInfo.quoteCount }}次</el-descriptions-item
      >
      <el-descriptions-item label="需求提交人：">
        {{ demandDetailInfo.createUsername }}
      </el-descriptions-item>
      <el-descriptions-item label="需求方：">
        {{ demandDetailInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item label="意向物流：" v-if="isType !== 2">
        <template v-if="internationalShippingType?.length > 0">
          <span v-for="(item, index) in internationalShippingType" :key="index">
            {{ valueToLabel(item, internationalShippingTypeListFn()) }}
            {{ index !== internationalShippingType.length - 1 ? '，' : '' }}
          </span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="需求类型：" v-if="isType === 3">
        {{ serviceTypeFilter(demandDetailInfo.type) }}
      </el-descriptions-item>
      <el-descriptions-item label="联系方式" v-if="isType !== 3">
        {{ demandDetailInfo.mobile }}
      </el-descriptions-item>
      <el-descriptions-item label="备注：" v-if="isType !== 2">
        {{ demandDetailInfo.remark }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions>
      <el-descriptions-item label="提货方式：">
        {{ valueToLabel(demandDetailInfo.lastShippingType, deliveryMethodFn()) }}
        <div style="margin-left: 60px" v-if="demandDetailInfo.lastShippingType === 1">
          <el-table ref="multipleTableRef" :data="addressInfo" :border="true">
            <el-table-column label="国家" header-align="left" align="left" property="country" />
            <el-table-column label="城市" header-align="left" align="left" property="province" />
            <el-table-column label="区" header-align="left" align="left" property="city" />
            <el-table-column label="详细地址" header-align="left" align="left" property="detail">
              <template #header> 详细地址 </template>
              <template #default="scope">
                <div class="flex">
                  <el-icon
                    v-if="scope.row.detail"
                    class="pad5"
                    @click="handleCopy(scope.row.detail)"
                    ><CopyDocument
                  /></el-icon>
                  {{ scope.row.detail }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="建筑名称"
              header-align="left"
              align="left"
              property="contactInfo"
            >
              <template #header> 建筑名称 </template>
              <template #default="scope">
                <div class="flex">
                  <el-icon
                    v-if="scope.row.positioning"
                    class="pad5"
                    @click="handleCopy(scope.row.positioning)"
                    ><CopyDocument
                  /></el-icon>
                  {{ scope.row.positioning }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="邮编" header-align="left" align="left" property="postalCode" />
          </el-table>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions>
      <el-descriptions-item label="需求：">
        <el-table ref="multipleTableRef" :data="itemList" :border="true">
          <el-table-column label="产品信息" header-align="left" align="left">
            <template #default="scope">
              <ProductItem :items="[scope.row]" />
            </template>
          </el-table-column>
          <el-table-column label="采购链接" header-align="left" align="left" property="purchaseUrl">
            <template #default="scope">
              <span
                class="text-blue tw-line-clamp-2 tw-cursor-pointer"
                @click="openUrl(scope.row.purchaseUrl)"
                >{{ scope.row.purchaseUrl }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="预期单价" header-align="left" align="left" property="purchaseFee">
            <template #default="scope">
              {{ scope.row.purchaseFee }}{{ demandDetailInfo.currency }}
            </template>
          </el-table-column>
          <el-table-column
            label="采购数量"
            header-align="left"
            align="left"
            property="purchaseCount"
          >
            <template #default="scope">
              {{ scope.row.purchaseCount }}
            </template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions v-if="demandDetailInfo.jsonData && demandDetailInfo.jsonData.fileUrl">
      <el-descriptions-item label="附件">
        <div v-for="(item, index) in demandDetailInfo.jsonData?.fileUrl.split(',')" :key="index">
          <span class="cur-pointer" @click="openUrl(item)">{{ item }}</span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import { openUrl, handleCopy } from '@/utils/util'
import { valueToLabel } from 'cmpanda-util'
import {
  deliveryMethodFn,
  internationalShippingTypeListFn,
  serviceTypeFilter
} from '@/utils/options'

defineOptions({ name: 'DemandInfo.vue' })
const props = defineProps<{
  internationalShippingType: any[]
  addressInfo: any[]
  itemList: any[]
  demandDetailInfo: CreateNoEmptyRules
  isType: number // 1 需求详情 2 报价详情 3 开始报价
}>()
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
