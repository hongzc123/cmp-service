import NP from 'number-precision'

/**
 * 毛利计算类
 */
export class ProfitFee {
  /**
   * 成本税前金额=采购费用+国内运费+中转运费+国际运费+尾程运费+最后一公里+服务费
   */
  static costPreTaxPrice(
    purchaseFeee = 0,
    domesticFreight = 0,
    transferFee = 0,
    internationalFreight = 0,
    lastFee = 0,
    lastMileFee = 0,
    serviceFee = 0
  ) {
    return NP.plus(
      purchaseFeee,
      domesticFreight,
      transferFee,
      internationalFreight,
      lastFee,
      lastMileFee,
      serviceFee
    )
  }
  /**
   * 成本增值税=税前金额*税率
   */
  static costTax(preTaxTotalPrice = 0, taxRate = 0) {
    return NP.times(preTaxTotalPrice, taxRate)
  }
  /**
   * 成本总金额=成本税前金额+成本增值税
   */
  static costTotalPrice(preTaxTotalPrice = 0, tax = 0) {
    return NP.plus(preTaxTotalPrice, tax)
  }
  /**
   * 项销售指导价=项成本金额*(1 + 毛利率)
   */
  static saleTotalPrice(price = 0, profitRate = 0) {
    return NP.times(price, NP.plus(1, profitRate))
  }
  /**
   * 展示采购费用=采购销售指导价+国内运费销售指导价
   */
  static showPurchaseFee(purchaseSalePrice = 0, domesticFreightSalePrice = 0) {
    return NP.plus(purchaseSalePrice, domesticFreightSalePrice)
  }
  /**
   * 展示国际物流=销售中转+销售国际+销售尾程+销售增值+销售服务费
   */
  static showInternationalFee(
    transferSalePrice = 0,
    internationalFreightSalePrice = 0,
    lastMileSalePrice = 0,
    lastFeeSalePrice = 0,
    serviceFeeSalePrice = 0
  ) {
    return NP.plus(
      transferSalePrice,
      internationalFreightSalePrice,
      lastMileSalePrice,
      lastFeeSalePrice,
      serviceFeeSalePrice
    )
  }
}

/**
 * 包裹计算类
 */
export class PackageFee {
  /**
   * 国际物流费用计算方式：
   * 实测体积和实重/泡重比的值对比，哪个大取哪个。
   * 实测体积=入库时测量的体积。即：10*10*10/1000000=0.0010
   * 实重/泡重比=入库时测量的重量，即：0.5/450=0.0011，注：450为可配置值
   * 以上示例：按实重/泡重*基数*数量得出该商品的国际运费
   */
  static calcInternationalShippingFn(
    volume: number,
    weight: number,
    count: number,
    freightObj: any
  ) {
    const BUBBLE_RATE = freightObj.bubbleRate
    let maxVal: number = 0
    const x: any = volume
    const y: any = weight / BUBBLE_RATE
    if (parseFloat(x) < parseFloat(y)) {
      // console.log('最大数是：' + y)
      maxVal = y
    } else {
      // console.log('最大数是：' + x)
      maxVal = x
    }
    const price = NP.round(NP.times(maxVal, freightObj.internationalShippingBaseFee), 2)
    return price
  }
  /**
   * 尾程物流费用计算方式：
      尾程物流，按立方，500泰铢×立方数，100元×立方数；
   */
  static calcLocalShippingFeeFn(volume: number, localShippingFeeBase: number) {
    return NP.round(NP.times(volume, localShippingFeeBase), 2)
  }
  /**
   * 服务费
   */
  static calcServiceFeeFn(row: any, conditionJson: any[], bubbleRate: number) {
    const { count, weight, volume } = row
    // 获取基准值对应的区间
    const target = conditionJson.find((condition) => {
      const { volume1, volume2 } = condition.data
      return volume > volume1 && volume <= volume2
    })
    console.log(target)
    if (target) {
      if (target.serviceFee) {
        return NP.round(target.serviceFee, 2)
      }
      console.log(target.formula)
      if (target.formula) {
        const num = target.formula.split('*')[1]
        const shVal = Math.max(volume, NP.round(NP.divide(weight, bubbleRate), 10))
        const formula = target.formula.replace('sh', shVal)
        console.log(num, shVal, formula)
        return NP.round(NP.times(shVal, num), 2)
      }
    }
  }
}
