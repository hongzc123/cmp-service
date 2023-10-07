import { ref, type Ref, reactive } from 'vue'
import { getPurchaseIntentionDetail, quoteOrderDetail, getLogisticsConfigTh } from '@/api/quotation'

export const useQuotationDetail = () => {
  const QuotationInfoRef: Ref = ref(null) // 报价信息
  const DemandDetailsRef: Ref = ref(null) // 需求详情
  const QuoteDetailsRef: Ref = ref(null) // 报价单详情
  // 需求详情
  const demandDetailInfo: DemandDetailsInfo = reactive({
    internationalShippingType: [], // 国际物流运输方式(用于需求信息组件)
    addressInfo: [], // 地址信息
    itemList: [], // 商品列表
    operationLog: [], // 操作日志
    quoteList: [], // 报价历史
    baseNumberObj: {}, // 价格配置
    quoteOrderV2: {} // 暂存回显
  })
  // 报价详情
  const quoteDetailsInfo: DemandDetailsInfo = reactive({
    internationalShippingType: [], // 国际物流运输方式(用于需求信息组件)
    addressInfo: [], // 地址信息
    itemList: [], // 商品列表
    operationLog: [], // 操作日志
    quoteList: [], // 报价历史
    logisticsConfigTh: [], //
    internationalShippingTypeList: [] // 国际物流运输方式(用于报价信息组件)
  })

  const demandDetails = async (row: any, isSearch?: boolean) => {
    if (row.intentionNo) {
      const { data } = await getPurchaseIntentionDetail({ intentionNo: row.intentionNo })
      Object.assign(demandDetailInfo, data.datas)
      const jsonData = data.datas.jsonData
      demandDetailInfo.internationalShippingType = jsonData.internationalShippingType
        ? jsonData.internationalShippingType.split(',')
        : []
      demandDetailInfo.addressInfo = [jsonData.address]
      demandDetailInfo.itemList = jsonData.itemList
      demandDetailInfo.operationLog = data.datas.quoteOperationRecordList
      demandDetailInfo.quoteList = data.datas.quoteOrderV2List || []
      demandDetailInfo.baseNumberObj = data.datas.priceConfigVo
      demandDetailInfo.quoteOrderV2 = data.datas.quoteOrderV2
      if (isSearch) {
        QuotationInfoRef.value.init(demandDetailInfo)
      }
    }
  }

  const quoteDetails = async (row: any, isSearch?: boolean) => {
    if (row.id) {
      const { data } = await quoteOrderDetail({ id: row.id })
      const { data: list } = await getLogisticsConfigTh({})
      Object.assign(quoteDetailsInfo, data.datas)
      const jsonData = data.datas.purchaseIntentionDataVo
      const purchaseIntentionDataVo = data.datas.purchaseIntentionDataVo
      quoteDetailsInfo.internationalShippingType = jsonData.internationalShippingType
        ? jsonData.internationalShippingType.split(',')
        : []
      quoteDetailsInfo.internationalShippingTypeList =
        data.datas.internationalShippingType.split(',')
      quoteDetailsInfo.addressInfo = [jsonData.address]
      quoteDetailsInfo.itemList = jsonData.itemList
      quoteDetailsInfo.operationLog = data.datas.quoteOperationRecordList
      quoteDetailsInfo.quoteList = data.datas.quoteOrderV2List || []
      quoteDetailsInfo.quoteCount = purchaseIntentionDataVo.quoteCount
      quoteDetailsInfo.createUsername = purchaseIntentionDataVo.createUsername
      quoteDetailsInfo.username = purchaseIntentionDataVo.username
      quoteDetailsInfo.mobile = purchaseIntentionDataVo.mobile
      quoteDetailsInfo.remark = purchaseIntentionDataVo.remark
      quoteDetailsInfo.logisticsConfigTh = list.datas
      if (isSearch) {
        QuotationInfoRef.value.quoteDetailsInit(quoteDetailsInfo)
      }
    }
  }
  return {
    demandDetails,
    quoteDetails,
    quoteDetailsInfo,
    demandDetailInfo,
    QuotationInfoRef,
    QuoteDetailsRef,
    DemandDetailsRef
  }
}
