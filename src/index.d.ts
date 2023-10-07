declare interface DataObj {
  [key: string]: string | number | boolean | any[] | Data
}
declare interface OptionItemObj {
  [key: string | number]: string | number
}
declare interface OptionItem {
  label: string
  name: string
  value: string | number | boolean
}
declare interface PageInfo {
  pageNo: number
  pageSize: number
  total: number
}
declare interface CreateNoEmptyRules {
  [propName: string]: any
}
declare interface SearchTypes {
  [key: string]: {
    // key 为绑定值
    placeholder?: string // 时间选择器可不传
    type: 'string' | 'date' | 'select' // 数据类型
    label: string // 搜索项名称
    options?: OptionItem[]
  }
}
declare interface DemandDetailsInfo {
  internationalShippingType: any[]
  addressInfo: any[]
  itemList: any[]
  operationLog: any[]
  quoteList: any[]
  [propName: string]: any
}
