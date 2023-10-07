<template>
  <el-card v-if="keys.length">
    <!-- 写一个 el-form 表单，循环 keys，并赋值对应的 form 对象 -->
    <el-form :inline="true" :model="form">
      <el-form-item v-for="key in keys" :key="key" :label="searchTypes[key].label">
        <!-- 输入框 -->
        <el-input
          v-if="searchTypes[key].type === 'string'"
          v-model="form[key]"
          :placeholder="searchTypes[key].placeholder"
          clearable
          class="!tw-w-[200px]"
        ></el-input>
        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="searchTypes[key].type === 'date'"
          v-model="form[key]"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          clearable
        ></el-date-picker>
        <!-- 单选框 -->
        <el-select
          v-else-if="searchTypes[key].type === 'select'"
          v-model="form[key]"
          :placeholder="searchTypes[key].placeholder"
          clearable
          filterable
        >
          <el-option
            v-for="item in searchTypes[key].options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="default" @click="handleExport">导出</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

defineOptions({ name: 'CommonSearch.vue' })

const props = defineProps<{
  searchTypes: SearchTypes
}>()
const emit = defineEmits(['change', 'export'])
const form: any = reactive({})
const keys: string[] = []

/**
 * 初始化搜索表单
 * @param searchTypes
 */
const init = (searchTypes: SearchTypes) => {
  const obj: any = {}
  Object.keys(searchTypes).forEach((key: string) => {
    if (searchTypes[key].type === 'date') {
      obj[key] = []
    } else {
      obj[key] = ''
    }
    keys.push(key)
  })
  Object.assign(form, obj)
}

const handleSearch = () => {
  emit('change', true)
}
const handleExport = () => {
  emit('export')
}
const handleReset = () => {
  init(props.searchTypes)
}

watch(
  () => props.searchTypes,
  (val: SearchTypes) => {
    init(val)
  },
  { immediate: true }
)

defineExpose({ form })
</script>

<style lang="scss" scoped></style>
