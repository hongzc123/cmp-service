import { ref, type Ref, reactive } from 'vue'
import { quoteSubmit } from '@/api/quotation'
import { createNoEmptyRules } from '@/utils/options'
import { ElMessage, ElLoading } from 'element-plus'
import NP from 'number-precision'
import { PackageFee, ProfitFee } from '@/utils/fee'
import { useAppStore } from '@/stores/app'
const store = useAppStore()

export const useQuotationInfo = () => {
  const form: any = reactive({
    checkList: ['land_fast'], // 国际运输方式多选框
    logisticsConfigTh: [], // 最后一公里下拉框选项
    logisticsConfigThId: 1, // 最后一公里
    logisticsName: '', // 最后一公里物流对应的名称
    length: 0, // 长
    width: 0, // 宽
    height: 0, // 高
    volume: undefined, // 体积
    weight: undefined, // 重量
    parcelOptions: [], // 包裹下拉项
    serviceFee: 0, // 服务费
    isFinalPrice: 1, // 1=按报价收费 0=按实际体积收费
    batchPurchaseCount: 0, // 批量采购数量
    batchPurchaseFeeCny: 0, // 批量采购单价
    batchShippingFeeCny: 0, // 批量中国境内运费
    lastShippingFee: 0 // 最后一公里
  })
  const quoteOrderItemList: any = ref([]) // 商品列表
  const quoteOrderParcelList: any = ref([]) // 包裹列表
  const AddProductRef: any = ref(null)
  const PackageRef: Ref = ref(null)
  const PriceRef: Ref = ref(null) // 毛利率组件
  const initParcelFormRef: Ref = ref(null)
  const isShowParcelOptions = ref<boolean>(false) // 显示添加包裹
  const setInitParcelRules = createNoEmptyRules(['volume', 'weight']) // 初始包裹校验规则
  const baseNumberObj: any = reactive({}) // 价格配置用于计算
  const detailInfo: any = reactive({}) // 详情
  const quotationPreviewList: Ref = ref([]) // 报价预览列表
  const grossRete: Ref = ref(null) // 毛利率
  const formRules = createNoEmptyRules([
    'productName',
    'collectionAttribute',
    'purchaseUrl',
    'purchaseCount',
    'purchaseFeeCny',
    'shippingFeeCny',
    'parcelSelected',
    'checkList'
  ])

  // 移除
  const delProduct = (row: any) => {
    const id = row.id ? row.id : row.gid
    const index = quoteOrderItemList.value.findIndex((item: any) => item.id === id)
    quoteOrderItemList.value.splice(index, 1)
    createParcelList()
  }
  // 添加
  const add = () => {
    AddProductRef.value.dialogVisible = true
  }
  // 添加商品
  const handleAddProduct = (row: any) => {
    const productObj = {
      purchaseCount: 0, // 采购数量
      purchaseFeeCny: 0, // 采购单价
      purchaseFee: 0, // 采购单价(采购单价x汇率rate)
      shippingFeeCny: 0, // 中国境内运费
      shippingFee: 0, // 中国境内运费(中国境内运费x汇率rate)
      parcelSelected: [], // 选择的包裹
      parcelJsonObj: [], // 提交的包裹数据
      itemType: ''
    }
    const arr = row.collectionAttribute.split(';')
    if (arr.length > 0) {
      row.collectionAttribute = row.collectionAttribute.replaceAll(';', '-')
    }
    const newObj = { ...productObj, ...row }
    quoteOrderItemList.value.push(newObj)
  }
  // 手动输入体积重置长宽高
  const changeVolume = (val: number, data: any, type: number) => {
    if (val !== undefined) {
      const { volume } = data
      if (volume < 0.0001) {
        data.volume = 0.0001
      }
      if (type === 1) {
        form.length = 0
        form.width = 0
        form.height = 0
      } else {
        data.length = 0
        data.width = 0
        data.height = 0
      }
    }
  }
  const batchCalcWeight = () => {}
  // 打开设置包裹窗口
  const setting = () => {
    PackageRef.value?.handleOpen(form.parcelOptions)
  }
  const valiNumberPass1 = (rule: any, value: any, callback: any) => {
    const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
    if (value === '') {
      callback(new Error('请输入体积'))
    } else if (!reg.test(value)) {
      callback(new Error('请输入数字'))
    } else if (value < 0.0001) {
      callback(new Error('体积不能低于0.0001'))
    } else {
      callback()
    }
  }
  const valiNumberPass2 = (rule: any, value: any, callback: any) => {
    const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
    if (value === '') {
      callback(new Error('请输入重量'))
    } else if (!reg.test(value)) {
      callback(new Error('请输入数字'))
    } else if (value < 0.01) {
      callback(new Error('重量不能低于0.01'))
    } else {
      callback()
    }
  }
  // 校验
  const validate = async () => {
    try {
      await initParcelFormRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }
  // 体积计算
  const calcVolume = async (item: any) => {
    const { width, height, length } = item
    if (width && height && length) {
      const volume = NP.round(NP.divide(NP.times(width || 0, height || 0, length || 0), 1000000), 4)
      item.volume = volume < 0.0001 ? 0.0001 : volume
    } else {
      item.volume = 0
    }
    console.log(item)
  }
  // 无包裹项时触发
  const parcelChick = () => {
    if (form.parcelOptions.length <= 0) {
      isShowParcelOptions.value = true
    }
  }
  // 设置初始包裹
  const setInitParcel = async () => {
    const valid = await validate()
    if (!valid) return false
    form.parcelOptions = [
      {
        parcelName: '包裹1',
        length: form.length,
        width: form.width,
        height: form.height,
        volume: form.volume,
        weight: form.weight
      }
    ]
    isShowParcelOptions.value = false

    // 点添加包裹，默认把这个包裹选中
    quoteOrderItemList.value.forEach((item: any, index: number) => {
      item.parcelSelected = [form.parcelOptions[0].parcelName]
      parcelSelected(index)
    })
  }
  // 设置多个包裹项
  const handleSubmitPackage = async (data: any[]) => {
    form.parcelOptions = [...data]
    await quoteOrderItemList.value.forEach((item: any) => {
      item.parcelJsonObj.forEach((e: any) => {
        form.parcelOptions.forEach((v: any) => {
          if (e.parcelName === v.parcelName) {
            e.length = v.length
            e.width = v.width
            e.height = v.height
            e.volume = v.volume
            e.weight = v.weight
            e.gauge = gaugeJoint(v)
            console.log(e.gauge)
          }
        })
      })
    })

    await createParcelList()
  }
  // 选择包裹，生成包裹信息
  const parcelSelected = (index: number) => {
    quoteOrderItemList.value[index].parcelJsonObj = []
    const selected = quoteOrderItemList.value[index].parcelSelected
    const imageUrl = quoteOrderItemList.value[index].imageUrl
    const productName = quoteOrderItemList.value[index].productName
    const collectionAttribute = quoteOrderItemList.value[index].collectionAttribute
    const parcelJsonObj: any = []
    form.parcelOptions.forEach((item: any) => {
      selected.forEach((e: any) => {
        if (item.parcelName === e) {
          item.count = 1
          item.gauge = gaugeJoint(item)
          item.imageUrl = imageUrl
          item.productName = productName
          item.collectionAttribute = collectionAttribute
          parcelJsonObj.push(item)
        }
      })
    })
    quoteOrderItemList.value[index].parcelJsonObj = JSON.parse(JSON.stringify(parcelJsonObj))
    createParcelList()
  }
  // gauge字符拼接
  const gaugeJoint = (item: any) => {
    const { length, width, height, volume, weight } = item
    if (length && width && height) {
      return length + `cm*` + width + `cm*` + height + `cm / ` + volume + `m³ / ` + weight + `kg`
    } else {
      return volume + `m³ / ` + weight + `kg`
    }
  }
  // 商品列表包裹信息修改数量
  const changeParcelCount = (row: any) => {
    createParcelList()
  }
  // 创建包裹列表
  const createParcelList = async () => {
    // 筛选出的所有包裹信息
    let allParcelJsonObj: any = []
    quoteOrderItemList.value.forEach((item: any) => {
      if (item.parcelJsonObj) {
        allParcelJsonObj = [...allParcelJsonObj, ...item.parcelJsonObj]
      }
    })
    const result = allParcelJsonObj.every((e: any) => e.count <= 0)
    if (result) {
      quoteOrderParcelList.value = []
      return false
    }

    // 根据筛选出的所有包裹信息生成包裹列表并且数量累加
    const newPackage: any = []
    const temp: any = {}
    for (const i in allParcelJsonObj) {
      const key = allParcelJsonObj[i].parcelName
      // 从包裹信息中获取字段
      if (temp[key]) {
        temp[key].parcelName = temp[key].parcelName
        temp[key].count = NP.plus(temp[key].count, allParcelJsonObj[i].count)
      } else {
        temp[key] = {}
        temp[key].parcelName = allParcelJsonObj[i].parcelName
        temp[key].count = allParcelJsonObj[i].count
      }
      temp[key].length = allParcelJsonObj[i].length
      temp[key].width = allParcelJsonObj[i].width
      temp[key].height = allParcelJsonObj[i].height
      temp[key].volume = allParcelJsonObj[i].volume
      temp[key].weight = allParcelJsonObj[i].weight
      temp[key].id = allParcelJsonObj[i].id
      temp[key].gauge = gaugeJoint(allParcelJsonObj[i])
      temp[key].itemJsonObj = []
      // 自定义生成字段
      temp[key].internationalShippingFeeLand = 0
      temp[key].internationalShippingFeeOcean = 0
      temp[key].itemType = 'NORMAL'
      temp[key].lastShippingFee = 0
      temp[key].localShippingFeeLand = 0
      temp[key].localShippingFeeOcean = 0
      temp[key].transferFeeLand = 0
      temp[key].transferFeeOcean = 0
      temp[key].serviceFee = 0
    }
    for (const k in temp) {
      newPackage.push(temp[k])
    }
    // console.log('newPackage', newPackage)

    // 包裹列表所包含的商品
    console.log('allParcelJsonObj', allParcelJsonObj)
    allParcelJsonObj.forEach((item: any) => {
      newPackage.forEach((el: any) => {
        if (item.parcelName === el.parcelName) {
          const goods: any = []
          const obj: any = {}
          obj.productName = item.productName
          obj.collectionAttribute = item.collectionAttribute
          obj.imageUrl = item.imageUrl
          goods.push(obj)
          el.itemJsonObj = [...goods, ...el.itemJsonObj]
        }
      })
    })

    quoteOrderParcelList.value = newPackage
    // console.log('quoteOrderParcelList', quoteOrderParcelList.value)

    // 任一包裹的重量超过30kg，无法选择ninja
    await parcelWeightLimit()
    await resetData()
    quoteOrderParcelList.value.forEach(async (item: any) => {
      await calcAllFee(item)
    })
  }
  // 任一包裹的重量超过30kg，无法选择ninja
  const parcelWeightLimit = async () => {
    if (detailInfo.lastShippingType === 1) {
      await getLogisticsName(form.logisticsConfigThId)
    }
    quoteOrderParcelList.value.forEach(async (e: any) => {
      if (e.weight > 30 && detailInfo.lastShippingType === 1) {
        form.logisticsConfigTh.forEach((v: any, i: number) => {
          if (v.logisticsName == 'ninja') {
            form.logisticsConfigTh.splice(i, 1)
          }
        })
        form.logisticsConfigThId = undefined
      } else {
        form.logisticsConfigTh = [...baseNumberObj.logisticsConfigTh]
      }
      e.lastShippingFee = 0
    })
  }
  // 数据重置
  const resetData = () => {
    quotationPreviewList.value = []
    form.serviceFee = 0
  }
  // 获取最后一公里物流对应的名称
  const getLogisticsName = (val: number) => {
    const logisticsName = form.logisticsConfigTh
      .filter((item: any) => item.id === val)
      .map((e: any) => e.logisticsName)[0]
    console.log(logisticsName)
    form.logisticsName = logisticsName
  }
  // 选择最后一公里
  const selectLogisticsConfigTh = async (val: number) => {
    await getLogisticsName(val)
    await quoteOrderParcelList.value.forEach((item: any) => {
      if (val === 1) {
        calcLastShippingFee(item)
      }
      if (val === 2) {
        item.lastShippingFee = undefined
      }
      if (val === 3) {
        calcLastShippingFeeLogistics(item)
      }
    })
    await quotationPreview()
  }
  // 批量填写操作
  const batchOperationFn = async (val: number, type: string) => {
    await quoteOrderItemList.value.forEach((item: any) => {
      item[type] = val
      if (type === 'purchaseFeeCny') {
        changePurchaseFeeCny(item)
      } else if (type === 'shippingFeeCny') {
        changeShippingFeeCny(item)
      } else if (type === 'purchaseCount') {
        quotationPreview()
      }
    })
  }
  // 输入采购单价, 计算采购单价
  const changePurchaseFeeCny = async (row: any) => {
    if (row.purchaseFeeCny) {
      // (采购单价 * 汇率)保留两位小数并四舍五入
      row.purchaseFee = NP.round(NP.times(row.purchaseFeeCny, detailInfo.rate), 2)
      console.log('输入采购单价', row.purchaseFee)
      await quotationPreview()
    }
  }
  // 输入采购数量
  const changePurchaseCount = async (row: any) => {
    if (row.purchaseCount) {
      await quotationPreview()
    }
  }
  // 输入中国境内运费
  const changeShippingFeeCny = async (row: any) => {
    if (row.shippingFeeCny) {
      // (中国境内运费 * 汇率)保留两位小数并四舍五入
      row.shippingFee = NP.round(NP.times(row.shippingFeeCny, detailInfo.rate), 2)
      console.log('输入中国境内运费', row.shippingFee)
      await quotationPreview()
    }
  }
  // 输入服务费
  const changeServiceFee = async (val: number) => {
    if (val) {
      await quotationPreview()
    }
  }
  // 输入金额
  const changeMoney = async (val: number) => {
    if (val) {
      await quotationPreview()
    }
  }
  // 选择货物类型
  const changeItemType = async (val: string, index: number) => {
    await calcAllFee(quoteOrderParcelList.value[index])
  }
  // 选择物流方式
  const changeCheckbox = async (arr: string[]) => {
    quoteOrderParcelList.value.forEach(async (item: any) => {
      await calcAllFee(item)
    })
  }
  // 计算国际物流
  const calcInternationalShipping = (row: any) => {
    if (row.volume && row.weight && row.itemType && row.count && form.checkList?.length > 0) {
      const goodsType = baseNumberObj.internationalShippingFeeConfigMap
      form.checkList.forEach((item: any) => {
        if (item === 'land_fast') {
          const freightObj = goodsType['land_fast'].filter(
            (e: any) => e.itemType === row.itemType
          )[0]
          const price = PackageFee.calcInternationalShippingFn(
            row.volume,
            row.weight,
            row.count,
            freightObj
          )
          row.internationalShippingFeeLand = NP.times(price, row.count)
          console.log('计算国际物流陆运', row.internationalShippingFeeLand)
        }
        if (item === 'ocean') {
          const freightObj = goodsType['ocean'].filter((e: any) => e.itemType === row.itemType)[0]
          const price = PackageFee.calcInternationalShippingFn(
            row.volume,
            row.weight,
            row.count,
            freightObj
          )
          row.internationalShippingFeeOcean = NP.times(price, row.count)
          console.log('计算国际物流海运', row.internationalShippingFeeOcean)
        }
      })
    }
  }
  // 计算尾程物流
  const calcLocalShippingFee = (row: any) => {
    const { localShippingFeeBase } = baseNumberObj
    const price = PackageFee.calcLocalShippingFeeFn(row.volume, localShippingFeeBase)
    if (form.checkList.includes('land_fast')) {
      row.localShippingFeeLand = NP.times(price, row.count)
    }
    if (form.checkList.includes('ocean')) {
      row.localShippingFeeOcean = NP.times(price, row.count)
    }
    console.log('计算尾程物流', NP.times(price, row.count))
  }
  // 计算最后一公里(ninja)
  const calcLastShippingFee = (row: any) => {
    if (
      row.count > 0 &&
      row.weight > 0 &&
      form.logisticsConfigThId &&
      form.logisticsName === 'ninja'
    ) {
      const { lastShippingType, addressInfo } = detailInfo
      const { logisticsPriceConfigTh } = baseNumberObj
      if (lastShippingType === 1 && addressInfo[0].cityThId) {
        const totalWeight = row.weight
        // 获取基准值对应的区间
        const logisticsPriceConfigThFilter = logisticsPriceConfigTh.filter(
          (e: any) => e.logisticsConfigThId === form.logisticsConfigThId
        )
        const target = logisticsPriceConfigThFilter.find((condition: any) => {
          const { max, min } = condition
          return totalWeight > min && totalWeight <= max
        })
        console.log(target)
        row.lastShippingFee = NP.times(target.price, row.count)
        console.log('计算最后一公里(ninja)', row.lastShippingFee)
      } else {
        return 0
      }
    }
  }
  // 计算最后一公里(物流)
  const calcLastShippingFeeLogistics = (row: any) => {
    if (
      row.count > 0 &&
      row.weight > 0 &&
      form.logisticsConfigThId &&
      form.logisticsName === '物流'
    ) {
      const { lastShippingType, addressInfo } = detailInfo
      const { lastShippingFeeBase } = baseNumberObj
      if (lastShippingType === 1 && addressInfo[0].cityThId) {
        row.lastShippingFee = NP.times(row.count, lastShippingFeeBase)
        console.log('计算最后一公里(物流)', row.lastShippingFee)
      } else {
        return 0
      }
    }
  }
  // 计算中转物流
  // 每条包裹的 weight重量判断在 min ~ max之间，
  // cubicPerPrice * volume + basePrice + continuedWeightPrice * (weight - 1 向上取整)
  const calcTransferFee = (row: any) => {
    const { transferShippingFeeConfig } = baseNumberObj
    const target = transferShippingFeeConfig.find((condition: any) => {
      const { max, min } = condition
      return row.weight > min && row.weight <= max
    })
    console.log(target)
    const { cubicPerPrice, basePrice, continuedWeightPrice } = target
    const weight = Math.ceil(NP.minus(row.weight, 1))
    const num = weight <= 0 ? 0 : weight
    const price = NP.times(
      NP.plus(
        NP.plus(NP.times(cubicPerPrice, row.volume), basePrice),
        NP.times(continuedWeightPrice, num)
      ),
      row.count
    )
    if (form.checkList.includes('land_fast')) {
      row.transferFeeLand = price
    }
    if (form.checkList.includes('ocean')) {
      row.transferFeeOcean = price
    }
    console.log('计算中转物流', price)
  }
  // 计算服务费
  const calcServiceFee = (row: any) => {
    if (row.volume && row.weight && row.itemType && row.count && form.checkList?.length > 0) {
      const { priceConfigServiceRuleVo: conditionJson, serviceBubbleRate } = baseNumberObj
      const serviceFee = PackageFee.calcServiceFeeFn(row, conditionJson, serviceBubbleRate)
      row.serviceFee = serviceFee === Infinity ? 0 : serviceFee
      // console.log('计算服务费', row.serviceFee)
      form.serviceFee = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
        return NP.round(NP.plus(prev, NP.times(cur.serviceFee, cur.count)), 2)
      }, 0)
      console.log('计算服务费', form.serviceFee)
    }
  }
  // 所有费用计算
  const calcAllFee = async (item: any) => {
    console.log('所有费用计算', item)
    await calcInternationalShipping(item)
    await calcLocalShippingFee(item)
    await calcLastShippingFee(item)
    await calcTransferFee(item)
    await calcServiceFee(item)
    await quotationPreview()
  }
  // 报价预览列表计算
  const quotationPreview = () => {
    if (
      detailInfo.type !== 'A1' &&
      (quoteOrderItemList.value?.length <= 0 || quoteOrderParcelList.value?.length <= 0)
    ) {
      return false
    }

    const { taxRate, defaultGrossRate } = baseNumberObj // 增值税，毛利率

    // 采购费用
    form.purchaseFee = quoteOrderItemList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, NP.times(cur.purchaseFee, cur.purchaseCount)), 2)
    }, 0)
    console.log('采购费用', form.purchaseFee)

    // 中国境内运费
    form.shippingFee = quoteOrderItemList.value.reduce((prev: number, cur: any) => {
      return NP.plus(prev, cur.shippingFee)
    }, 0)
    console.log('中国境内运费', form.shippingFee)

    // 服务费
    console.log('服务费', form.serviceFee)

    // 最后一公里
    form.lastShippingFee = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, cur.lastShippingFee === undefined ? 0 : cur.lastShippingFee), 2)
    }, 0)
    console.log('最后一公里', form.lastShippingFee)

    // 中转物流(陆运)
    form.transferFeeLand = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, cur.transferFeeLand), 2)
    }, 0)
    console.log('中转物流(陆运)', form.transferFeeLand)

    // 中转物流(海运)
    form.transferFeeOcean = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, cur.transferFeeOcean), 2)
    }, 0)
    console.log('中转物流(海运)', form.transferFeeOcean)

    // 国际物流(陆运)
    form.internationalShippingFeeLand = quoteOrderParcelList.value.reduce(
      (prev: number, cur: any) => {
        return NP.round(NP.plus(prev, cur.internationalShippingFeeLand), 2)
      },
      0
    )
    console.log('国际物流(陆运)', form.internationalShippingFeeLand)

    // 国际物流(海运)
    form.internationalShippingFeeOcean = quoteOrderParcelList.value.reduce(
      (prev: number, cur: any) => {
        return NP.round(NP.plus(prev, cur.internationalShippingFeeOcean), 2)
      },
      0
    )
    console.log('国际物流(海运)', form.internationalShippingFeeOcean)

    // 尾程物流(陆运)
    form.localShippingFeeLand = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, cur.localShippingFeeLand), 2)
    }, 0)
    console.log('尾程物流(陆运)', form.localShippingFeeLand)

    // 尾程物流(海运)
    form.localShippingFeeOcean = quoteOrderParcelList.value.reduce((prev: number, cur: any) => {
      return NP.round(NP.plus(prev, cur.localShippingFeeOcean), 2)
    }, 0)
    console.log('尾程物流(海运)', form.localShippingFeeOcean)

    // 增值税(陆运)
    form.taxFeeLand = NP.round(
      NP.times(
        NP.plus(
          form.purchaseFee,
          form.shippingFee,
          form.serviceFee,
          form.lastShippingFee,
          form.transferFeeLand,
          form.internationalShippingFeeLand,
          form.localShippingFeeLand
        ),
        taxRate
      ),
      2
    )
    console.log('增值税(陆运)', form.taxFeeLand)

    // 增值税(海运)
    form.taxFeeOcean = NP.round(
      NP.times(
        NP.plus(
          form.purchaseFee,
          form.shippingFee,
          form.serviceFee,
          form.lastShippingFee,
          form.transferFeeOcean,
          form.internationalShippingFeeOcean,
          form.localShippingFeeOcean
        ),
        taxRate
      ),
      2
    )
    console.log('增值税(海运)', form.taxFeeOcean)

    // 陆运费用总额
    form.totalPriceLand = NP.round(
      NP.plus(
        form.purchaseFee,
        form.shippingFee,
        form.serviceFee,
        form.lastShippingFee,
        form.transferFeeLand,
        form.internationalShippingFeeLand,
        form.localShippingFeeLand,
        form.taxFeeLand
      ),
      2
    )
    console.log('陆运费用总额', form.totalPriceLand)

    // 海运费用总额
    form.totalPriceOcean = NP.round(
      NP.plus(
        form.purchaseFee,
        form.shippingFee,
        form.serviceFee,
        form.lastShippingFee,
        form.transferFeeOcean,
        form.internationalShippingFeeOcean,
        form.localShippingFeeOcean,
        form.taxFeeOcean
      ),
      2
    )
    console.log('海运费用总额', form.totalPriceOcean)

    // 成本价
    const costObj: any = {
      costItem: '成本价',
      purchaseFee: form.purchaseFee,
      shippingFee: form.shippingFee,
      serviceFee: form.serviceFee,
      transferFeeLand: form.transferFeeLand,
      transferFeeOcean: form.transferFeeOcean,
      internationalShippingFeeLand: form.internationalShippingFeeLand,
      internationalShippingFeeOcean: form.internationalShippingFeeOcean,
      localShippingFeeLand: form.localShippingFeeLand,
      localShippingFeeOcean: form.localShippingFeeOcean,
      lastShippingFee: form.lastShippingFee,
      taxFeeLand: form.taxFeeLand,
      taxFeeOcean: form.taxFeeOcean,
      totalPriceOcean: form.totalPriceOcean,
      totalPriceLand: form.totalPriceLand
    }
    // 销售指导价
    form.guidePurchaseFee = NP.round(
      ProfitFee.saleTotalPrice(form.purchaseFee, defaultGrossRate),
      2
    )
    form.guideShippingFee = NP.round(
      ProfitFee.saleTotalPrice(form.shippingFee, defaultGrossRate),
      2
    )
    form.guideServiceFee = NP.round(ProfitFee.saleTotalPrice(form.serviceFee, defaultGrossRate), 2)
    form.guideTransferFeeLand = NP.round(
      ProfitFee.saleTotalPrice(form.transferFeeLand, defaultGrossRate),
      2
    )
    form.guideTransferFeeOcean = NP.round(
      ProfitFee.saleTotalPrice(form.transferFeeOcean, defaultGrossRate),
      2
    )
    form.guideInternationalShippingFeeLand = NP.round(
      ProfitFee.saleTotalPrice(form.internationalShippingFeeLand, defaultGrossRate),
      2
    )
    form.guideInternationalShippingFeeOcean = NP.round(
      ProfitFee.saleTotalPrice(form.internationalShippingFeeOcean, defaultGrossRate),
      2
    )
    form.guideLocalShippingFeeLand = NP.round(
      ProfitFee.saleTotalPrice(form.localShippingFeeLand, defaultGrossRate),
      2
    )
    form.guideLocalShippingFeeOcean = NP.round(
      ProfitFee.saleTotalPrice(form.localShippingFeeOcean, defaultGrossRate),
      2
    )
    form.guideLastShippingFee = NP.round(
      ProfitFee.saleTotalPrice(form.lastShippingFee, defaultGrossRate),
      2
    )
    form.guideTaxFeeLand = NP.round(ProfitFee.saleTotalPrice(form.taxFeeLand, defaultGrossRate), 2)
    form.guideTaxFeeOcean = NP.round(
      ProfitFee.saleTotalPrice(form.taxFeeOcean, defaultGrossRate),
      2
    )
    form.guideTotalPriceOcean = NP.round(
      NP.plus(
        form.guidePurchaseFee,
        form.guideShippingFee,
        form.guideServiceFee,
        form.guideTransferFeeOcean,
        form.guideInternationalShippingFeeOcean,
        form.guideLocalShippingFeeOcean,
        form.guideLastShippingFee,
        form.guideTaxFeeOcean
      ),
      2
    )
    form.guideTotalPriceLand = NP.round(
      NP.plus(
        form.guidePurchaseFee,
        form.guideShippingFee,
        form.guideServiceFee,
        form.guideTransferFeeLand,
        form.guideInternationalShippingFeeLand,
        form.guideLocalShippingFeeLand,
        form.guideLastShippingFee,
        form.guideTaxFeeLand
      ),
      2
    )

    const guideObj: any = {
      costItem: '销售指导价',
      purchaseFee: form.guidePurchaseFee,
      shippingFee: form.guideShippingFee,
      serviceFee: form.guideServiceFee,
      transferFeeLand: form.guideTransferFeeLand,
      transferFeeOcean: form.guideTransferFeeOcean,
      internationalShippingFeeLand: form.guideInternationalShippingFeeLand,
      internationalShippingFeeOcean: form.guideInternationalShippingFeeOcean,
      localShippingFeeLand: form.guideLocalShippingFeeLand,
      localShippingFeeOcean: form.guideLocalShippingFeeOcean,
      lastShippingFee: form.guideLastShippingFee,
      taxFeeLand: form.guideTaxFeeLand,
      taxFeeOcean: form.guideTaxFeeOcean,
      totalPriceOcean: form.guideTotalPriceOcean,
      totalPriceLand: form.guideTotalPriceLand
    }

    // 销售价
    form.salesPurchaseFee = NP.round(form.guidePurchaseFee, 2)
    form.salesShippingFee = NP.round(form.guideShippingFee, 2)
    form.salesServiceFee = NP.round(form.guideServiceFee, 2)
    form.salesTransferFeeLand = NP.round(form.guideTransferFeeLand, 2)
    form.salesTransferFeeOcean = NP.round(form.guideTransferFeeOcean, 2)
    form.salesInternationalShippingFeeLand = NP.round(form.guideInternationalShippingFeeLand, 2)
    form.salesInternationalShippingFeeOcean = NP.round(form.guideInternationalShippingFeeOcean, 2)
    form.salesLocalShippingFeeLand = NP.round(form.guideLocalShippingFeeLand, 2)
    form.salesLocalShippingFeeOcean = NP.round(form.guideLocalShippingFeeOcean, 2)
    form.salesLastShippingFee = NP.round(form.guideLastShippingFee, 2)
    form.salesTaxFeeLand = NP.round(form.guideTaxFeeLand, 2)
    form.salesTaxFeeOcean = NP.round(form.guideTaxFeeOcean, 2)
    form.salesTotalPriceOcean = NP.round(form.guideTotalPriceOcean, 2)
    form.salesTotalPriceLand = NP.round(form.guideTotalPriceLand, 2)
    const salesObj: any = {
      costItem: '销售价',
      purchaseFee: form.salesPurchaseFee,
      shippingFee: form.salesShippingFee,
      serviceFee: form.salesServiceFee,
      transferFeeLand: form.salesTransferFeeLand,
      transferFeeOcean: form.salesTransferFeeOcean,
      internationalShippingFeeLand: form.salesInternationalShippingFeeLand,
      internationalShippingFeeOcean: form.salesInternationalShippingFeeOcean,
      localShippingFeeLand: form.salesLocalShippingFeeLand,
      localShippingFeeOcean: form.salesLocalShippingFeeOcean,
      lastShippingFee: form.salesLastShippingFee,
      taxFeeLand: form.salesTaxFeeLand,
      taxFeeOcean: form.salesTaxFeeOcean,
      totalPriceOcean: form.salesTotalPriceOcean,
      totalPriceLand: form.salesTotalPriceLand
    }

    // 展示价格
    const obj = {
      purchaseFee: form.salesPurchaseFee,
      shippingFee: form.salesShippingFee,
      transferFeeLand: form.salesTransferFeeLand,
      internationalShippingFeeLand: form.salesInternationalShippingFeeLand,
      localShippingFeeLand: form.salesLocalShippingFeeLand,
      taxFeeLand: form.salesTaxFeeLand,
      serviceFee: form.salesServiceFee,
      transferFeeOcean: form.salesTransferFeeOcean,
      internationalShippingFeeOcean: form.salesInternationalShippingFeeOcean,
      localShippingFeeOcean: form.salesLocalShippingFeeOcean,
      taxFeeOcean: form.salesTaxFeeOcean,
      lastShippingFee: form.salesLastShippingFee
    }
    const showObj = calcShowPrice(obj)
    quotationPreviewList.value[0] = costObj
    quotationPreviewList.value[1] = guideObj
    quotationPreviewList.value[2] = salesObj
    quotationPreviewList.value[3] = showObj
  }

  // 报价预览回显，不计算
  const showQuotationPreview = (data: any) => {
    // 成本价
    const costObj: any = {
      costItem: '成本价',
      purchaseFee: data.purchaseFee,
      shippingFee: data.shippingFee,
      serviceFee: data.serviceFee,
      transferFeeLand: data.transferFeeLand,
      transferFeeOcean: data.transferFeeOcean,
      internationalShippingFeeLand: data.internationalShippingFeeLand,
      internationalShippingFeeOcean: data.internationalShippingFeeOcean,
      localShippingFeeLand: data.localShippingFeeLand,
      localShippingFeeOcean: data.localShippingFeeOcean,
      lastShippingFee: data.lastShippingFee,
      taxFeeLand: data.taxFeeLand,
      taxFeeOcean: data.taxFeeOcean,
      totalPriceOcean: data.totalPriceOcean,
      totalPriceLand: data.totalPriceLand
    }
    const guideObj: any = {
      costItem: '销售指导价',
      purchaseFee: data.guidePurchaseFee,
      shippingFee: data.guideShippingFee,
      serviceFee: data.guideServiceFee,
      transferFeeLand: data.guideTransferFeeLand,
      transferFeeOcean: data.guideTransferFeeOcean,
      internationalShippingFeeLand: data.guideInternationalShippingFeeLand,
      internationalShippingFeeOcean: data.guideInternationalShippingFeeOcean,
      localShippingFeeLand: data.guideLocalShippingFeeLand,
      localShippingFeeOcean: data.guideLocalShippingFeeOcean,
      lastShippingFee: data.guideLastShippingFee,
      taxFeeLand: data.guideTaxFeeLand,
      taxFeeOcean: data.guideTaxFeeOcean,
      totalPriceOcean: data.guideTotalPriceOcean,
      totalPriceLand: data.guideTotalPriceLand
    }
    const salesObj: any = {
      costItem: '销售价',
      purchaseFee: data.salesPurchaseFee,
      shippingFee: data.salesShippingFee,
      serviceFee: data.salesServiceFee,
      transferFeeLand: data.salesTransferFeeLand,
      transferFeeOcean: data.salesTransferFeeOcean,
      internationalShippingFeeLand: data.salesInternationalShippingFeeLand,
      internationalShippingFeeOcean: data.salesInternationalShippingFeeOcean,
      localShippingFeeLand: data.salesLocalShippingFeeLand,
      localShippingFeeOcean: data.salesLocalShippingFeeOcean,
      lastShippingFee: data.salesLastShippingFee,
      taxFeeLand: data.salesTaxFeeLand,
      taxFeeOcean: data.salesTaxFeeOcean,
      totalPriceOcean: data.salesTotalPriceOcean,
      totalPriceLand: data.salesTotalPriceLand
    }
    const showObj: any = {
      costItem: '展示价格',
      purchaseFee: data.showPurchaseFee,
      shippingFee: '-',
      serviceFee: '-',
      transferFeeLand: '-',
      transferFeeOcean: '-',
      internationalShippingFeeLand: data.showInternationalShippingFeeLand,
      internationalShippingFeeOcean: data.showInternationalShippingFeeOcean,
      localShippingFeeLand: '-',
      localShippingFeeOcean: '-',
      lastShippingFee: data.showLastShippingFee,
      taxFeeLand: '-',
      taxFeeOcean: '-',
      totalPriceOcean: data.showTotalPriceOcean,
      totalPriceLand: data.showTotalPriceLand
    }
    quotationPreviewList.value[0] = costObj
    quotationPreviewList.value[1] = guideObj
    quotationPreviewList.value[2] = salesObj
    quotationPreviewList.value[3] = showObj
    console.log('报价预览回显，不计算', quotationPreviewList.value)
  }

  // 打开毛利率组件
  const handleGrossRete = () => {
    const priceData = [
      {
        label: '采购费用',
        costPrice: form.purchaseFee || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '中国境内运费',
        costPrice: form.shippingFee || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '服务费',
        costPrice: form.serviceFee || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '最后一公里',
        costPrice: form.lastShippingFee || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '海运',
        subLabel: '中转物流',
        costPrice: form.transferFeeOcean || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '海运',
        subLabel: '国际物流',
        costPrice: form.internationalShippingFeeOcean || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '海运',
        subLabel: '尾程物流',
        costPrice: form.localShippingFeeOcean || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '海运',
        subLabel: '增值税',
        costPrice: form.taxFeeOcean || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '陆运',
        subLabel: '中转物流',
        costPrice: form.transferFeeLand || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '陆运',
        subLabel: '国际物流',
        costPrice: form.internationalShippingFeeLand || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '陆运',
        subLabel: '尾程物流',
        costPrice: form.localShippingFeeLand || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '陆运',
        subLabel: '增值税',
        costPrice: form.taxFeeLand || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '海运',
        subLabel: '费用总额',
        costPrice: form.totalPriceOcean || 0,
        salePrice: 0,
        showPrice: '-'
      },
      {
        label: '陆运',
        subLabel: '费用总额',
        costPrice: form.totalPriceLand || 0,
        salePrice: 0,
        showPrice: '-'
      }
    ]
    const { defaultTaxRate, defaultGrossRate } = detailInfo // 报价单详情 -> 增值税，毛利率
    console.log(detailInfo)
    console.log(defaultTaxRate)
    console.log(defaultGrossRate)
    PriceRef.value?.handleOpen({ defaultTaxRate, defaultGrossRate }, priceData)
  }

  // 修改毛利率后重新赋值销售价
  const handleSubmitGrossRete = async (datas: any) => {
    console.log(datas)
    const { data } = datas
    grossRete.value = NP.divide(datas.defaultGrossRate, 100)
    const guideObj: any = {
      costItem: '销售指导价',
      purchaseFee: data[0].salePrice,
      shippingFee: data[1].salePrice,
      serviceFee: data[2].salePrice,
      lastShippingFee: data[3].salePrice,
      transferFeeOcean: data[4].salePrice,
      internationalShippingFeeOcean: data[5].salePrice,
      localShippingFeeOcean: data[6].salePrice,
      taxFeeOcean: data[7].salePrice,
      transferFeeLand: data[8].salePrice,
      internationalShippingFeeLand: data[9].salePrice,
      localShippingFeeLand: data[10].salePrice,
      taxFeeLand: data[11].salePrice,
      totalPriceOcean: data[12].salePrice,
      totalPriceLand: data[13].salePrice
    }
    const salesObj: any = {
      costItem: '销售价',
      purchaseFee: data[0].salePrice,
      shippingFee: data[1].salePrice,
      serviceFee: data[2].salePrice,
      lastShippingFee: data[3].salePrice,
      transferFeeOcean: data[4].salePrice,
      internationalShippingFeeOcean: data[5].salePrice,
      localShippingFeeOcean: data[6].salePrice,
      taxFeeOcean: data[7].salePrice,
      transferFeeLand: data[8].salePrice,
      internationalShippingFeeLand: data[9].salePrice,
      localShippingFeeLand: data[10].salePrice,
      taxFeeLand: data[11].salePrice,
      totalPriceOcean: data[12].salePrice,
      totalPriceLand: data[13].salePrice
    }
    const showObj: any = {
      purchaseFee: data[0].showPrice,
      internationalShippingFeeOcean: data[5].showPrice,
      internationalShippingFeeLand: data[9].showPrice,
      lastShippingFee: data[3].showPrice,
      totalPriceOcean: data[12].showPrice,
      totalPriceLand: data[13].showPrice
    }
    quotationPreviewList.value[1] = guideObj
    quotationPreviewList.value[2] = salesObj
    quotationPreviewList.value[3] = showObj
  }

  // 修改销售价
  const handleSalesMoney = (row: any) => {
    const showObj = calcShowPrice(row)
    console.log('修改销售价触发-计算展示价', showObj)
    quotationPreviewList.value[2].totalPriceOcean = showObj.totalPriceOcean
    quotationPreviewList.value[2].totalPriceLand = showObj.totalPriceLand
    quotationPreviewList.value[3] = showObj
  }

  // 修改销售价后重新创建报价单
  const handleSubmitSalesMoney = async () => {
    const guide = quotationPreviewList.value[1]
    const sales = quotationPreviewList.value[2]
    const show = quotationPreviewList.value[3]
    console.log('修改毛利率后-获取销售指导价', guide)
    console.log('修改销售价后-获取销售价', sales)
    console.log('修改销售价后-获取展示价', show)
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const params = {
      ...form,
      guidePurchaseFee: guide.purchaseFee,
      guideShippingFee: guide.shippingFee,
      guideServiceFee: guide.serviceFee,
      guideLastShippingFee: guide.lastShippingFee,
      guideTransferFeeOcean: guide.transferFeeOcean,
      guideInternationalShippingFeeOcean: guide.internationalShippingFeeOcean,
      guideLocalShippingFeeOcean: guide.localShippingFeeOcean,
      guideTaxFeeOcean: guide.taxFeeOcean,
      guideTransferFeeLand: guide.transferFeeLand,
      guideInternationalShippingFeeLand: guide.internationalShippingFeeLand,
      guideLocalShippingFeeLand: guide.localShippingFeeLand,
      guideTaxFeeLand: guide.taxFeeLand,
      guideTotalPriceOcean: guide.totalPriceOcean,
      guideTotalPriceLand: guide.totalPriceLand,

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
      rate: detailInfo.rate,
      site: detailInfo.site,
      taxRate: detailInfo.defaultTaxRate,
      createUsername: detailInfo.createUsername,
      currency: detailInfo.currency,
      intentionNo: detailInfo.intentionNo,
      internationalShippingType: detailInfo.internationalShippingTypeList.join(','),
      lastShippingType: detailInfo.lastShippingType,
      isPurchase: detailInfo.isPurchase,
      isInternational: detailInfo.isInternational,
      isSubmit: detailInfo.isSubmit,
      grossRete: grossRete.value || detailInfo.defaultGrossRate,
      priceConfigId: detailInfo.priceConfigId,
      quoteOrderItemList: quoteOrderItemList.value,
      quoteOrderParcelList: quoteOrderParcelList.value
    }
    console.log(params)
    try {
      const { data } = await quoteSubmit(params)
      if (data.resp_code === 0) {
        ElMessage.success('提交成功')
        loading.close()
        const pathname = window.location.pathname
        store.setPageBackState(true)
        if (pathname.includes('quoteList')) {
          window.location.href = import.meta.env.VITE_SERVICE_URL + '/quotationManages/quoteList'
        } else {
          window.location.href =
            import.meta.env.VITE_SERVICE_URL + '/quotationManages/demandManageList'
        }
      } else {
        loading.close()
      }
    } catch (error: any) {
      new Error(error)
      loading.close()
    }
  }

  // 展示价格单独计算
  const calcShowPrice = (obj: any) => {
    const {
      purchaseFee,
      shippingFee,
      transferFeeLand,
      internationalShippingFeeLand,
      localShippingFeeLand,
      taxFeeLand,
      serviceFee,
      transferFeeOcean,
      internationalShippingFeeOcean,
      localShippingFeeOcean,
      taxFeeOcean,
      lastShippingFee
    } = obj
    form.showPurchaseFee = NP.round(ProfitFee.showPurchaseFee(purchaseFee, shippingFee), 2)
    form.showInternationalShippingFeeLand = NP.round(
      ProfitFee.showInternationalFee(
        transferFeeLand || 0,
        internationalShippingFeeLand || 0,
        localShippingFeeLand || 0,
        taxFeeLand || 0,
        serviceFee || 0
      ),
      2
    )
    form.showInternationalShippingFeeOcean = NP.round(
      ProfitFee.showInternationalFee(
        transferFeeOcean || 0,
        internationalShippingFeeOcean || 0,
        localShippingFeeOcean || 0,
        taxFeeOcean || 0,
        serviceFee || 0
      ),
      2
    )
    form.showLastShippingFee = lastShippingFee || 0
    form.showTotalPriceOcean = NP.round(
      NP.plus(
        form.showPurchaseFee,
        form.showInternationalShippingFeeOcean,
        form.showLastShippingFee
      ),
      2
    )
    form.showTotalPriceLand = NP.round(
      NP.plus(
        form.showPurchaseFee,
        form.showInternationalShippingFeeLand,
        form.showLastShippingFee
      ),
      2
    )
    const showObj: any = {
      costItem: '展示价格',
      purchaseFee: form.showPurchaseFee,
      shippingFee: '-',
      serviceFee: '-',
      transferFeeLand: '-',
      transferFeeOcean: '-',
      internationalShippingFeeLand: form.showInternationalShippingFeeLand,
      internationalShippingFeeOcean: form.showInternationalShippingFeeOcean,
      localShippingFeeLand: '-',
      localShippingFeeOcean: '-',
      lastShippingFee: form.showLastShippingFee,
      taxFeeLand: '-',
      taxFeeOcean: '-',
      totalPriceOcean: form.showTotalPriceOcean,
      totalPriceLand: form.showTotalPriceLand
    }
    return showObj
  }

  return {
    form,
    quoteOrderItemList,
    quoteOrderParcelList,
    AddProductRef,
    PackageRef,
    initParcelFormRef,
    setInitParcelRules,
    baseNumberObj,
    detailInfo,
    quotationPreviewList,
    formRules,
    PriceRef,
    isShowParcelOptions,
    delProduct,
    add,
    handleAddProduct,
    calcVolume,
    changeVolume,
    batchCalcWeight,
    setInitParcel,
    setting,
    handleSubmitPackage,
    parcelSelected,
    changeParcelCount,
    selectLogisticsConfigTh,
    batchOperationFn,
    changeItemType,
    changeCheckbox,
    changePurchaseFeeCny,
    changePurchaseCount,
    changeShippingFeeCny,
    changeServiceFee,
    changeMoney,
    quotationPreview,
    showQuotationPreview,
    handleGrossRete,
    handleSubmitGrossRete,
    handleSalesMoney,
    handleSubmitSalesMoney,
    parcelChick,
    valiNumberPass1,
    valiNumberPass2
  }
}
