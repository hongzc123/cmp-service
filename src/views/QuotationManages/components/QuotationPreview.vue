<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center">
      <div class="desc-title">报价预览</div>
      <div class="tw-text-sm">汇率：{{ detailInfo.rate }}{{ props.detailInfo.currency }}</div>
    </div>
    <el-table ref="multipleTableRef" :data="props.quotationPreviewList" :border="true">
      <el-table-column
        label="费用项"
        header-align="left"
        align="left"
        property="costItem"
        width="150px"
      >
        <template #default="scope">
          <!-- tw-whitespace-nowrap -->
          <span class="tw-flex tw-items-center">
            {{ scope.row.costItem }}
            <el-icon
              v-if="scope.$index === 1 && detailInfo.status === 1"
              :size="20"
              class="tw-cursor-pointer"
              @click="setGrossRete"
              ><EditPen
            /></el-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="`采购费用(${props.detailInfo && props.detailInfo.currency})`"
        header-align="left"
        align="left"
        property="purchaseFee"
        width="180px"
      >
        <template #default="scope">
          <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
            <div class="units">
              {{ detailInfo.currency }}
            </div>
            <el-input-number
              class="!tw-w-[120px] input-number-controls"
              v-model="scope.row.purchaseFee"
              placeholder="输入金额"
              :min="quotationPreviewList[1].purchaseFee"
              :controls="false"
              @change="changeSalesMoney(scope.row)"
            />
          </div>
          <span v-else>{{ scope.row.purchaseFee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="`中国境内运费(${props.detailInfo && props.detailInfo.currency})`"
        header-align="left"
        align="left"
        property="shippingFee"
        width="180px"
      >
        <template #default="scope">
          <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
            <div class="units">
              {{ detailInfo.currency }}
            </div>
            <el-input-number
              class="!tw-w-[120px] input-number-controls"
              v-model="scope.row.shippingFee"
              placeholder="输入金额"
              :min="quotationPreviewList[1].shippingFee"
              :controls="false"
              @change="changeSalesMoney(scope.row)"
            />
          </div>
          <span v-else>{{ scope.row.shippingFee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="`服务费(${props.detailInfo && props.detailInfo.currency})`"
        header-align="left"
        align="left"
        property="serviceFee"
        width="180px"
      >
        <template #default="scope">
          <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
            <div class="units">
              {{ detailInfo.currency }}
            </div>
            <el-input-number
              class="!tw-w-[120px] input-number-controls"
              v-model="scope.row.serviceFee"
              placeholder="输入金额"
              :min="quotationPreviewList[1].serviceFee"
              :controls="false"
              @change="changeSalesMoney(scope.row)"
            />
          </div>
          <span v-else>{{ scope.row.serviceFee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.detailInfo.lastShippingType === 1 && props.detailInfo.type !== 'A1'"
        :label="`最后一公里(${props.detailInfo && props.detailInfo.currency})`"
        header-align="left"
        align="left"
        property="lastShippingFee"
        width="180px"
      >
        <template #default="scope">
          <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
            <div class="units">
              {{ detailInfo.currency }}
            </div>
            <el-input-number
              class="!tw-w-[120px] input-number-controls"
              v-model="scope.row.lastShippingFee"
              placeholder="输入金额"
              :min="quotationPreviewList[1].lastShippingFee"
              :controls="false"
              @change="changeSalesMoney(scope.row)"
            />
          </div>
          <span v-else>{{ scope.row.lastShippingFee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkList.includes('ocean') && props.detailInfo.type !== 'A1'"
        label="海运"
      >
        <el-table-column
          prop="state"
          :label="`中转物流(${props.detailInfo && props.detailInfo.currency})`"
          property="transferFeeOcean"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.transferFeeOcean"
                placeholder="输入金额"
                :min="quotationPreviewList[1].transferFeeOcean"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.transferFeeOcean }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          :label="`国际物流(${props.detailInfo && props.detailInfo.currency})`"
          property="internationalShippingFeeOcean"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.internationalShippingFeeOcean"
                placeholder="输入金额"
                :min="quotationPreviewList[1].internationalShippingFeeOcean"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.internationalShippingFeeOcean }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          :label="`尾程物流(${props.detailInfo && props.detailInfo.currency})`"
          property="localShippingFeeOcean"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.localShippingFeeOcean"
                placeholder="输入金额"
                :min="quotationPreviewList[1].localShippingFeeOcean"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.localShippingFeeOcean }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="`增值税(${props.detailInfo && props.detailInfo.currency})`"
          header-align="left"
          align="left"
          property="taxFeeOcean"
          width="180px"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="checkList.includes('land_fast') && props.detailInfo.type !== 'A1'"
        label="陆运"
      >
        <el-table-column
          prop="state"
          :label="`中转物流(${props.detailInfo && props.detailInfo.currency})`"
          property="transferFeeLand"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.transferFeeLand"
                placeholder="输入金额"
                :min="quotationPreviewList[1].transferFeeLand"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.transferFeeLand }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          :label="`国际物流(${props.detailInfo && props.detailInfo.currency})`"
          property="internationalShippingFeeLand"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.internationalShippingFeeLand"
                placeholder="输入金额"
                :min="quotationPreviewList[1].internationalShippingFeeLand"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.internationalShippingFeeLand }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          :label="`尾程物流(${props.detailInfo && props.detailInfo.currency})`"
          property="localShippingFeeLand"
          width="180px"
        >
          <template #default="scope">
            <div v-if="scope.$index === 2" class="tw-flex tw-items-center">
              <div class="units">
                {{ detailInfo.currency }}
              </div>
              <el-input-number
                class="!tw-w-[120px] input-number-controls"
                v-model="scope.row.localShippingFeeLand"
                placeholder="输入金额"
                :min="quotationPreviewList[1].localShippingFeeLand"
                :controls="false"
                @change="changeSalesMoney(scope.row)"
              />
            </div>
            <span v-else>{{ scope.row.localShippingFeeLand }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="`增值税(${props.detailInfo && props.detailInfo.currency})`"
          header-align="left"
          align="left"
          property="taxFeeLand"
          width="180px"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="checkList.includes('ocean') && props.detailInfo.type !== 'A1'"
        label="海运"
      >
        <el-table-column
          prop="state"
          :label="`费用总额(${props.detailInfo && props.detailInfo.currency})`"
          property="totalPriceOcean"
          width="180px"
        >
          <template #default="scope">
            {{ scope.row.totalPriceOcean }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="checkList.includes('land_fast') && props.detailInfo.type !== 'A1'"
        label="陆运"
      >
        <el-table-column
          prop="state"
          :label="`费用总额(${props.detailInfo && props.detailInfo.currency})`"
          property="totalPriceLand"
          width="180px"
        >
          <template #default="scope">
            {{ scope.row.totalPriceLand }}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 跨境订单显示 -->
      <el-table-column
        v-if="props.detailInfo.type === 'A1'"
        prop="state"
        :label="`费用总额(${props.detailInfo && props.detailInfo.currency})`"
        property="totalPriceLand"
        width="180px"
      >
        <template #default="scope">
          {{ scope.row.totalPriceLand }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'QuotationPreview.vue' })

const props = defineProps<{
  detailInfo: any
  quotationPreviewList: any[]
  checkList: string[]
  disabled: boolean
}>()

const setGrossRete = () => {
  emit('setGrossRete')
}

const changeSalesMoney = (row: any) => {
  emit('changeSalesMoney', row)
}

const emit = defineEmits(['setGrossRete', 'changeSalesMoney'])
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
