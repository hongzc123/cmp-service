<template>
  <el-dialog title="包裹信息" v-model="visible" width="1100px" :close-on-click-modal="false">
    <el-table :data="data" border>
      <el-table-column label="长*宽*高" width="500px">
        <template #default="scope">
          <div class="tw-flex tw-items-center">
            <el-input-number
              v-model="scope.row.length"
              :min="0"
              :precision="1"
              :controls="false"
              @change="calcVolume(scope.row)"
            />
            <div
              class="tw-bg-gray-200 tw-self-stretch tw-flex tw-items-center tw-px-3 tw-flex-shrink-0"
            >
              cm
            </div>
            <div class="tw-px-2">X</div>
            <el-input-number
              v-model="scope.row.width"
              :min="0"
              :precision="1"
              :controls="false"
              @change="calcVolume(scope.row)"
            />
            <div
              class="tw-bg-gray-200 tw-self-stretch tw-flex tw-items-center tw-px-3 tw-flex-shrink-0"
            >
              cm
            </div>
            <div class="tw-px-2">X</div>
            <el-input-number
              v-model="scope.row.height"
              :min="0"
              :precision="1"
              :controls="false"
              @change="calcVolume(scope.row)"
            />
            <div
              class="tw-bg-gray-200 tw-self-stretch tw-flex tw-items-center tw-px-3 tw-flex-shrink-0"
            >
              cm
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="体积" width="250px">
        <template #default="scope">
          <div class="tw-flex tw-items-center">
            <el-input-number
              v-model="scope.row.volume"
              :min="0.0001"
              :precision="4"
              :controls="false"
              @change="changeVolume(scope.row.volume, scope.row, 2)"
            />
            <div
              class="tw-bg-gray-200 tw-self-stretch tw-flex tw-items-center tw-px-3 tw-flex-shrink-0"
            >
              m³
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="250px">
        <template #default="scope">
          <div class="tw-flex tw-items-center">
            <el-input-number
              v-model="scope.row.weight"
              :min="0.01"
              :precision="2"
              :controls="false"
            />
            <div
              class="tw-bg-gray-200 tw-self-stretch tw-flex tw-items-center tw-px-3 tw-flex-shrink-0"
            >
              kg
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" fixed="right">
        <template #default="scope">
          <el-icon
            :size="20"
            class="hover:tw-cursor-pointer !tw-text-red-400"
            @click="handleDel(scope.$index)"
          >
            <Delete />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="tw-mt-2" @click="handleAdd">添加+</el-button>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useQuotationInfo } from '@/views/QuotationManages/hook/quotationInfoHook'
const { calcVolume, changeVolume } = useQuotationInfo()

/**
 * 包裹信息列表弹窗组件
 */
defineOptions({ name: 'CommonPackageInfo.vue' })

import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

interface PackageRow {
  width: number
  length: number
  height: number
  weight: number
  volume: number
  parcelName: string
  [key: string]: any
}

const visible = ref(false)
const data: PackageRow[] = reactive([])
const emits = defineEmits(['submit'])

/**
 * 打开时回调
 * @param arr 外部传入的包裹行数据，如果不传则默认添加空包裹行数据
 */
const handleOpen = (arr: PackageRow[] | undefined) => {
  visible.value = true
  data.length = 0 // 清空数组
  if (arr?.length) Object.assign(data, arr)
  else handleAdd()
}

const createPackageName = () => {
  parseInt('包裹123'.slice(2)) + 1
}

/**
 * 删除包裹行
 * @param index 行索引
 */
const handleDel = (index: number) => {
  if (data.length === 1) {
    ElMessage.info('至少保留一个包裹信息')
    return
  }
  data.splice(index, 1)
}

/**
 * 新增包裹行
 */
const handleAdd = () => {
  let num: number = data.length
  const obj = {
    width: 0,
    length: 0,
    height: 0,
    weight: 0,
    volume: 0,
    parcelName: `包裹${num + 1}`
  }
  data.push(obj)
}

/**
 * 提交包裹行
 */
const handleSubmit = () => {
  if (_checkValid()) {
    visible.value = false
    emits('submit', data)
  } else {
    ElMessage.info('请完善信息')
  }
}

const _checkValid = () => {
  return data.every((item: PackageRow) => {
    const keys: string[] = Object.keys(item)
    return keys.every((key) => {
      if ((item[key] as any) instanceof Number) {
        return item[key] > 0
      }
      return true
    })
  })
}

defineExpose({ handleOpen })
</script>

<style lang="scss" scoped></style>
