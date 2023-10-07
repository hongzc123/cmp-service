<template>
  <div class="QuotationInfo tw-relative">
    <div class="desc-header">报价信息</div>
    <div class="desc-title">采购费用</div>
    <!-- 商品列表 -->
    <el-form ref="formRef" :model="form" :rules="formRules">
      <el-table class="table-form" ref="multipleTableRef" :data="quoteOrderItemList" :border="true">
        <el-table-column
          v-if="!detailInfo.directStatus || detailInfo.directStatus !== 1"
          label="操作"
          header-align="center"
          align="center"
          width="80"
        >
          <template #default="scope">
            <el-button type="primary" link @click="delProduct(scope.row)" :disabled="props.disabled"
              >移除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="产品图" header-align="left" align="center" property="imageUrl">
          <template #default="scope">
            <el-image
              v-show="scope.row.imageUrl"
              class="tw-w-[50px] tw-h-[50px]"
              :src="scope.row.imageUrl.split(',')[0]"
              :preview-src-list="[scope.row.imageUrl.split(',')[0]]"
              :initial-index="0"
              fit="cover"
              :z-index="9999"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column
          label="产品名称"
          header-align="left"
          align="left"
          property="productName"
          width="200px"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.productName"
              placeholder="输入产品名称"
              :disabled="props.disabled"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="产品属性"
          header-align="left"
          align="left"
          property="collectionAttribute"
          width="200px"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.collectionAttribute"
              placeholder="输入产品属性"
              :disabled="props.disabled"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="采购链接"
          header-align="left"
          align="left"
          property="purchaseUrl"
          width="250px"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.purchaseUrl"
              placeholder="输入采购链接"
              :readonly="props.disabled"
              :class="{ 'purchase-url': props.disabled }"
              @click="purchaseUrlClick(scope.row.purchaseUrl, props.disabled)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="采购数量"
          header-align="left"
          align="left"
          property="createTime"
          width="150px"
        >
          <template #header>
            <div
              v-if="quoteOrderItemList?.length > 0"
              class="tw-flex tw-items-center tw-justify-center"
            >
              采购数量
              <el-popover placement="top" width="150" trigger="click">
                <template #reference>
                  <el-button link type="primary" size="small" :disabled="props.disabled"
                    >批量</el-button
                  >
                </template>
                <template #default>
                  <div class="tw-flex tw-flex-col tw-items-center">
                    <div class="tw-mr-2">采购数量</div>
                    <el-input-number
                      class="!tw-w-[120px]"
                      v-model="form.batchPurchaseCount"
                      :min="0"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      @change="batchOperationFn(form.batchPurchaseCount, 'purchaseCount')"
                      :disabled="props.disabled"
                    />
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>采购数量</div>
          </template>
          <template #default="scope">
            <el-input-number
              class="!tw-w-[120px]"
              v-model="scope.row.purchaseCount"
              :min="0"
              @change="changePurchaseCount(scope.row)"
              :disabled="props.disabled"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="采购单价"
          header-align="left"
          align="left"
          property="createTime"
          width="150px"
        >
          <template #header>
            <div
              v-if="quoteOrderItemList?.length > 0"
              class="tw-flex tw-items-center tw-justify-center"
            >
              采购单价
              <el-popover placement="top" width="160" trigger="click">
                <template #reference>
                  <el-button link type="primary" size="small" :disabled="props.disabled"
                    >批量</el-button
                  >
                </template>
                <template #default>
                  <div class="tw-flex tw-flex-col tw-items-center">
                    <div class="tw-mr-2 tw-mb-2">采购单价</div>
                    <div class="tw-flex tw-items-center">
                      <div
                        class="tw-bg-[#f5f7fa] tw-self-stretch tw-flex tw-items-center tw-px-2 tw-flex-shrink-0 tw-text-[#909399] tw-border-[#dcdfe6] tw-border tw-border-r-0 tw-rounded-[4px] tw-rounded-r-[0]"
                      >
                        CNY
                      </div>
                      <el-input-number
                        class="!tw-w-[110px] input-number-controls"
                        v-model="form.batchPurchaseFeeCny"
                        placeholder="输入单价"
                        :min="0"
                        :controls="false"
                        @change="batchOperationFn(form.batchPurchaseFeeCny, 'purchaseFeeCny')"
                        :disabled="props.disabled"
                      />
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>采购单价</div>
          </template>
          <template #default="scope">
            <div class="tw-flex tw-items-center">
              <div
                class="tw-bg-[#f5f7fa] tw-self-stretch tw-flex tw-items-center tw-px-2 tw-flex-shrink-0 tw-text-[#909399] tw-border-[#dcdfe6] tw-border tw-border-r-0 tw-rounded-[4px] tw-rounded-r-[0]"
              >
                CNY
              </div>
              <el-input-number
                class="!tw-w-[110px] input-number-controls"
                v-model="scope.row.purchaseFeeCny"
                placeholder="输入单价"
                :min="0"
                :controls="false"
                @change="changePurchaseFeeCny(scope.row)"
                :disabled="props.disabled"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="中国境内运费"
          header-align="left"
          align="left"
          property="createTime"
          width="150px"
        >
          <template #header>
            <div
              v-if="quoteOrderItemList?.length > 0"
              class="tw-flex tw-items-center tw-justify-center"
            >
              中国境内运费
              <el-popover placement="top" width="160" trigger="click">
                <template #reference>
                  <el-button link type="primary" size="small" :disabled="props.disabled"
                    >批量</el-button
                  >
                </template>
                <template #default>
                  <div class="tw-flex tw-flex-col tw-items-center">
                    <div class="tw-mr-2 tw-mb-2">中国境内运费</div>
                    <div class="tw-flex tw-items-center">
                      <div
                        class="tw-bg-[#f5f7fa] tw-self-stretch tw-flex tw-items-center tw-px-2 tw-flex-shrink-0 tw-text-[#909399] tw-border-[#dcdfe6] tw-border tw-border-r-0 tw-rounded-[4px] tw-rounded-r-[0]"
                      >
                        CNY
                      </div>
                      <el-input-number
                        class="!tw-w-[110px] input-number-controls"
                        v-model="form.batchShippingFeeCny"
                        placeholder="输入运费"
                        :min="0"
                        :controls="false"
                        @change="batchOperationFn(form.batchShippingFeeCny, 'shippingFeeCny')"
                        :disabled="props.disabled"
                      />
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>中国境内运费</div>
          </template>
          <template #default="scope">
            <div class="tw-flex tw-items-center">
              <div
                class="tw-bg-[#f5f7fa] tw-self-stretch tw-flex tw-items-center tw-px-2 tw-flex-shrink-0 tw-text-[#909399] tw-border-[#dcdfe6] tw-border tw-border-r-0 tw-rounded-[4px] tw-rounded-r-[0]"
              >
                CNY
              </div>
              <el-input-number
                class="!tw-w-[110px] input-number-controls"
                v-model="scope.row.shippingFeeCny"
                placeholder="输入运费"
                :min="0"
                :controls="false"
                @change="changeShippingFeeCny(scope.row)"
                :disabled="props.disabled"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="detailInfo.type !== 'A1'"
          label="包裹信息"
          header-align="left"
          align="left"
          property="createTime"
          width="600px"
        >
          <template #header>
            <div
              v-if="form.parcelOptions?.length > 0"
              class="tw-flex tw-items-center tw-justify-center"
            >
              包裹信息
              <el-button
                link
                type="primary"
                size="small"
                @click="setting"
                :disabled="props.disabled"
                >设置</el-button
              >
            </div>
            <div v-else>包裹信息</div>
          </template>
          <template #default="scope">
            <div class="tw-flex tw-items-center">
              <div v-if="form.parcelOptions.length <= 0 && !props.disabled">
                <el-popover
                  placement="right"
                  width="auto"
                  trigger="click"
                  v-model="isShowParcelOptions"
                >
                  <template #reference>
                    <el-select
                      v-model="scope.row.parcelSelected"
                      placeholder="选择包裹"
                      multiple
                      @change="parcelSelected(scope.$index)"
                      :disabled="props.disabled"
                    >
                      <el-option
                        v-for="(item, index) in form.parcelOptions"
                        :key="index"
                        :label="item.parcelName"
                        :value="item.parcelName"
                      />
                    </el-select>
                  </template>
                  <!-- 初始包裹 -->
                  <div class="pro_table" id="showParcel">
                    <el-form ref="initParcelFormRef" :model="form">
                      <div class="tw-flex tw-items-center tw-mb-2">
                        <el-input-number
                          v-model="form.length"
                          class="input-number"
                          :min="0"
                          :precision="1"
                          placeholder="长"
                          @change="calcVolume(form)"
                        />
                        <div class="unit">cm</div>
                        <el-input-number
                          v-model="form.width"
                          class="input-number"
                          :min="0"
                          :precision="1"
                          style="margin-left: 20px"
                          placeholder="宽"
                          @change="calcVolume(form)"
                        />
                        <div class="unit">cm</div>
                        <el-input-number
                          v-model="form.height"
                          class="input-number"
                          :min="0"
                          :precision="1"
                          style="margin-left: 20px"
                          placeholder="高"
                          @change="calcVolume(form)"
                        />
                        <div class="unit">cm</div>
                      </div>
                      <div class="tw-flex tw-items-center tw-justify-center">
                        <el-form-item
                          prop="volume"
                          :rules="[{ required: true, validator: valiNumberPass1, trigger: 'blur' }]"
                        >
                          <el-input-number
                            v-model="form.volume"
                            class="input-number"
                            :precision="4"
                            placeholder="体积"
                            @change="changeVolume(form.volume, form, 1)"
                          />
                          <div class="unit">m³</div>
                        </el-form-item>
                        <el-form-item
                          prop="weight"
                          :rules="[{ required: true, validator: valiNumberPass2, trigger: 'blur' }]"
                        >
                          <el-input-number
                            v-model="form.weight"
                            class="input-number"
                            :precision="2"
                            style="margin-left: 20px"
                            placeholder="重量"
                            @change="batchCalcWeight()"
                          />
                          <div class="unit">kg</div>
                        </el-form-item>
                      </div>
                    </el-form>
                    <div class="tw-w-full tw-text-right tw-mt-3">
                      <el-button link type="primary" @click="setInitParcel">添加包裹</el-button>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div v-else>
                <el-select
                  v-model="scope.row.parcelSelected"
                  placeholder="选择包裹"
                  multiple
                  @change="parcelSelected(scope.$index)"
                  :disabled="props.disabled"
                >
                  <el-option
                    v-for="(item, index) in form.parcelOptions"
                    :key="index"
                    :label="item.parcelName"
                    :value="item.parcelName"
                  />
                </el-select>
              </div>
              <!-- 商品列表展示所选的包裹 -->
              <div class="tw-flex tw-ml-3 tw-flex-col">
                <template v-for="(item, index) in scope.row.parcelJsonObj" :key="index">
                  <div
                    class="tw-flex tw-items-center"
                    :class="{ 'tw-mb-3': scope.row.parcelJsonObj.length > 1 }"
                  >
                    <div class="tw-mr-3 tw-text-sm tw-whitespace-nowrap">{{ item.parcelName }}</div>
                    <div class="tw-mr-3 tw-bg-[#FFF6EC] tw-p-2 tw-break-all tw-text-center">
                      <template v-if="item.gauge">
                        {{ item.gauge }}
                      </template>
                      <template v-else>
                        {{ item.length }}cm*{{ item.width }}cm*{{ item.height }}cm /
                        {{ item.volume }}m³ / {{ item.weight }}kg
                      </template>
                    </div>
                    <el-input
                      class="!tw-w-[60px] tw-ml-3"
                      v-model="item.count"
                      placeholder="数量"
                      type="number"
                      :min="0"
                      @change="changeParcelCount(scope.row)"
                      :disabled="props.disabled"
                    ></el-input>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 初始包裹 -->
    <!-- <div
      class="pro_table"
      id="showParcel"
      v-show="detailInfo.type !== 'A1' && isShowParcelOptions && !props.disabled"
    >
      <el-form ref="initParcelFormRef" :model="form">
        <div class="tw-flex tw-items-center tw-mb-2">
          <el-input-number
            v-model="form.length"
            class="input-number"
            :min="0"
            :precision="1"
            placeholder="长"
            @change="calcVolume(form)"
          />
          <div class="unit">cm</div>
          <el-input-number
            v-model="form.width"
            class="input-number"
            :min="0"
            :precision="1"
            style="margin-left: 20px"
            placeholder="宽"
            @change="calcVolume(form)"
          />
          <div class="unit">cm</div>
          <el-input-number
            v-model="form.height"
            class="input-number"
            :min="0"
            :precision="1"
            style="margin-left: 20px"
            placeholder="高"
            @change="calcVolume(form)"
          />
          <div class="unit">cm</div>
        </div>
        <div class="tw-flex tw-items-center tw-justify-center">
          <el-form-item
            prop="volume"
            :rules="[{ required: true, validator: valiNumberPass1, trigger: 'blur' }]"
          >
            <el-input-number
              v-model="form.volume"
              class="input-number"
              :precision="4"
              placeholder="体积"
              @change="changeVolume(form.volume, form, 1)"
            />
            <div class="unit">m³</div>
          </el-form-item>
          <el-form-item
            prop="weight"
            :rules="[{ required: true, validator: valiNumberPass2, trigger: 'blur' }]"
          >
            <el-input-number
              v-model="form.weight"
              class="input-number"
              :precision="2"
              style="margin-left: 20px"
              placeholder="重量"
              @change="batchCalcWeight()"
            />
            <div class="unit">kg</div>
          </el-form-item>
        </div>
      </el-form>
      <div class="tw-w-full tw-text-right tw-mt-3">
        <el-button link type="primary" @click="setInitParcel">添加包裹</el-button>
      </div>
    </div> -->
    <!-- 添加 -->
    <div class="tw-mt-5" v-if="!detailInfo.directStatus || detailInfo.directStatus !== 1">
      <el-button type="primary" @click="add" :disabled="props.disabled">添加</el-button>
    </div>

    <!-- 物流费用 -->
    <template v-if="detailInfo.type !== 'A1'">
      <div class="desc-title">物流费用</div>
      <!-- 国际物流方式 -->
      <div class="tw-flex">
        <el-checkbox-group
          v-model="form.checkList"
          @change="changeCheckbox(form.checkList)"
          :disabled="props.disabled"
        >
          <el-checkbox
            v-for="item in internationalShippingTypeListFn().filter((item) => item.value !== 'sky')"
            :key="item.value"
            :label="item.value"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>

        <!-- 最后一公里 -->
        <div v-if="detailInfo.lastShippingType === 1" class="tw-flex tw-items-center tw-ml-10">
          <span class="tw-text-sm tw-mr-2">最后一公里</span>
          <el-select
            v-model="form.logisticsConfigThId"
            class="m-2"
            placeholder="请选择"
            @change="selectLogisticsConfigTh"
            :disabled="props.disabled"
          >
            <el-option
              v-for="item in form.logisticsConfigTh"
              :key="item.id"
              :label="item.logisticsName"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
    </template>

    <!-- 包裹列表 -->
    <el-table
      v-if="detailInfo.type !== 'A1'"
      ref="multipleTableRef"
      :data="quoteOrderParcelList"
      :border="true"
      class="tw-mt-3"
    >
      <el-table-column label="包裹信息" header-align="center" align="center" width="360px">
        <template #default="scope">
          <div class="tw-flex tw-items-center">
            <div class="tw-flex tw-items-center tw-mb-3">
              <div class="tw-mr-3 tw-text-sm tw-whitespace-nowrap">{{ scope.row.parcelName }}</div>
              <div class="tw-mr-3 tw-bg-[#FFF6EC] tw-p-2 tw-break-all">
                <template v-if="scope.row.gauge">
                  {{ scope.row.gauge }}
                </template>
                <template v-else>
                  {{ scope.row.length }}cm*{{ scope.row.width }}cm*{{ scope.row.height }}cm /
                  {{ scope.row.volume }}m³ / {{ scope.row.weight }}kg
                </template>
              </div>
              <div class="tw-w-[50px] tw-p-2 tw-bg-[#EAEAEA]">X {{ scope.row.count }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="包裹商品" header-align="left" align="left" width="200px">
        <template #default="scope">
          <el-image
            v-for="(item, index) in scope.row.itemJsonObj"
            :key="index"
            v-show="item.imageUrl"
            class="tw-w-[50px] tw-h-[50px] tw-mr-2"
            :src="item.imageUrl"
            :preview-src-list="[item.imageUrl]"
            :initial-index="index"
            fit="cover"
            :z-index="9999"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column
        label="货物类型"
        header-align="left"
        align="left"
        property="itemType"
        width="150px"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.itemType"
            placeholder="选择"
            @change="changeItemType(scope.row.itemType, scope.$index)"
            :disabled="props.disabled"
          >
            <el-option
              v-for="(item, index) in itemTypeListFn()"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-if="form.checkList.includes('ocean')"
        label="海运"
        header-align="center"
        align="center"
      >
        <el-table-column prop="state" label="中转物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.transferFeeOcean"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="国际物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.internationalShippingFeeOcean"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="尾程物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.localShippingFeeOcean"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="form.checkList.includes('land_fast')"
        label="陆运"
        header-align="center"
        align="center"
      >
        <el-table-column prop="state" label="中转物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.transferFeeLand"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="国际物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.internationalShippingFeeLand"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="尾程物流" width="200px">
          <template #default="scope">
            <el-input
              v-model="scope.row.localShippingFeeLand"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeMoney"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="detailInfo.lastShippingType === 1"
        label="最后一公里"
        header-align="left"
        align="left"
        width="200px"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.lastShippingFee"
            placeholder="输入金额"
            :min="0"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @change="changeMoney"
            :disabled="props.disabled"
          >
            <template #prepend>{{ detailInfo.currency }}</template>
          </el-input>
        </template>
      </el-table-column>
    </el-table>

    <!-- 其他信息 -->
    <template
      v-if="
        (detailInfo.type !== 'A1' && quoteOrderParcelList?.length > 0) || detailInfo.type === 'A1'
      "
    >
      <div class="desc-title">其他信息</div>
      <el-table
        ref="multipleTableRef"
        :data="[{}]"
        :border="true"
        class="tw-mt-3"
        :class="{ '!tw-w-[300px]': detailInfo.type === 'A1' }"
      >
        <el-table-column label="服务费" header-align="left" align="left">
          <template #default>
            <el-input
              v-model="form.serviceFee"
              placeholder="输入金额"
              :min="0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="changeServiceFee"
              :disabled="props.disabled"
            >
              <template #prepend>{{ detailInfo.currency }}</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-if="detailInfo.type !== 'A1'"
          label="收费模式"
          header-align="left"
          align="left"
        >
          <template #default>
            <el-radio-group v-model="form.isFinalPrice" :disabled="props.disabled">
              <el-radio-button
                v-for="(item, index) in chargeModeFn()"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 报价预览 -->
    <QuotationPreview
      v-if="
        (detailInfo.type !== 'A1' && quoteOrderParcelList?.length > 0) || detailInfo.type === 'A1'
      "
      :detailInfo="detailInfo"
      :quotationPreviewList="quotationPreviewList"
      :checkList="form.checkList"
      :disabled="props.disabled"
      @setGrossRete="handleGrossRete"
      @changeSalesMoney="handleSalesMoney"
    />

    <!-- 添加商品 -->
    <AddProduct ref="AddProductRef" @addProduct="handleAddProduct" />

    <!-- 设置包裹 -->
    <CommonPackageInfo ref="PackageRef" @submit="handleSubmitPackage" />

    <!-- 设置毛利率 -->
    <CommonPricePanel ref="PriceRef" @submit="handleSubmitGrossRete" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NP from 'number-precision'
import AddProduct from '../dialog/AddProduct.vue'
import CommonPackageInfo from '@/components/CommonPackageInfo.vue'
import CommonPricePanel from '@/components/CommonPricePanel.vue'
import QuotationPreview from './QuotationPreview.vue'
import { internationalShippingTypeListFn, itemTypeListFn, chargeModeFn } from '@/utils/options'
import { useQuotationInfo } from '../hook/quotationInfoHook'
import { openUrl } from '@/utils/util'
import { packageList, list } from '../hook/mock'

const props = defineProps<{
  disabled: boolean
}>()

const {
  form,
  quoteOrderItemList,
  quoteOrderParcelList,
  AddProductRef,
  PackageRef,
  initParcelFormRef,
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
} = useQuotationInfo()

// 数据回填
const init = async (data: any) => {
  Object.assign(detailInfo, data)
  Object.assign(baseNumberObj, data.baseNumberObj)
  Object.assign(form, data.quoteOrderV2)
  form.logisticsConfigTh = baseNumberObj.logisticsConfigTh
  if (data.type === 'A1') {
    form.serviceFee = baseNumberObj.serviceFeeGlobal
  }
  // 从需求信息中获取商品列表
  if (!data.quoteOrderV2) {
    await data.itemList.forEach((item: any) => {
      const productObj: any = {}
      productObj.purchaseCount = item.purchaseCount
      productObj.purchaseFeeCny = item.purchaseFee
      productObj.purchaseFee = NP.round(NP.times(item.purchaseFee, detailInfo.rate), 2)
      productObj.collectionAttribute = item.collectionAttribute
      productObj.purchaseUrl = item.purchaseUrl
      productObj.imageUrl = item.imageUrl
      productObj.productName = item.productName
      productObj.sellerSku = item.sellerSku
      productObj.skuCode = item.skuCode
      // console.log('采购单价,用于展示', productObj.purchaseFeeCny)
      // console.log('采购单价x汇率rate', productObj.purchaseFee)
      handleAddProduct(productObj)
    })
    await quotationPreview()
  }
  console.log('init', detailInfo)
  // 暂存回显
  if (data.quoteOrderV2) {
    quoteOrderItemList.value = data.quoteOrderV2.quoteOrderItemList
    quoteOrderParcelList.value = data.quoteOrderV2.quoteOrderParcelList
    form.checkList = data.quoteOrderV2.internationalShippingType.split(',')
    form.parcelOptions = quoteOrderParcelList.value.map((item: any) => {
      return {
        parcelName: item.parcelName,
        length: item.length,
        width: item.width,
        height: item.height,
        volume: item.volume,
        weight: item.weight
      }
    })
    quoteOrderItemList.value.forEach((item: any) => {
      item.parcelSelected = item.parcelJsonObj.map((e: any) => {
        e.imageUrl = item.imageUrl
        e.productName = item.productName
        e.collectionAttribute = item.collectionAttribute
        return e.parcelName
      })
    })
    await showQuotationPreview(data.quoteOrderV2)
  }
}

// 报价单详情回显
const quoteDetailsInit = async (data: any) => {
  Object.assign(detailInfo, data)
  Object.assign(form, data)
  form.logisticsConfigTh = data.logisticsConfigTh
  // console.log(data)
  // console.log(form)
  console.log('quoteDetailsInit', detailInfo)
  quoteOrderItemList.value = data.quoteOrderItemList
  quoteOrderParcelList.value = data.quoteOrderParcelList
  form.checkList = data.internationalShippingTypeList
  form.parcelOptions = quoteOrderParcelList.value.map((item: any) => {
    return {
      parcelName: item.parcelName,
      length: item.length,
      width: item.width,
      height: item.height,
      volume: item.volume,
      weight: item.weight
    }
  })
  quoteOrderItemList.value.forEach((item: any) => {
    item.parcelSelected = item.parcelJsonObj.map((e: any) => {
      e.imageUrl = item.imageUrl
      e.productName = item.productName
      e.collectionAttribute = item.collectionAttribute
      return e.parcelName
    })
  })
  await showQuotationPreview(data)
}

onMounted(() => {
  // list.forEach((item: any) => {
  //   handleAddProduct(item)
  // })
  // quoteOrderParcelList.value = packageList
  // 显示添加包裹 - 点击其他区域时, 隐藏指定区域(cDom)
  // document.addEventListener('click', (event) => {
  //   const cDom: any = document.querySelector('#showParcel')
  //   const tDom: any = event.target
  //   if (cDom == tDom || cDom.contains(tDom)) {
  //     // console.log(cDom)
  //   } else {
  //     isShowParcelOptions.value = false
  //   }
  // })
})

const purchaseUrlClick = (purchaseUrl: string, disabled: boolean) => {
  if (disabled) {
    openUrl(purchaseUrl)
  }
}

defineOptions({ name: 'QuotationInfo.vue' })
defineExpose({
  init,
  quoteDetailsInit,
  form,
  quoteOrderItemList,
  quoteOrderParcelList,
  formRules,
  quotationPreviewList,
  handleSubmitSalesMoney
})
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
.QuotationInfo {
  ::v-deep .el-input-group__prepend {
    padding: 0 8px;
  }
}
.table-form {
  ::v-deep .el-form-item {
    margin-bottom: 0 !important;
  }
}
.input-number-controls {
  ::v-deep .el-input__wrapper {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left-width: 0px !important;
  }
}
.purchase-url {
  ::v-deep .el-input__inner {
    color: blue !important;
    cursor: pointer;
  }
}
</style>
