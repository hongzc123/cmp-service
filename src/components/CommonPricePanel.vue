<template>
  <el-dialog title="毛利率调整" v-model="visible" width="1200px" :close-on-click-modal="false">
    <div class="tw-mb-5">
      <p>订单实际费用=入库实际体积重量计算的成本价×（1+毛利率）</p>
      <p>毛利率调整后原报价单失效，会生成一个新报价单，调整后需通知客服查看新报价单</p>
    </div>
    <el-table :data="data" border :span-method="handleSpanMethod">
      <el-table-column label="费用项目">
        <el-table-column width="120px">
          <template #default="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px">
          <template #default="scope">
            <span>{{ scope.row.subLabel }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="成本价(THB)">
        <template #default="scope">
          <span>{{ scope.row.costPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛利率">
        <template #default="scope">
          <div v-if="scope.$index === 0">
            <el-input-number
              v-model="profitRatio"
              :min="0"
              :controls="false"
              :precision="4"
              @change="handleFeeCount"
            />
            <span>%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售指导价(THB)">
        <template #default="scope">
          <span>{{ scope.row.salePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示价格(THB)">
        <template #default="scope">
          <span>{{ scope.row.showPrice }}</span>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span>
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="handleClick">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 毛利率弹窗面板组件
 */
import { reactive, ref } from 'vue'
import { ProfitFee } from '@/utils/fee'
import NP from 'number-precision'

defineOptions({ name: 'CommonPricePanel.vue' })

interface InitalData {
  defaultGrossRate: number // 默认毛利率
  defaultTaxRate: number // 默认税率
}
interface SpanItem {
  row: any
  column: any
  rowIndex: number
  columnIndex: number
}
interface RowItem {
  label: string
  subLabel?: string
  costPrice: number
  salePrice: number
  showPrice: number | string
  [key: string]: any
}

const visible = ref(false)
const profitRatio = ref(0) // 毛利率
const taxRatio = ref(0) // 税率

let data: RowItem[] = reactive([
  {
    label: '采购费用',
    costPrice: 18704,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '中国境内运费',
    costPrice: 10,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '服务费',
    costPrice: 50,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '最后一公里',
    costPrice: 131,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '海运',
    subLabel: '中转物流',
    costPrice: 51,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '海运',
    subLabel: '国际物流',
    costPrice: 1200,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '海运',
    subLabel: '尾程物流',
    costPrice: 3,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '海运',
    subLabel: '增值税',
    costPrice: 0,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '陆运',
    subLabel: '中转物流',
    costPrice: 51,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '陆运',
    subLabel: '国际物流',
    costPrice: 1400,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '陆运',
    subLabel: '尾程物流',
    costPrice: 3,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '陆运',
    subLabel: '增值税',
    costPrice: 0,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '海运',
    subLabel: '费用总额',
    costPrice: 0,
    salePrice: 0,
    showPrice: '-'
  },
  {
    label: '陆运',
    subLabel: '费用总额',
    costPrice: 0,
    salePrice: 0,
    showPrice: '-'
  }
])

const handleOpen = ({ defaultGrossRate, defaultTaxRate }: InitalData, priceData: RowItem[]) => {
  visible.value = true
  data = reactive(priceData)
  console.log(data)
  if (defaultGrossRate) profitRatio.value = NP.times(defaultGrossRate, 100)
  if (defaultTaxRate) taxRatio.value = defaultTaxRate
  handleFeeCount()
}

const handleClick = () => {
  visible.value = false
  emits('submit', { defaultGrossRate: profitRatio.value, defaultTaxRate: taxRatio.value, data })
}

// 表格布局控制
const handleSpanMethod = ({ rowIndex, columnIndex }: SpanItem) => {
  if ((rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) && columnIndex === 0) {
    return [1, 2]
  }
  if ((rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) && columnIndex === 1) {
    return [1, 0]
  }
  if (rowIndex === 4 && columnIndex === 0) {
    return [4, 1]
  }
  if ((rowIndex === 5 || rowIndex === 6 || rowIndex === 7) && columnIndex === 0) {
    return [0, 1]
  }
  if (rowIndex === 8 && columnIndex === 0) {
    return [4, 1]
  }
  if ((rowIndex === 9 || rowIndex === 10 || rowIndex === 11) && columnIndex === 0) {
    return [0, 1]
  }
  if (rowIndex === 0 && columnIndex === 3) {
    return [14, 1]
  }
  if (rowIndex !== 0 && columnIndex === 3) {
    return [0, 1]
  }
}

// 费用计算
const handleFeeCount = () => {
  console.log(123)
  // 海运成本税前金额
  // const costSeaPreTaxPrice = ProfitFee.costPreTaxPrice(
  //   ..._getPricesFromIndex([0, 1, 2, 3, 4, 5, 6], 'costPrice')
  // )
  // // 海运成本增值税
  // const costSeaTax = ProfitFee.costTax(costSeaPreTaxPrice, taxRatio.value)
  // data[7].costPrice = NP.round(costSeaTax, 2)
  // // 海运成本总金额
  // const costSeaTotalPrice = ProfitFee.costTotalPrice(costSeaPreTaxPrice, costSeaTax)
  // data[12].costPrice = NP.round(costSeaTotalPrice, 2)
  // // 陆运成本税前金额
  // const costLandPreTaxPrice = ProfitFee.costPreTaxPrice(
  //   ..._getPricesFromIndex([0, 1, 2, 3, 8, 9, 10], 'costPrice')
  // )
  // // 陆运成本增值税
  // const costLandTax = ProfitFee.costTax(costLandPreTaxPrice, taxRatio.value)
  // data[11].costPrice = NP.round(costLandTax, 2)
  // // 陆运成本总金额
  // const costLandTotalPrice = ProfitFee.costTotalPrice(costLandPreTaxPrice, costLandTax)
  // data[13].costPrice = NP.round(costLandTotalPrice, 2)
  // 计算所有销售指导价格
  _countAllSalePrice()
  // 计算所有展示价格
  _countAllShowPrice()
}

// 通过索引获取价格
const _getPricesFromIndex = (indexes: number[], type: string = 'costPrice'): number[] => {
  const prices: number[] = []
  indexes.forEach((index) => {
    prices.push(data[index][type])
  })
  return prices
}

// 计算所有销售指导价格
const _countAllSalePrice = () => {
  data.forEach((d, index: number) => {
    // 计算销售指导价格，除了总价之外都乘系数
    if (index <= 11) {
      d.salePrice = NP.round(
        ProfitFee.saleTotalPrice(d.costPrice, NP.divide(profitRatio.value, 100)),
        2
      )
    }
    if (index === 12) {
      d.salePrice = NP.round(
        _getPricesFromIndex([0, 1, 2, 3, 4, 5, 6, 7], 'salePrice').reduce((a, b) => a + b, 0),
        2
      )
    }
    if (index === 13) {
      d.salePrice = NP.round(
        _getPricesFromIndex([0, 1, 2, 3, 8, 9, 10, 11], 'salePrice').reduce((a, b) => a + b, 0),
        2
      )
    }
  })
}

// 计算所有展示价格
const _countAllShowPrice = () => {
  // 展示采购费用
  data[0].showPrice = NP.round(
    ProfitFee.showPurchaseFee(..._getPricesFromIndex([0, 1], 'salePrice')),
    2
  )
  // 展示最后一公里
  data[3].showPrice = data[3].salePrice
  // 展示海运国际物流
  data[5].showPrice = NP.round(
    ProfitFee.showInternationalFee(..._getPricesFromIndex([2, 4, 5, 6, 7], 'salePrice')),
    2
  )
  // 展示陆运国际物流
  data[9].showPrice = NP.round(
    ProfitFee.showInternationalFee(..._getPricesFromIndex([2, 8, 9, 10, 11], 'salePrice')),
    2
  )
  // 展示海运费用总额
  data[12].showPrice = data[12].salePrice
  // 展示陆运费用总额
  data[13].showPrice = data[13].salePrice
}

defineExpose({ handleOpen })
const emits = defineEmits(['submit'])
</script>

<style lang="scss" scoped></style>
