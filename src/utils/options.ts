// 创建选择项
export const createOptions = (obj: OptionItemObj) => {
  const keys = Object.keys(obj)
  const result: OptionItem[] = []
  keys.forEach((key) => {
    result.push({
      label: key,
      name: key,
      value: obj[key]
    })
  })
  return result
}

// 键值转换
export const valueToLabel = (value: string | number, list: OptionItem[]) => {
  const target = list.find((item) => item.value === value)
  return target && target.name && target.label
}

// 创建判空规则
export const createNoEmptyRules = (keys: string[]) => {
  const rules: CreateNoEmptyRules = {}
  keys.forEach((key) => {
    rules[key] = [{ required: true, message: '', trigger: 'blur' }]
  })
  return rules
}

// 重置数据
export const resetData = (data: DataObj) => {
  const keys = Object.keys(data)
  keys.forEach((key) => {
    if (typeof data[key] === 'string') data[key] = ''
    if (typeof data[key] === 'number') data[key] = ''
    if (typeof data[key] === 'boolean' && key !== 'hasLast') data[key] = false
    if (Array.isArray(data[key])) data[key] = []
    if (Object.prototype.toString.call(data[key]) === '[object Object]') data[key] = {}
  })
}

// 需求状态：0=待补充 1=等待报价 2=报价中 3=已报价 4=驳回
export const statusListFn = () =>
  createOptions({
    ['待补充']: 0,
    ['待确认']: 1,
    ['报价中']: 2,
    ['已报价']: 3,
    ['已驳回']: 4
  })
// 报价单状态 0=待报价 1=已报价 2=已失效
export const quoteStatusListFn = () =>
  createOptions({
    ['待报价']: 0,
    ['生效中']: 1,
    ['已失效']: 2
  })
// 货币单位
export const currencyListFn = () =>
  createOptions({
    CNY: 'CNY',
    THB: 'THB'
  })
// 国际运输方式
export const internationalShippingTypeListFn = () =>
  createOptions({
    ['陆运']: 'land_fast',
    ['海运']: 'ocean',
    ['空运']: 'sky'
  })
// 货物类型
export const itemTypeListFn = () =>
  createOptions({
    ['普货']: 'NORMAL',
    ['特货']: 'SPECIAL',
    ['敏货']: 'SENSITIVE'
  })
// 订单类型
export const orderTypeListFn = () =>
  createOptions({
    ['跨境销售']: 'ABOARD_SALE',
    ['日常采购']: 'ABOARD_WAREHOUSE_REPLENISHMENT'
  })
// 仓库类型
export const warehouseTypeListFn = () =>
  createOptions({
    ['仓库代理']: 0,
    ['自选地址']: 1
  })
// 提货方式
export const deliveryMethodFn = () =>
  createOptions({
    ['送货上门']: 1,
    ['自行提货']: 2,
    ['存放仓库']: 0
  })
// 需求类型
export const requirementTypeFn = () =>
  createOptions({
    ['跨境采购']: 'A1',
    ['日常采购']: 'A4/A6'
  })
// 收费模式
export const chargeModeFn = () =>
  createOptions({
    ['按报价收费']: 1,
    ['按实际体积收费']: 0
  })
export function serviceTypeFilter(data: string) {
  switch (data) {
    case 'A1':
      return '跨境采购'
    case 'A2':
      return '销售退货'
    case 'A3':
      return '赠品发货'
    case 'A4':
      return '日常采购'
    case 'A5':
      return '销售出库'
    case 'A6':
      return '日常采购'
    default:
      return '-'
  }
}
